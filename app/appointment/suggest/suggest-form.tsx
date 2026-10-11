"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useT } from "@/components/language-provider";

export type SuggestRequest = {
  token: string;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
};

type DaySlot = { time: string; available: boolean };

const MAX_DAYS_AHEAD = 90;

const formatDateIso = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseIsoDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const addSlotDuration = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const total = hours * 60 + minutes + 30;
  const nextHour = Math.floor(total / 60) % 24;
  const nextMinute = total % 60;
  return `${String(nextHour).padStart(2, "0")}:${String(nextMinute).padStart(2, "0")}`;
};

export function SuggestTimeForm({
  request,
}: {
  request: SuggestRequest | null;
}) {
  const t = useT();
  const s = t.suggest;

  const [today] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const lastDay = new Date(today);
  lastDay.setDate(today.getDate() + MAX_DAYS_AHEAD);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [slots, setSlots] = useState<DaySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<{ date: string; time: string } | null>(
    null,
  );
  // Fallback while the sheet-driven schedule loads: assume Mon-Fri are open.
  const [openWeekdays, setOpenWeekdays] = useState<number[]>([1, 2, 3, 4, 5]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const response = await fetch("/api/schedule", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        if (!ignore && Array.isArray(data.openWeekdays)) {
          setOpenWeekdays(data.openWeekdays as number[]);
        }
      } catch {
        // non-fatal — /api/availability still enforces the schedule
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!date) return;
    let ignore = false;

    (async () => {
      setLoading(true);
      setSlotsError(null);
      try {
        const response = await fetch(`/api/availability?date=${date}`, {
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || "Unable to fetch availability.");
        }
        const all: DaySlot[] = Array.isArray(data.slots) ? data.slots : [];
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const upcoming =
          date === formatDateIso(now)
            ? all.filter((slot) => {
                const [h, m] = slot.time.split(":").map(Number);
                return h * 60 + m > nowMinutes;
              })
            : all;
        if (!ignore) setSlots(upcoming);
      } catch (error: unknown) {
        if (!ignore) {
          setSlotsError((error as Error).message);
          setSlots([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [date]);

  const handleSubmit = async () => {
    if (!request || !date || !startTime) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/appointment/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: request.token, date, startTime }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message ?? s.failed);
      }
      setSent({ date, time: `${startTime} – ${result.endTime}` });
    } catch (error: unknown) {
      toast.error(s.failed, { description: (error as Error).message });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSent(null);
    setDate("");
    setStartTime("");
    setSlots([]);
  };

  const card = "rounded-[2.5rem] border border-white/10 bg-white/3 p-8 sm:p-10";
  const emptyBox =
    "rounded-3xl border border-dashed border-white/15 bg-white/3 p-6 text-sm text-slate-400";

  return (
    <main>
      <div className="mx-auto flex max-w-4xl flex-col px-6 py-24 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
            {s.eyebrow}
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {s.title}
          </h1>
          {request && !sent ? (
            <p className="mt-4 text-base leading-7 text-slate-300">
              {s.subtitle}
            </p>
          ) : null}
        </div>

        {!request ? (
          <div className={card}>
            <h2 className="text-xl font-semibold text-white">
              {s.invalidTitle}
            </h2>
            <p className="mt-3 text-slate-300">{s.invalidBody}</p>
          </div>
        ) : sent ? (
          <div className={card}>
            <h2 className="text-xl font-semibold text-white">{s.sentTitle}</h2>
            <p className="mt-3 text-slate-300">
              {s.sentBody
                .replace("{name}", request.patientName)
                .replace("{when}", `${sent.date} ${sent.time}`)}
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-6"
              onClick={resetForm}
            >
              {s.suggestAnother}
            </Button>
          </div>
        ) : (
          <div className={`${card} space-y-8`}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-white/10 bg-white/3 px-5 py-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">{s.patient}</span>
                <strong className="text-white">{request.patientName}</strong>
              </div>
              <div className="hidden h-4 w-px bg-white/10 sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-slate-400">{s.requested}</span>
                <strong className="text-white">
                  {request.date} {request.startTime} – {request.endTime}
                </strong>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-[auto_1fr]">
              <div className="space-y-3">
                <p className="text-sm text-slate-300">{s.chooseDate}</p>
                <Calendar
                  mode="single"
                  className="rounded-3xl border border-white/10"
                  selected={date ? parseIsoDate(date) : undefined}
                  onSelect={(day) => {
                    if (!day) return;
                    setDate(formatDateIso(day));
                    setStartTime("");
                  }}
                  startMonth={today}
                  endMonth={lastDay}
                  disabled={[
                    { before: today },
                    { after: lastDay },
                    (day) => !openWeekdays.includes(day.getDay()),
                  ]}
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm text-slate-300">{s.chooseTime}</p>
                {!date ? (
                  <div className={emptyBox}>{s.chooseDateFirst}</div>
                ) : loading ? (
                  <div className={emptyBox}>{s.loading}</div>
                ) : slotsError ? (
                  <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-rose-100">
                    {slotsError}
                  </div>
                ) : slots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {slots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => slot.available && setStartTime(slot.time)}
                        disabled={!slot.available}
                        className={`rounded-3xl border px-4 py-4 text-sm font-semibold transition ${
                          !slot.available
                            ? "cursor-not-allowed border-red-500/20 bg-red-500/10 text-red-300/70 line-through"
                            : startTime === slot.time
                              ? "cursor-pointer border-white bg-white/10 text-white"
                              : "cursor-pointer border-white/10 bg-white/3 text-slate-200 hover:border-white/20"
                        }`}
                      >
                        {slot.time} – {addSlotDuration(slot.time)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className={emptyBox}>{s.noTimes}</div>
                )}
              </div>
            </div>

            <Button
              type="button"
              size="lg"
              className="w-full"
              disabled={!date || !startTime || submitting}
              onClick={handleSubmit}
            >
              {submitting ? s.sending : s.send}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
