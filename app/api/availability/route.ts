import { NextResponse } from "next/server";
import { getAvailableCalendarTimes } from "@/actions/google_calendar";
import { getBlockedDates } from "@/actions/google_sheet";

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
    const blockedDates = await getBlockedDates();
    if (blockedDates.includes(date)) {
      return NextResponse.json({ availableTimes: [], blocked: true });
    }

    const availableTimes = await getAvailableCalendarTimes(date);

    return NextResponse.json({ availableTimes });
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
