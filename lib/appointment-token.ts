import { createHmac, timingSafeEqual } from "crypto";

export type AppointmentTokenPayload = {
  patientId: string;
  summary: string;
  location: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  language?: string;
  notes?: string;
  issuedAt: number;
};

const MAX_TOKEN_AGE_MS = 60 * 24 * 60 * 60 * 1000; // 60 days

const getSecret = () => {
  // Reuses the Gmail app password already issued for this app's outgoing
  // email — it's a secret dedicated to this flow, so no separate signing
  // secret needs to be provisioned.
  const secret = process.env.GOOGLE_EMAIL_KEY;
  if (!secret) {
    throw new Error("GOOGLE_EMAIL_KEY is not set");
  }
  return secret;
};

const sign = (data: string) =>
  createHmac("sha256", getSecret()).update(data).digest("base64url");

export const signAppointmentToken = (
  payload: Omit<AppointmentTokenPayload, "issuedAt">,
): string => {
  const full: AppointmentTokenPayload = { ...payload, issuedAt: Date.now() };
  const body = Buffer.from(JSON.stringify(full), "utf8").toString("base64url");
  return `${body}.${sign(body)}`;
};

export const verifyAppointmentToken = (
  token: string,
): AppointmentTokenPayload => {
  const [body, signature] = token.split(".");
  if (!body || !signature) {
    throw new Error("Malformed confirmation link.");
  }

  const expectedSignature = sign(body);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    throw new Error("Invalid confirmation link.");
  }

  const payload = JSON.parse(
    Buffer.from(body, "base64url").toString("utf8"),
  ) as AppointmentTokenPayload;

  if (Date.now() - payload.issuedAt > MAX_TOKEN_AGE_MS) {
    throw new Error("This confirmation link has expired.");
  }

  return payload;
};
