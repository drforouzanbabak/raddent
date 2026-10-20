const BUDAPEST_TZ = "Europe/Budapest";

const offsetFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: BUDAPEST_TZ,
  timeZoneName: "longOffset",
});

// Budapest's UTC offset in minutes at the given instant: +60 in winter (CET),
// +120 in summer (CEST).
const budapestOffsetMinutes = (instant: number) => {
  const name =
    offsetFormatter
      .formatToParts(instant)
      .find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  const match = name.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3]));
};

const formatOffset = (minutes: number) => {
  const sign = minutes < 0 ? "-" : "+";
  const abs = Math.abs(minutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, "0");
  const mins = String(abs % 60).padStart(2, "0");
  return `${sign}${hours}:${mins}`;
};

// Turns a Budapest wall-clock date ("YYYY-MM-DD") and time ("HH:MM") into an
// ISO 8601 string with the offset that applies on that day, so bookings stay
// correct across the summer/winter time switch.
export const buildBudapestISO = (date: string, time: string) => {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const wallClockAsUtc = Date.UTC(y, mo - 1, d, h, mi);
  const firstGuess = budapestOffsetMinutes(wallClockAsUtc);
  const offset = budapestOffsetMinutes(wallClockAsUtc - firstGuess * 60_000);
  return `${date}T${time}:00${formatOffset(offset)}`;
};
