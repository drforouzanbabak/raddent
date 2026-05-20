import { NextResponse } from "next/server";
import { getFacebookReviews } from "@/actions/facebook";

export const revalidate = 3600; // 1 hour

export async function GET() {
  try {
    const reviews = await getFacebookReviews();
    return NextResponse.json({ reviews });
  } catch (error: unknown) {
    console.error("[reviews] route failed:", (error as Error).message);
    return NextResponse.json(
      { message: (error as Error).message || "Unable to load reviews." },
      { status: 500 },
    );
  }
}
