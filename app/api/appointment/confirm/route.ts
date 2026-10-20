import { NextResponse } from "next/server";
import { verifyAppointmentToken } from "@/lib/appointment-token";
import { getPatientById } from "@/actions/google_sheet";
import {
  createPatientCalendarEvent,
  getCalendarEventsForDate,
  isSlotAvailable,
} from "@/actions/google_calendar";
import { sendEmail } from "@/lib/functions";
import {
  doctorSuggestionAcceptedEmail,
  patientConfirmationEmail,
} from "@/lib/email-templates";
import {
  normalizeNotificationLang,
  type NotificationLang,
} from "@/lib/notification-lang";
import { CLINIC } from "@/lib/site-config";
import { buildBudapestISO } from "@/lib/budapest-time";

export const dynamic = "force-dynamic";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderPage = (
  title: string,
  message: string,
  lang: NotificationLang = "en",
) => `<!doctype html>
<html lang="${lang}"${lang === "fa" ? ' dir="rtl"' : ""}><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;
    font-family:system-ui,-apple-system,sans-serif;background:#0b0f1a;color:#e5e7eb;}
  .card{max-width:440px;text-align:center;background:#131a2b;border:1px solid rgba(255,255,255,.1);
    border-radius:24px;padding:36px 32px;}
  h1{font-size:1.25rem;margin:0 0 12px;}
  p{color:#9ca3af;line-height:1.6;margin:0;}
</style></head>
<body><div class="card"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p></div></body></html>`;

const htmlResponse = (
  title: string,
  message: string,
  status: number,
  lang?: NotificationLang,
) =>
  new NextResponse(renderPage(title, message, lang), {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });

// Pages shown to the patient after clicking "Confirm" on a doctor-suggested
// time, in the patient's language.
const PATIENT_PAGES: Record<
  NotificationLang,
  {
    confirmedTitle: string;
    confirmed: (date: string, time: string) => string;
    alreadyTitle: string;
    already: string;
    takenTitle: string;
    taken: string;
    errorTitle: string;
    error: string;
  }
