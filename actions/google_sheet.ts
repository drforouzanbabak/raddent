import { google } from "googleapis";
import { randomUUID } from "crypto";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const PATIENT_SHEET_NAME = "Sheet1";
const PRICES_SHEET_NAME = "Sheet2";
const WEEKLY_SCHEDULE_SHEET_NAME = "Sheet3";

export type ServicePrice = {
  name: string;
  description?: string;
  price: string;
  category: string;
};

export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dob?: string;
  address?: string;
  notes?: string;
  language?: string;
};

export type NewPatient = Omit<Patient, "id">;

const patientToRow = (patient: Patient): unknown[] => [
  patient.id,
  patient.firstName,
  patient.lastName,
  patient.email ?? "",
  patient.phone ?? "",
  patient.dob ?? "",
  patient.address ?? "",
  patient.notes ?? "",
  patient.language ?? "",
];

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

const getSheetsClient = async () => {
  const credentials = getGoogleCredentials();
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });

  return google.sheets({ version: "v4", auth });
};

export const getGoogleSheetData = async () => {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID is not set");
  }

  try {
    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: PATIENT_SHEET_NAME,
    });

    return response.data;
  } catch (error: unknown) {
    console.error(
      "Failed to fetch Google Sheet data:",
      (error as Error).message,
    );
    throw error;
  }
};

export const appendGoogleSheetRow = async (row: unknown[]) => {
  return updateGoogleSheetData([row]);
};

export const appendPatient = async (patient: NewPatient) => {
  const newPatient: Patient = {
    id: randomUUID(),
    ...patient,
  };

  await appendGoogleSheetRow([...patientToRow(newPatient), 1]);
  return newPatient;
};

export const createPatient = appendPatient;

const rowToPatient = (row: unknown[]): Patient => ({
  id: String(row[0] ?? ""),
  firstName: String(row[1] ?? ""),
  lastName: String(row[2] ?? ""),
  email: String(row[3] ?? ""),
  phone: String(row[4] ?? ""),
  dob: String(row[5] ?? ""),
  address: String(row[6] ?? ""),
  notes: String(row[7] ?? ""),
  language: String(row[8] ?? ""),
});

const normalizeEmail = (value: string | undefined) =>
  (value ?? "").trim().toLowerCase();
const normalizePhone = (value: string | undefined) =>
  (value ?? "").replace(/\D+/g, "");

const PATIENT_BOOKINGS_COLUMN = "J";

const incrementPatientBookings = async (
  rowIndex: number,
): Promise<number> => {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID is not set");
  }

  const sheets = await getSheetsClient();
  const sheetRow = rowIndex + 1;
  const range = `${PATIENT_SHEET_NAME}!${PATIENT_BOOKINGS_COLUMN}${sheetRow}`;

  const current = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });
  const previous = Number(current.data.values?.[0]?.[0] ?? 0) || 0;
  const next = previous + 1;

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[next]] },
  });

  return next;
};

export const getPatientById = async (id: string): Promise<Patient | null> => {
  const data = await getGoogleSheetData();
  const rows = data.values ?? [];

  for (const row of rows) {
    if (String(row[0] ?? "") === id) {
      return rowToPatient(row);
    }
  }

  return null;
};

const WEEKDAY_NAMES: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const parseHourMinute12 = (raw: string): number | null => {
  const match = raw.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;
  const rawHours = Number(match[1]);
  const minutes = match[2] ? Number(match[2]) : 0;
  if (rawHours < 1 || rawHours > 12 || minutes < 0 || minutes > 59) {
    return null;
  }

  const meridiem = match[3].toUpperCase();
  const hours =
    meridiem === "AM"
      ? rawHours % 12
      : (rawHours % 12) + 12;

  return hours * 60 + minutes;
};

const parseScheduleTimeRange = (
  raw: string,
): { startMinutes: number; endMinutes: number } | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(/\s*-\s*/);
  if (parts.length !== 2) return null;
  const startMinutes = parseHourMinute12(parts[0]);
  const endMinutes = parseHourMinute12(parts[1]);
  if (startMinutes === null || endMinutes === null) return null;
  if (endMinutes <= startMinutes) return null;
  return { startMinutes, endMinutes };
};

export type DaySchedule = { startMinutes: number; endMinutes: number } | null;

// Keyed by JS Date#getDay() (0 = Sunday ... 6 = Saturday).
export type WeeklySchedule = Record<number, DaySchedule>;

const emptyWeeklySchedule = (): WeeklySchedule => ({
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
});

// Reads the recurring weekly hours from Sheet3 (WeekDay | Time). A blank
// Time cell means the doctor does not take bookings that weekday.
export const getWeeklySchedule = async (): Promise<WeeklySchedule> => {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID is not set");
  }

  const schedule = emptyWeeklySchedule();

  try {
    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${WEEKLY_SCHEDULE_SHEET_NAME}!A:B`,
    });

    const rows = response.data.values ?? [];

    for (const row of rows) {
      const weekday = WEEKDAY_NAMES[String(row[0] ?? "").trim().toLowerCase()];
      if (weekday === undefined) continue;

      schedule[weekday] = parseScheduleTimeRange(String(row[1] ?? ""));
    }
  } catch (error: unknown) {
    console.error(
      "[weekly-schedule] failed to load Sheet3:",
      (error as Error).message,
    );
  }

  return schedule;
};

export const getServicePrices = async (): Promise<ServicePrice[]> => {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID is not set");
  }

  const sheets = await getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: PRICES_SHEET_NAME,
  });

  const rows = response.data.values ?? [];

  // First row is the header row — skip it.
  return rows
    .slice(1)
    .map((row) => ({
      name: String(row[0] ?? "").trim(),
      description: String(row[1] ?? "").trim() || undefined,
      price: String(row[2] ?? "").trim(),
      category: String(row[3] ?? "").trim(),
    }))
    .filter((service) => service.name);
};

export const findOrCreatePatient = async (
  input: NewPatient,
): Promise<{ patient: Patient; created: boolean; bookings: number }> => {
  const targetEmail = normalizeEmail(input.email);
  const targetPhone = normalizePhone(input.phone);

  if (targetEmail && targetPhone) {
    const data = await getGoogleSheetData();
    const rows = data.values ?? [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (
        normalizeEmail(String(row[3] ?? "")) === targetEmail &&
        normalizePhone(String(row[4] ?? "")) === targetPhone
      ) {
        const bookings = await incrementPatientBookings(i);
        return { patient: rowToPatient(row), created: false, bookings };
      }
    }
  }

  const patient = await appendPatient(input);
  return { patient, created: true, bookings: 1 };
};

export const updateGoogleSheetData = async (data: unknown[][]) => {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID is not set");
  }

  try {
    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: PATIENT_SHEET_NAME,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: data,
      },
    });

    return response.data;
  } catch (error: unknown) {
    console.error(
      "Failed to update Google Sheet data:",
      (error as Error).message,
    );
    throw error;
  }
};
