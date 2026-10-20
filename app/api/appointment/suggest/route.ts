import { NextResponse } from "next/server";
import {
  signAppointmentToken,
  verifyAppointmentToken,
} from "@/lib/appointment-token";
import { getPatientById } from "@/actions/google_sheet";
import { addSlotDuration, isSlotAvailable } from "@/actions/google_calendar";
import { sendEmail } from "@/lib/functions";
import { patientSuggestionEmail } from "@/lib/email-templates";
import { buildBudapestISO } from "@/lib/budapest-time";

type RequestBody = {
  token: string;
  date: string;
  startTime: string;
};

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^\d{2}:\d{2}$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    if (!body.token || !body.date || !body.startTime) {
      return NextResponse.json(
        { message: "Missing token, date or time." },
        { status: 400 },
      );
    }

    if (!DATE_REGEX.test(body.date) || !TIME_REGEX.test(body.startTime)) {
      return NextResponse.json(
        { message: "Invalid date or time." },
        { status: 400 },
      );
    }

    let payload;
    try {
      payload = verifyAppointmentToken(body.token);
    } catch (error: unknown) {
      return NextResponse.json(
        { message: (error as Error).message || "Invalid link." },
        { status: 400 },
      );
    }

    if (payload.purpose === "patient") {
      return NextResponse.json({ message: "Invalid link." }, { status: 403 });
    }

    if (Date.parse(buildBudapestISO(body.date, body.startTime)) <= Date.now()) {
      return NextResponse.json(
        { message: "The selected time is in the past." },
        { status: 400 },
      );
    }

    if (!(await isSlotAvailable(body.date, body.startTime))) {
      return NextResponse.json(
        { message: "The selected time is no longer available." },
        { status: 409 },
      );
    }

    const patient = await getPatientById(payload.patientId);
    if (!patient) {
      return NextResponse.json(
        { message: "Patient not found." },
        { status: 404 },
      );
    }
    if (!patient.email) {
      return NextResponse.json(
        { message: "This patient has no email address on file." },
        { status: 422 },
      );
    }

    const endTime = addSlotDuration(body.startTime);

    const patientToken = signAppointmentToken({
      purpose: "patient",
      patientId: payload.patientId,
      summary: payload.summary,
      location: payload.location,
      date: body.date,
      startTime: body.startTime,
      endTime,
      language: payload.language,
      notes: payload.notes,
    });

    const origin = new URL(request.url).origin;
    const confirmUrl = `${origin}/api/appointment/confirm?token=${encodeURIComponent(patientToken)}`;

    const { subject, html } = patientSuggestionEmail(payload.language, {
      firstName: patient.firstName,
      requestedDate: payload.date,
      requestedStartTime: payload.startTime,
      date: body.date,
      startTime: body.startTime,
      endTime,
      location: payload.location,
      confirmUrl,
    });

    await sendEmail({ to: patient.email, subject, html });

    return NextResponse.json({ success: true, endTime });
  } catch (error: unknown) {
    console.error("Appointment suggestion failed:", (error as Error).message);
    return NextResponse.json(
      { message: (error as Error).message || "Could not send suggestion." },
      { status: 500 },
    );
  }
}
