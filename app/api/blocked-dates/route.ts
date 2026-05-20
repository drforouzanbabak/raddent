import { NextResponse } from "next/server";
import { getBlockedDates } from "@/actions/google_sheet";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const blockedDates = await getBlockedDates();
    return NextResponse.json({ blockedDates });
  } catch (error: unknown) {
    console.error(
      "[blocked-dates] route failed:",
      (error as Error).message,
    );
    return NextResponse.json(
      { message: (error as Error).message || "Unable to load blocked dates." },
      { status: 500 },
    );
  }
}
