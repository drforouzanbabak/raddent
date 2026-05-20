import { google } from "googleapis";
import type { Patient } from "./google_sheet";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

export type CalendarAttendee = {
  email: string;
  displayName?: string;
  responseStatus?: string;
};

export type CalendarEventInput = {
  summary: string;
  description?: string;
  location?: string;
  startDateTime: string; // ISO 8601
  endDateTime: string; // ISO 8601
  attendees?: CalendarAttendee[];
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: "email" | "popup";
      minutes: number;
    }>;
  };
  extendedProperties?: {
    private?: Record<string, string>;
    shared?: Record<string, string>;
  };
};

export type CalendarEventUpdate = Partial<CalendarEventInput>;

const buildPatientDescription = (patient: Patient): string => {
  const lines: string[] = [];

  if (patient.firstName || patient.lastName) {
    lines.push(
      `Name: ${[patient.firstName, patient.lastName].filter(Boolean).join(" ")}`,
    );
  }
  if (patient.id) lines.push(`Patient ID: ${patient.id}`);
  if (patient.email) lines.push(`Email: ${patient.email}`);
  if (patient.phone) lines.push(`Phone: ${patient.phone}`);
  if (patient.dob) lines.push(`DOB: ${patient.dob}`);
  if (patient.address) lines.push(`Address: ${patient.address}`);
  if (patient.notes) lines.push(`Notes: ${patient.notes}`);

  return lines.join("\n");
};

export const createPatientCalendarEvent = async (
  patient: Patient,
  summary: string,
  startDateTime: string,
  endDateTime: string,
  location?: string,
  reminders?: CalendarEventInput["reminders"],
  language?: string,
) => {
  return createCalendarEvent({
    summary,
    description: buildPatientDescription(patient),
    location,
    startDateTime,
    endDateTime,
    attendees: patient.email
      ? [
          {
            email: patient.email,
            displayName: [patient.firstName, patient.lastName]
              .filter(Boolean)
              .join(" "),
          },
        ]
      : undefined,
    reminders,
    extendedProperties: {
      private: {
        patientId: patient.id,
        ...(language ? { language } : {}),
      },
    },
  });
};

const getGoogleCredentials = () => {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Missing Google service account credentials. Set GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY.",
    );
  }

  return {
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, "\n"),
  };
};

const getCalendarId = () => {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error("GOOGLE_CALENDAR_ID is not set");
  }

  return calendarId;
};

const isDelegatedServiceAccount = () =>
  Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_SUBJECT);

const getCalendarClient = async () => {
  const authOptions: Record<string, unknown> = {
    credentials: getGoogleCredentials(),
    scopes: SCOPES,
  };

  if (process.env.GOOGLE_SERVICE_ACCOUNT_SUBJECT) {
    authOptions.subject = process.env.GOOGLE_SERVICE_ACCOUNT_SUBJECT;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = new google.auth.GoogleAuth(authOptions as any);
  return google.calendar({ version: "v3", auth });
};

const buildAttendees = (attendees?: CalendarAttendee[]) => {
  if (!attendees) return undefined;
  if (!isDelegatedServiceAccount()) {
    console.warn(
      "Skipping event attendees because service account delegation is not enabled.",
    );
    return undefined;
  }

  return attendees;
};

export const createCalendarEvent = async (event: CalendarEventInput) => {
  const calendarId = getCalendarId();
  const calendar = await getCalendarClient();

  const attendees = buildAttendees(event.attendees);

  const response = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: event.summary,
      description: event.description,
      location: event.location,
      start: {
        dateTime: event.startDateTime,
      },
      end: {
        dateTime: event.endDateTime,
      },
      attendees,
      reminders: event.reminders,
      extendedProperties: event.extendedProperties,
    },
    sendUpdates: attendees ? "all" : "none",
  });

  return response.data;
};

const WEEK_HOUR_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
];

const SLOT_DURATION_MINUTES = 30;

