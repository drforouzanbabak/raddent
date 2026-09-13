export type NotificationLang = "hu" | "en" | "fa";

export const normalizeNotificationLang = (
  lang: string | undefined,
): NotificationLang => {
  if (!lang) return "hu";
  const lower = lang.trim().toLowerCase();
  if (lower === "en" || lower === "eng" || lower === "english") return "en";
  if (lower === "fa" || lower === "farsi" || lower === "persian") return "fa";
  return "hu";
};
