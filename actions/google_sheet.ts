import { google } from "googleapis";
import { randomUUID } from "crypto";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const PATIENT_SHEET_NAME = "Sheet1";

export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dob?: string;
  address?: string;
  notes?: string;
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

  await appendGoogleSheetRow(patientToRow(newPatient));
  return newPatient;
};

export const createPatient = appendPatient;

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
