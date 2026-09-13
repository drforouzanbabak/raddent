import { NextResponse } from "next/server";
import { getDaySlots } from "@/actions/google_calendar";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { message: "Missing date query parameter." },
      { status: 400 },
    );
  }

  try {
    const slots = await getDaySlots(date);
    return NextResponse.json({ slots });
  } catch (error: unknown) {
    console.error("Availability lookup failed:", (error as Error).message);
    return NextResponse.json(
      {
        message: (error as Error).message || "Unable to load availability.",
      },
      { status: 500 },
    );
  }
}
