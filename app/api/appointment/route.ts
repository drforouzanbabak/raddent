import { NextResponse } from "next/server";
import { findOrCreatePatient, type NewPatient } from "@/actions/google_sheet";
import { sendEmail } from "@/lib/functions";
import { normalizeNotificationLang } from "@/lib/notification-lang";
import { doctorApprovalEmail } from "@/lib/email-templates";
import { signAppointmentToken } from "@/lib/appointment-token";

type RequestBody = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob?: string;
  address?: string;
  notes?: string;
  summary: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  language?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    if (
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.phone ||
      !body.summary ||
      !body.location ||
      !body.date ||
      !body.startTime ||
      !body.endTime
    ) {
      return NextResponse.json(
        { message: "Missing required appointment fields." },
        { status: 400 },
      );
    }

    if (body.startTime >= body.endTime) {
      return NextResponse.json(
        { message: "End time must be after start time." },
        { status: 400 },
      );
    }

    const requestLang = normalizeNotificationLang(body.language);

    const patientData: NewPatient = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone.trim(),
      dob: body.dob,
      address: body.address,
      notes: body.notes,
      language: requestLang.toUpperCase(),
    };

    const { patient, created } = await findOrCreatePatient(patientData);

    const doctorEmail =
      process.env.DOCTOR_EMAIL || process.env.GOOGLE_EMAIL_ADDRESS;
    if (!doctorEmail) {
      throw new Error("GOOGLE_EMAIL_ADDRESS is not set");
    }

    const token = signAppointmentToken({
      patientId: patient.id,
      summary: body.summary,
      location: body.location,
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      language: requestLang,
      notes: body.notes,
    });

    const origin = new URL(request.url).origin;
    const confirmUrl = `${origin}/api/appointment/confirm?token=${encodeURIComponent(token)}`;

    const { subject, html } = doctorApprovalEmail(requestLang, {
      patientName: `${patient.firstName} ${patient.lastName}`.trim(),
      patientEmail: patient.email ?? "",
      patientPhone: patient.phone ?? "",
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      notes: body.notes,
      confirmUrl,
    });

    await sendEmail({ to: doctorEmail, subject, html });

    return NextResponse.json({
      success: true,
      message:
        "Your request has been sent to the doctor. You'll get a confirmation email once it's approved.",
      patient,
      patientCreated: created,
      pendingApproval: true,
    });
  } catch (error: unknown) {
    console.error("Appointment request failed:", (error as Error).message);
    return NextResponse.json(
      { message: (error as Error).message || "Booking failed." },
      { status: 500 },
    );
  }
}
