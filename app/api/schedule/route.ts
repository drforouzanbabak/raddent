import { NextResponse } from "next/server";
import { getWeeklySchedule } from "@/actions/google_sheet";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const schedule = await getWeeklySchedule();
    const openWeekdays = Object.entries(schedule)
      .filter(([, hours]) => hours !== null)
      .map(([weekday]) => Number(weekday));

    return NextResponse.json({ openWeekdays });
  } catch (error: unknown) {
    console.error("[schedule] route failed:", (error as Error).message);
    return NextResponse.json(
      { message: (error as Error).message || "Unable to load schedule." },
      { status: 500 },
    );
  }
}
