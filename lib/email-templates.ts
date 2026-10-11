import { CLINIC } from "./site-config";
import { normalizeNotificationLang } from "./notification-lang";

const CLINIC_PHONE = CLINIC.phone;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export type DoctorApprovalEmailParams = {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
  confirmUrl: string;
  suggestUrl: string;
};

export const doctorApprovalEmail = (
  lang: string | undefined,
  params: DoctorApprovalEmailParams,
) => {
  const l = normalizeNotificationLang(lang);

  const text =
    l === "en"
      ? {
          subject: `New appointment request — ${params.date} ${params.startTime}`,
          heading: "New appointment request",
          intro:
            "A patient has requested the appointment below. Confirm to add it to your calendar and notify the patient.",
          confirm: "Confirm appointment",
          suggest: "Suggest another time",
          name: "Name",
          email: "Email",
          phone: "Phone",
          date: "Date",
          time: "Time",
          notes: "Notes",
        }
      : l === "fa"
        ? {
            subject: `درخواست وقت جدید — ${params.date} ${params.startTime}`,
            heading: "درخواست وقت جدید",
            intro:
              "یک بیمار درخواست وقت زیر را ثبت کرده است. برای افزودن به تقویم و اطلاع‌رسانی به بیمار تأیید کنید.",
            confirm: "تأیید وقت",
            suggest: "پیشنهاد زمان دیگر",
            name: "نام",
            email: "ایمیل",
            phone: "تلفن",
            date: "تاریخ",
            time: "ساعت",
            notes: "یادداشت",
          }
        : {
            subject: `Új időpontkérés — ${params.date} ${params.startTime}`,
            heading: "Új időpontkérés",
            intro:
              "Egy páciens az alábbi időpontot kérte. Erősítse meg a naptárba vételhez és a páciens értesítéséhez.",
            confirm: "Időpont megerősítése",
            suggest: "Másik időpont javaslása",
            name: "Név",
            email: "E-mail",
            phone: "Telefon",
            date: "Dátum",
            time: "Idő",
            notes: "Megjegyzés",
          };

  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#666;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:4px 0;">${escapeHtml(value)}</td></tr>`;

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;">
      <h2 style="margin-bottom:8px;">${text.heading}</h2>
      <p style="color:#444;line-height:1.6;">${text.intro}</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        ${row(text.name, params.patientName)}
        ${row(text.email, params.patientEmail)}
        ${row(text.phone, params.patientPhone)}
        ${row(text.date, params.date)}
        ${row(text.time, `${params.startTime} – ${params.endTime}`)}
        ${params.notes ? row(text.notes, params.notes) : ""}
      </table>
      <a href="${params.confirmUrl}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:9999px;font-weight:600;">${text.confirm}</a>
      <div style="margin-top:12px;">
        <a href="${params.suggestUrl}" style="display:inline-block;background:#ffffff;color:#111827;text-decoration:none;padding:11px 28px;border-radius:9999px;font-weight:600;border:1px solid #d1d5db;">${text.suggest}</a>
      </div>
    </div>
  `;

  return { subject: text.subject, html };
};

export type PatientConfirmationEmailParams = {
  firstName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
};

export const patientConfirmationEmail = (
  lang: string | undefined,
  params: PatientConfirmationEmailParams,
) => {
  const l = normalizeNotificationLang(lang);
  const firstName = escapeHtml(params.firstName);
  const date = escapeHtml(params.date);
  const startTime = escapeHtml(params.startTime);
  const endTime = escapeHtml(params.endTime);
  const location = escapeHtml(params.location);

  const text =
    l === "en"
      ? {
          subject: "Your RadDent appointment is confirmed",
          eyebrow: "Appointment confirmed",
          greeting: `Hi ${firstName},`,
          intro: "Your appointment has been confirmed. Here are the details:",
          date: "Date",
          time: "Time",
          location: "Location",
          footerTop: "See you soon!",
          footerBottom:
            "Need to reschedule or cancel? Please let us know at least 24 hours in advance. Call the clinic:",
        }
      : l === "fa"
        ? {
            subject: "وقت رادنت شما تأیید شد",
            eyebrow: "وقت شما تأیید شد",
            greeting: `سلام ${firstName}،`,
            intro: "وقت شما تأیید شد. جزئیات آن به شرح زیر است:",
            date: "تاریخ",
            time: "ساعت",
            location: "آدرس",
            footerTop: "به زودی می‌بینیمتان!",
            footerBottom:
              "برای تغییر یا لغو وقت، لطفاً حداقل ۲۴ ساعت قبل اطلاع دهید. تماس با کلینیک:",
          }
        : {
            subject: "A RadDent időpontja megerősítve",
            eyebrow: "Időpont megerősítve",
            greeting: `Kedves ${firstName},`,
            intro: "Időpontját megerősítettük. Az adatok:",
            date: "Dátum",
            time: "Idő",
            location: "Helyszín",
            footerTop: "Hamarosan találkozunk!",
            footerBottom:
              "Módosítás vagy lemondás esetén kérjük, legalább 24 órával korábban jelezze. Hívja a rendelőt:",
          };

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:9px 12px 9px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:9px 0;color:#111827;font-size:14px;font-weight:600;">${value}</td>
    </tr>`;

  const html = `
    <div style="background:#f4f4f7;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <table role="presentation" style="max-width:480px;width:100%;margin:0 auto;background:#ffffff;border-radius:20px;border:1px solid #eceef1;border-collapse:separate;overflow:hidden;">
        <tr>
          <td style="background:#0b0f1a;padding:22px 32px;text-align:center;">
            <span style="color:#ffffff;font-size:15px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">RadDent</span>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 32px 32px;">
            <div style="width:52px;height:52px;line-height:52px;border-radius:50%;background:#ecfdf5;color:#059669;font-size:24px;text-align:center;margin:0 auto 20px;">&#10003;</div>
            <h1 style="text-align:center;font-size:19px;color:#111827;margin:0 0 8px;font-weight:700;">${text.eyebrow}</h1>
            <p style="text-align:center;color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 26px;">${text.greeting}<br/>${text.intro}</p>
            <div style="background:#f9fafb;border-radius:14px;padding:2px 18px;margin-bottom:26px;">
              <table role="presentation" style="width:100%;border-collapse:collapse;">
                ${row(text.date, date)}
                ${row(text.time, `${startTime} – ${endTime}`)}
                ${row(text.location, location)}
              </table>
            </div>
            <p style="text-align:center;color:#111827;font-size:14px;margin:0 0 4px;">${text.footerTop}</p>
            <p style="text-align:center;color:#9ca3af;font-size:12px;line-height:1.6;margin:0;">${text.footerBottom}<br/><strong style="color:#374151;">${CLINIC_PHONE}</strong></p>
          </td>
        </tr>
      </table>
    </div>
  `;

  return { subject: text.subject, html };
};

