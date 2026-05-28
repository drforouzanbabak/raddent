import { google } from "googleapis";
import { randomUUID } from "crypto";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const PATIENT_SHEET_NAME = "Sheet1";
const PRICES_SHEET_NAME = "Sheet2";
const BLOCKED_DATES_SHEET_NAME = "Sheet3";

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

const normalizeBlockedIso = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})$/);
  if (!match) return null;
  const [, year, month, day] = match;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const parseHourMinute = (raw: string): number | null => {
  const match = raw.trim().match(/^(\d{1,2})(?::(\d{2}))?$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = match[2] ? Number(match[2]) : 0;
  if (hours < 0 || hours > 24 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
};

const parseBlockedTimeRange = (
  raw: string,
): { startMinutes: number; endMinutes: number } | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(/\s*-\s*/);
  if (parts.length !== 2) return null;
  const startMinutes = parseHourMinute(parts[0]);
  const endMinutes = parseHourMinute(parts[1]);
  if (startMinutes === null || endMinutes === null) return null;
  if (endMinutes <= startMinutes) return null;
  return { startMinutes, endMinutes };
};

export type BlockedSlot = {
  date: string;
  startMinutes?: number;
  endMinutes?: number;
};

export const getBlockedSlots = async (): Promise<BlockedSlot[]> => {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID is not set");
  }

  try {
    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${BLOCKED_DATES_SHEET_NAME}!A:B`,
    });

    const rows = response.data.values ?? [];
    const slots: BlockedSlot[] = [];

    for (const row of rows) {
      const date = normalizeBlockedIso(String(row[0] ?? ""));
      if (!date) continue;

      const range = parseBlockedTimeRange(String(row[1] ?? ""));
      if (range) {
        slots.push({ date, ...range });
      } else {
        slots.push({ date });
      }
    }

    return slots;
  } catch (error: unknown) {
    console.error(
      "[blocked-dates] failed to load Sheet3:",
      (error as Error).message,
    );
    return [];
  }
};

export const getBlockedDates = async (): Promise<string[]> => {
  const slots = await getBlockedSlots();
  const fullDay = slots
    .filter((slot) => slot.startMinutes === undefined)
    .map((slot) => slot.date);
  return Array.from(new Set(fullDay));
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
