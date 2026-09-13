import { normalizeNotificationLang } from "./notification-lang";

const CLINIC_PHONE = "+36 70 746 0776";

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
          suggestSubject: "Revised time slot — RadDent appointment",
          suggestBody: (p: DoctorApprovalEmailParams) =>
            `Hi ${p.patientName},\n\nUnfortunately, the requested time (${p.date} ${p.startTime}–${p.endTime}) is not available.\n\nInstead, I suggest the following time(s):\n\n[ WRITE THE SUGGESTED TIME(S) HERE ]\n\n\nIf one of these times works for you, please book it through our website and we'll confirm it. Otherwise, for any other time, please call us at ${CLINIC_PHONE}.\n\nBest regards,\nRadDent`,
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
            suggestSubject: "زمان پیشنهادی جدید — وقت رادنت",
            suggestBody: (p: DoctorApprovalEmailParams) =>
              `${p.patientName} عزیز،\n\nمتأسفانه زمان درخواستی (${p.date} ${p.startTime}–${p.endTime}) در دسترس نیست.\n\nبه‌جای آن، زمان(های) زیر را پیشنهاد می‌کنم:\n\n[ زمان(های) پیشنهادی را اینجا بنویسید ]\n\n\nاگر یکی از این زمان‌ها برای شما مناسب است، لطفاً از طریق وب‌سایت رزرو کنید تا آن را تأیید کنیم. در غیر این صورت، برای هر زمان دیگری لطفاً با شماره ${CLINIC_PHONE} تماس بگیرید.\n\nبا احترام،\nرادنت`,
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
            suggestSubject: "Módosított időpont — RadDent",
            suggestBody: (p: DoctorApprovalEmailParams) =>
              `Kedves ${p.patientName}!\n\nSajnos a kért időpont (${p.date} ${p.startTime}–${p.endTime}) nem elérhető.\n\nHelyette az alábbi időponto(ka)t javaslom:\n\n[ ÍRJA IDE A JAVASOLT IDŐPONTO(KA)T ]\n\n\nHa valamelyik időpont megfelel Önnek, kérjük, foglalja le weboldalunkon, és visszaigazoljuk. Egyéb időpont esetén kérjük, hívjon minket a ${CLINIC_PHONE} számon.\n\nÜdvözlettel,\nRadDent`,
          };

  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#666;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:4px 0;">${escapeHtml(value)}</td></tr>`;

  const mailtoHref = `mailto:${params.patientEmail}?subject=${encodeURIComponent(text.suggestSubject)}&body=${encodeURIComponent(text.suggestBody(params))}`;

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
        <a href="${escapeHtml(mailtoHref)}" style="display:inline-block;background:#ffffff;color:#111827;text-decoration:none;padding:11px 28px;border-radius:9999px;font-weight:600;border:1px solid #d1d5db;">${text.suggest}</a>
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