export type PatientSuggestionEmailParams = {
  firstName: string;
  requestedDate: string;
  requestedStartTime: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  confirmUrl: string;
};

export const patientSuggestionEmail = (
  lang: string | undefined,
  params: PatientSuggestionEmailParams,
) => {
  const l = normalizeNotificationLang(lang);
  const firstName = escapeHtml(params.firstName);
  const requested = escapeHtml(
    `${params.requestedDate} ${params.requestedStartTime}`,
  );
  const date = escapeHtml(params.date);
  const startTime = escapeHtml(params.startTime);
  const endTime = escapeHtml(params.endTime);
  const location = escapeHtml(params.location);

  const text =
    l === "en"
      ? {
          subject: "A new time for your RadDent appointment",
          eyebrow: "New time suggested",
          greeting: `Hi ${firstName},`,
          intro: `Unfortunately, the time you requested (${requested}) is not available. The doctor suggests the following time instead:`,
          date: "Date",
          time: "Time",
          location: "Location",
          confirm: "Confirm this time",
          decline:
            "If this time doesn't suit you, please call us and we'll arrange your appointment by phone:",
        }
      : l === "fa"
        ? {
            subject: "زمان جدید برای وقت رادنت شما",
            eyebrow: "زمان جدید پیشنهاد شد",
            greeting: `سلام ${firstName}،`,
            intro: `متأسفانه زمان درخواستی شما (${requested}) در دسترس نیست. دکتر زمان زیر را پیشنهاد می‌کند:`,
            date: "تاریخ",
            time: "ساعت",
            location: "آدرس",
            confirm: "تأیید این زمان",
            decline:
              "اگر این زمان برای شما مناسب نیست، لطفاً با ما تماس بگیرید تا وقت شما را تلفنی تنظیم کنیم:",
          }
        : {
            subject: "Új időpont a RadDent foglalásához",
            eyebrow: "Új időpontot javasoltunk",
            greeting: `Kedves ${firstName},`,
            intro: `Sajnos az Ön által kért időpont (${requested}) nem elérhető. Az orvos helyette az alábbi időpontot javasolja:`,
            date: "Dátum",
            time: "Idő",
            location: "Helyszín",
            confirm: "Időpont elfogadása",
            decline:
              "Ha ez az időpont nem megfelelő, kérjük, hívjon minket, és telefonon egyeztetjük az időpontot:",
          };

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:9px 12px 9px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:9px 0;color:#111827;font-size:14px;font-weight:600;">${value}</td>
    </tr>`;

  const html = `
    <div style="background:#f4f4f7;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <table role="presentation" style="max-width:480px;width:100%;margin:0 auto;background:#ffffff;border-radius:20px;border:1px solid #eceef1;border-collapse:separate;overflow:hidden;">
        <tr>
          <td style="background:#0b0f1a;padding:22px 32px;text-align:center;">
            <span style="color:#ffffff;font-size:15px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">RadDent</span>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 32px 32px;">
            <h1 style="text-align:center;font-size:19px;color:#111827;margin:0 0 8px;font-weight:700;">${text.eyebrow}</h1>
            <p style="text-align:center;color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 26px;">${text.greeting}<br/>${text.intro}</p>
            <div style="background:#f9fafb;border-radius:14px;padding:2px 18px;margin-bottom:26px;">
              <table role="presentation" style="width:100%;border-collapse:collapse;">
                ${row(text.date, date)}
                ${row(text.time, `${startTime} – ${endTime}`)}
                ${row(text.location, location)}
              </table>
            </div>
            <div style="text-align:center;margin-bottom:26px;">
              <a href="${params.confirmUrl}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:9999px;font-weight:600;">${text.confirm}</a>
            </div>
            <p style="text-align:center;color:#6b7280;font-size:13px;line-height:1.6;margin:0;">${text.decline}<br/><strong style="color:#374151;">${CLINIC_PHONE}</strong></p>
          </td>
        </tr>
      </table>
    </div>
  `;

  return { subject: text.subject, html };
};

export type DoctorSuggestionAcceptedEmailParams = {
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
};

export const doctorSuggestionAcceptedEmail = (
  lang: string | undefined,
  params: DoctorSuggestionAcceptedEmailParams,
) => {
  const l = normalizeNotificationLang(lang);
  const name = escapeHtml(params.patientName);
  const when = escapeHtml(
    `${params.date} ${params.startTime} – ${params.endTime}`,
  );

  const text =
    l === "en"
      ? {
          subject: `Suggested time accepted — ${params.date} ${params.startTime}`,
          body: `${name} accepted your suggested time (${when}). The appointment has been added to your calendar.`,
        }
      : l === "fa"
        ? {
            subject: `زمان پیشنهادی پذیرفته شد — ${params.date} ${params.startTime}`,
            body: `${name} زمان پیشنهادی شما (${when}) را پذیرفت. این وقت به تقویم شما اضافه شد.`,
          }
        : {
            subject: `Javasolt időpont elfogadva — ${params.date} ${params.startTime}`,
            body: `${name} elfogadta az Ön által javasolt időpontot (${when}). Az időpont bekerült a naptárba.`,
          };

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;">
      <p style="color:#111827;line-height:1.6;">${text.body}</p>
    </div>
  `;

  return { subject: text.subject, html };
};
