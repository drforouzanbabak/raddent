import { NextResponse } from "next/server";
import { verifyAppointmentToken } from "@/lib/appointment-token";
import { getPatientById } from "@/actions/google_sheet";
import {
  createPatientCalendarEvent,
  getCalendarEventsForDate,
} from "@/actions/google_calendar";
import { sendEmail } from "@/lib/functions";
import { patientConfirmationEmail } from "@/lib/email-templates";

export const dynamic = "force-dynamic";

const buildBudapestISO = (date: string, time: string) =>
  `${date}T${time}:00+02:00`;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderPage = (title: string, message: string) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
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

const htmlResponse = (title: string, message: string, status: number) =>
  new NextResponse(renderPage(title, message), {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });

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
      return htmlResponse(
        "Already confirmed",
        "This appointment has already been confirmed and added to the calendar.",
        200,
      );
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
    return htmlResponse(
      "Could not confirm",
      (error as Error).message || "Something went wrong.",
      500,
    );
  }
}
