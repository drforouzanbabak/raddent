import { getCalendarEventsForDate } from "@/actions/google_calendar";
import { getPatientById } from "@/actions/google_sheet";
import { sendSMS } from "@/lib/functions";
import { reminderSms } from "@/lib/sms-templates";

export const dynamic = "force-dynamic";

const TIMEZONE = "Europe/Budapest";

const formatBudapestDate = (date: Date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

const formatBudapestTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));

type ReminderResult = {
  eventId?: string;
  patientId?: string;
  sent: boolean;
  reason?: string;
};

export async function GET() {
  const now = new Date();

  const hour = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    hour: "numeric",
    hour12: false,
  }).format(now);

  if (hour !== "9") {
    return Response.json({ skipped: true, hour });
  }

  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowDate = formatBudapestDate(tomorrow);

  console.log(`[reminders] Sending SMS reminders for ${tomorrowDate}`);

  const events = await getCalendarEventsForDate(tomorrowDate);
  console.log(`[reminders] ${events.length} events found for ${tomorrowDate}`);

  const results: ReminderResult[] = [];

  for (const event of events) {
    if (event.status === "cancelled") continue;

    const eventId = event.id ?? undefined;
    const patientId = event.extendedProperties?.private?.patientId;

    if (!patientId) {
      results.push({ eventId, sent: false, reason: "No patientId on event" });
      continue;
    }

    let patient;
    try {
      patient = await getPatientById(patientId);
    } catch (error: unknown) {
      results.push({
        eventId,
        patientId,
        sent: false,
        reason: `Sheet lookup failed: ${(error as Error).message}`,
      });
      continue;
    }

    if (!patient) {
      results.push({
        eventId,
        patientId,
        sent: false,
        reason: "Patient not found in sheet",
      });
      continue;
    }

    if (!patient.phone) {
      results.push({
        eventId,
        patientId,
        sent: false,
        reason: "Patient has no phone number",
      });
      continue;
    }

    const startTime = event.start?.dateTime
      ? formatBudapestTime(event.start.dateTime)
      : "your appointment time";

    const eventLanguage = event.extendedProperties?.private?.language;
    const patientLanguage = patient.language;
    const text = reminderSms(eventLanguage || patientLanguage, {
      firstName: patient.firstName,
      date: tomorrowDate,
      time: startTime,
    });

    try {
      await sendSMS({ to: patient.phone.replace(/^\+/, ""), text });
      results.push({ eventId, patientId, sent: true });
    } catch (error: unknown) {
      results.push({
        eventId,
        patientId,
        sent: false,
        reason: `SMS failed: ${(error as Error).message}`,
      });
    }
  }

  const sent = results.filter((r) => r.sent).length;
  console.log(
    `[reminders] ${sent}/${results.length} reminders sent for ${tomorrowDate}`,
  );

  return Response.json({
    success: true,
    date: tomorrowDate,
    total: results.length,
    sent,
    results,
  });
}