const addSlotDuration = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const total = hours * 60 + minutes + SLOT_DURATION_MINUTES;
  const nextHour = Math.floor(total / 60) % 24;
  const nextMinute = total % 60;
  return `${String(nextHour).padStart(2, "0")}:${String(nextMinute).padStart(2, "0")}`;
};

const isWeekendIso = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  const day = new Date(y, m - 1, d).getDay();
  return day === 0 || day === 6;
};

const buildBudapestDateTime = (date: string, time: string) =>
  `${date}T${time}:00+02:00`;

const rangesOverlap = (
  startA: string,
  endA: string,
  startB: string,
  endB: string,
) => {
  const a0 = Date.parse(startA);
  const a1 = Date.parse(endA);
  const b0 = Date.parse(startB);
  const b1 = Date.parse(endB);

  return a0 < b1 && a1 > b0;
};

export const getCalendarBusyTimes = async (date: string) => {
  const calendarId = getCalendarId();
  const calendar = await getCalendarClient();

  const response = await calendar.events.list({
    calendarId,
    timeMin: buildBudapestDateTime(date, "00:00"),
    timeMax: buildBudapestDateTime(date, "23:59"),
    timeZone: "Europe/Budapest",
    singleEvents: true,
    orderBy: "startTime",
    showDeleted: false,
  });

  const events = response.data.items ?? [];

  const busy = events
    .filter((event) => event.status !== "cancelled")
    .map((event) => {
      const start = event.start?.dateTime ?? event.start?.date;
      const end = event.end?.dateTime ?? event.end?.date;
      return { start, end };
    })
    .filter(
      (interval): interval is { start: string; end: string } =>
        Boolean(interval.start) && Boolean(interval.end),
    );

  console.log(
    `[availability] ${date} – calendarId=${calendarId} events=${events.length} busy=`,
    busy,
  );

  return busy;
};

export const getCalendarEventsForDate = async (date: string) => {
  const calendarId = getCalendarId();
  const calendar = await getCalendarClient();

  const response = await calendar.events.list({
    calendarId,
    timeMin: buildBudapestDateTime(date, "00:00"),
    timeMax: buildBudapestDateTime(date, "23:59"),
    timeZone: "Europe/Budapest",
    singleEvents: true,
    orderBy: "startTime",
    showDeleted: false,
  });

  return response.data.items ?? [];
};

export const getAvailableCalendarTimes = async (date: string) => {
  if (isWeekendIso(date)) {
    return [];
  }

  const busyTimes = await getCalendarBusyTimes(date);

  return WEEK_HOUR_SLOTS.filter((slot) => {
    const slotStart = buildBudapestDateTime(date, slot);
    const slotEnd = buildBudapestDateTime(date, addSlotDuration(slot));

    return !busyTimes.some((interval) => {
      if (!interval.start || !interval.end) {
        return false;
      }
      return rangesOverlap(slotStart, slotEnd, interval.start, interval.end);
    });
  });
};

export const updateCalendarEvent = async (
  eventId: string,
  event: CalendarEventUpdate,
) => {
  const calendarId = getCalendarId();
  const calendar = await getCalendarClient();

  const attendees = buildAttendees(event.attendees);

  const response = await calendar.events.patch({
    calendarId,
    eventId,
    requestBody: {
      summary: event.summary,
      description: event.description,
      location: event.location,
      start: event.startDateTime
        ? { dateTime: event.startDateTime }
        : undefined,
      end: event.endDateTime ? { dateTime: event.endDateTime } : undefined,
      attendees,
      reminders: event.reminders,
      extendedProperties: event.extendedProperties,
    },
    sendUpdates: attendees ? "all" : "none",
  });

  return response.data;
};

export const cancelCalendarEvent = async (eventId: string) => {
  const calendarId = getCalendarId();
  const calendar = await getCalendarClient();

  const response = await calendar.events.delete({
    calendarId,
    eventId,
    sendUpdates: "all",
  });

  return response.data;
};
