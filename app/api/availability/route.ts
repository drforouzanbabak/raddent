import { NextResponse } from "next/server";
import { getAvailableCalendarTimes } from "@/actions/google_calendar";
import { getBlockedSlots } from "@/actions/google_sheet";

export const dynamic = "force-dynamic";

const slotStartMinutes = (slot: string) => {
  const [hours, minutes] = slot.split(":").map(Number);
  return hours * 60 + minutes;
};

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
    const blockedSlots = (await getBlockedSlots()).filter(
      (slot) => slot.date === date,
    );

    if (blockedSlots.some((slot) => slot.startMinutes === undefined)) {
      return NextResponse.json({ availableTimes: [], blocked: true });
    }

    const availableTimes = await getAvailableCalendarTimes(date);

    const partialRanges = blockedSlots.filter(
      (slot): slot is { date: string; startMinutes: number; endMinutes: number } =>
        slot.startMinutes !== undefined && slot.endMinutes !== undefined,
    );

    const filteredTimes = partialRanges.length
      ? availableTimes.filter((time) => {
          const start = slotStartMinutes(time);
          return !partialRanges.some(
            (range) => start >= range.startMinutes && start < range.endMinutes,
          );
        })
      : availableTimes;

    return NextResponse.json({ availableTimes: filteredTimes });
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
