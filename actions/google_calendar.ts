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
