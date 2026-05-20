export type SmsLang = "hu" | "en" | "fa";

export const normalizeSmsLang = (lang: string | undefined): SmsLang => {
  if (!lang) return "hu";
  const lower = lang.trim().toLowerCase();
  if (lower === "en" || lower === "eng" || lower === "english") return "en";
  if (lower === "fa" || lower === "farsi" || lower === "persian") return "fa";
  return "hu";
};

export type BookingSmsParams = {
  firstName: string;
  date: string;
  time: string;
};

export const bookingConfirmationSms = (
  lang: string | undefined,
  params: BookingSmsParams,
): string => {
  const l = normalizeSmsLang(lang);
  if (l === "en") {
    return `Hi ${params.firstName}, your RadDent appointment is confirmed for ${params.date} at ${params.time} (Budapest time). See you soon!`;
  }
  if (l === "fa") {
    return `سلام ${params.firstName}، نوبت شما در کلینیک RadDent برای ${params.date} ساعت ${params.time} (به وقت بوداپست) تأیید شد. به امید دیدار!`;
  }
  return `Kedves ${params.firstName}, a RadDent időpontja megerősítve: ${params.date}, ${params.time} (budapesti idő). Hamarosan találkozunk!`;
};

export const reminderSms = (
  lang: string | undefined,
  params: BookingSmsParams,
): string => {
  const l = normalizeSmsLang(lang);
  if (l === "en") {
    return `Hi ${params.firstName}, just a reminder that you have a RadDent appointment tomorrow (${params.date}) at ${params.time} Budapest time. See you soon!`;
  }
  if (l === "fa") {
    return `سلام ${params.firstName}، یادآوری می‌کنیم که فردا (${params.date}) ساعت ${params.time} (به وقت بوداپست) در کلینیک RadDent نوبت دارید. به امید دیدار!`;
  }
  return `Kedves ${params.firstName}, emlékeztetjük, hogy holnap (${params.date}) ${params.time}-kor (budapesti idő) RadDent időpontja van. Hamarosan találkozunk!`;
};