> = {
  en: {
    confirmedTitle: "Appointment confirmed",
    confirmed: (date, time) =>
      `Thank you! Your appointment on ${date} at ${time} is booked. We've sent you a confirmation email.`,
    alreadyTitle: "Already confirmed",
    already: "This appointment has already been confirmed.",
    takenTitle: "Time no longer available",
    taken: `Sorry, this time has been taken in the meantime. Please call us at ${CLINIC.phone} and we'll arrange your appointment by phone.`,
    errorTitle: "Could not confirm",
    error: `Something went wrong. Please call us at ${CLINIC.phone}.`,
  },
  hu: {
    confirmedTitle: "Időpont megerősítve",
    confirmed: (date, time) =>
      `Köszönjük! Időpontját lefoglaltuk: ${date}, ${time}. Visszaigazoló e-mailt küldtünk Önnek.`,
    alreadyTitle: "Már megerősítve",
    already: "Ezt az időpontot már megerősítette.",
    takenTitle: "Az időpont már nem elérhető",
    taken: `Sajnáljuk, ezt az időpontot időközben lefoglalták. Kérjük, hívjon minket a ${CLINIC.phone} számon, és telefonon egyeztetjük az időpontot.`,
    errorTitle: "A megerősítés nem sikerült",
    error: `Hiba történt. Kérjük, hívjon minket a ${CLINIC.phone} számon.`,
  },
  fa: {
    confirmedTitle: "وقت شما تأیید شد",
    confirmed: (date, time) =>
      `متشکریم! وقت شما برای ${date} ساعت ${time} ثبت شد. ایمیل تأیید برایتان ارسال شد.`,
    alreadyTitle: "قبلاً تأیید شده",
    already: "این وقت قبلاً تأیید شده است.",
    takenTitle: "این زمان دیگر در دسترس نیست",
    taken: `متأسفیم، این زمان در این فاصله رزرو شده است. لطفاً با شماره ${CLINIC.phone} تماس بگیرید تا وقت شما را تلفنی تنظیم کنیم.`,
    errorTitle: "تأیید انجام نشد",
    error: `مشکلی پیش آمد. لطفاً با شماره ${CLINIC.phone} تماس بگیرید.`,
  },
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return htmlResponse(
      "Invalid link",
      "This confirmation link is missing its token.",
      400,
    );
  }

  let payload;
  try {
    payload = verifyAppointmentToken(token);
  } catch (error: unknown) {
    return htmlResponse(
      "Invalid link",
      (error as Error).message || "This confirmation link is invalid.",
      400,
    );
  }

  const isPatient = payload.purpose === "patient";
  const lang = normalizeNotificationLang(payload.language);
  const patientText = PATIENT_PAGES[lang];

  try {
    const patient = await getPatientById(payload.patientId);
    if (!patient) {
      return htmlResponse(
        "Patient not found",
        "We couldn't find this patient's record anymore.",
        404,
      );
    }

    const startDateTime = buildBudapestISO(payload.date, payload.startTime);
    const endDateTime = buildBudapestISO(payload.date, payload.endTime);

    const existingEvents = await getCalendarEventsForDate(payload.date);
    const alreadyConfirmed = existingEvents.some(
      (event) =>
        event.status !== "cancelled" &&
        event.extendedProperties?.private?.patientId === payload.patientId &&
        event.start?.dateTime &&
        Date.parse(event.start.dateTime) === Date.parse(startDateTime),
    );

    if (alreadyConfirmed) {
      return isPatient
        ? htmlResponse(patientText.alreadyTitle, patientText.already, 200, lang)
        : htmlResponse(
            "Already confirmed",
            "This appointment has already been confirmed and added to the calendar.",
            200,
          );
    }

    // The doctor picked a free slot when suggesting it, but it may have been
    // booked since — don't double-book on the patient's behalf.
    if (
      isPatient &&
      !(await isSlotAvailable(payload.date, payload.startTime))
    ) {
      return htmlResponse(patientText.takenTitle, patientText.taken, 409, lang);
    }

    await createPatientCalendarEvent(
      patient,
      payload.summary,
      startDateTime,
      endDateTime,
      payload.location,
      { useDefault: true },
      payload.language,
    );

    let notified = false;

    if (patient.email) {
      try {
        const { subject, html } = patientConfirmationEmail(payload.language, {
          firstName: patient.firstName,
          date: payload.date,
          startTime: payload.startTime,
          endTime: payload.endTime,
          location: payload.location,
        });
        await sendEmail({ to: patient.email, subject, html });
        notified = true;
      } catch (error: unknown) {
        console.error(
          "Patient email confirmation failed:",
          (error as Error).message,
        );
      }
    }

    if (isPatient) {
      const doctorEmail =
        process.env.DOCTOR_EMAIL || process.env.GOOGLE_EMAIL_ADDRESS;
      if (doctorEmail) {
        try {
          const { subject, html } = doctorSuggestionAcceptedEmail(
            payload.language,
            {
              patientName: `${patient.firstName} ${patient.lastName}`.trim(),
              date: payload.date,
              startTime: payload.startTime,
              endTime: payload.endTime,
            },
          );
          await sendEmail({ to: doctorEmail, subject, html });
        } catch (error: unknown) {
          console.error(
            "Doctor notification failed:",
            (error as Error).message,
          );
        }
      }

      return htmlResponse(
        patientText.confirmedTitle,
        patientText.confirmed(
          payload.date,
          `${payload.startTime}–${payload.endTime}`,
        ),
        200,
        lang,
      );
    }

    return htmlResponse(
      "Appointment confirmed",
      `${patient.firstName} ${patient.lastName} is booked for ${payload.date} at ${payload.startTime}.` +
        (notified
          ? " The patient has been notified by email."
          : " The patient could not be notified automatically — please contact them directly."),
      200,
    );
  } catch (error: unknown) {
    console.error("Appointment confirmation failed:", (error as Error).message);
    if (isPatient) {
      return htmlResponse(patientText.errorTitle, patientText.error, 500, lang);
    }
    return htmlResponse(
      "Could not confirm",
      (error as Error).message || "Something went wrong.",
      500,
    );
  }
}
