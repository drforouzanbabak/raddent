import { NextResponse } from "next/server";
import { findOrCreatePatient, type NewPatient } from "@/actions/google_sheet";
import { createPatientCalendarEvent } from "@/actions/google_calendar";
import { sendSMS } from "@/lib/functions";
import {
  bookingConfirmationSms,
  normalizeSmsLang,
} from "@/lib/sms-templates";

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

const buildBudapestISO = (date: string, time: string) => {
  if (!date || !time) {
    throw new Error("Invalid appointment time.");
  }

  return `${date}T${time}:00+02:00`;
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

    const requestLang = normalizeSmsLang(body.language);

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
    const startDateTime = buildBudapestISO(body.date, body.startTime);
    const endDateTime = buildBudapestISO(body.date, body.endTime);

    const event = await createPatientCalendarEvent(
      patient,
      body.summary,
      startDateTime,
      endDateTime,
      body.location,
      { useDefault: true },
      requestLang.toUpperCase(),
    );

    const smsText = bookingConfirmationSms(requestLang, {
      firstName: patient.firstName,
      date: body.date,
      time: body.startTime,
    });

    let smsSent = false;
    let smsError: string | undefined;
    if (patient.phone) {
      try {
        await sendSMS({
          to: patient.phone.replace(/^\+/, ""),
          text: smsText,
        });
        smsSent = true;
      } catch (error: unknown) {
        smsError = (error as Error).message;
        console.error("SMS send failed (booking still saved):", smsError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Appointment booked successfully.",
      patient,
      patientCreated: created,
      event,
      sms: {
        to: patient.phone,
        sent: smsSent,
        error: smsError,
      },
    });
  } catch (error: unknown) {
    console.error("Appointment booking failed:", (error as Error).message);
    return NextResponse.json(
      { message: (error as Error).message || "Booking failed." },
      { status: 500 },
    );
  }
}
