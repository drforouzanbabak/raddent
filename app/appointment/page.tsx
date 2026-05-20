"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PhoneInput } from "@/components/ui/phone-input";
import { cn } from "@/lib/utils";
import { useT, useLanguage } from "@/components/language-provider";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  notes: string;
  summary: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  address: "",
  notes: "",
  summary: "Consultation",
  location: "Budapest Clinic",
  date: "",
  startTime: "",
  endTime: "",
};

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

export default function AppointmentPage() {
  const t = useT();
  const { lang } = useLanguage();
  const [form, setForm] = useState<FormState>(initialFormState);
  const today = new Date();
  const [weekStart, setWeekStart] = useState(() => {
    const day = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((day + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null,
  );
  const [dobOpen, setDobOpen] = useState(false);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const response = await fetch("/api/blocked-dates", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = await response.json();
        if (ignore) return;
        if (Array.isArray(data.blockedDates)) {
          setBlockedDates(data.blockedDates as string[]);
        }
      } catch {
        // non-fatal — server still enforces blocked dates
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const getWeekDays = (weekStartDate: Date) => {
    return Array.from({ length: 5 }, (_, index) => {
      const date = new Date(weekStartDate);
      date.setDate(date.getDate() + index);
      return date;
    });
  };

  const isPastDay = (day: Date) => {
    const normalizedDay = new Date(day);
    normalizedDay.setHours(0, 0, 0, 0);

    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);

    return normalizedDay < todayStart;
  };

  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  currentWeekStart.setHours(0, 0, 0, 0);

  const maxWeekStart = new Date(today);
  maxWeekStart.setDate(today.getDate() + 45);
  maxWeekStart.setDate(
    maxWeekStart.getDate() - ((maxWeekStart.getDay() + 6) % 7),
  );
  maxWeekStart.setHours(0, 0, 0, 0);

  const previousWeek = () => {
    setWeekStart((current) => {
      const next = new Date(current);
      next.setDate(current.getDate() - 7);
      return next < currentWeekStart ? current : next;
    });
  };

  const nextWeek = () => {
    setWeekStart((current) => {
      const next = new Date(current);
      next.setDate(current.getDate() + 7);
      return next > maxWeekStart ? current : next;
    });
  };

  const addSlotDuration = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const total = hours * 60 + minutes + 30;
    const nextHour = Math.floor(total / 60) % 24;
    const nextMinute = total % 60;
    return `${String(nextHour).padStart(2, "0")}:${String(nextMinute).padStart(2, "0")}`;
  };

  const isWeekend = (day: Date) => {
    const d = day.getDay();
    return d === 0 || d === 6;
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const key = name as keyof FormState;
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const selectTime = (time: string) => {
    setForm((prev) => ({
      ...prev,
      startTime: time,
      endTime: addSlotDuration(time),
    }));
  };

  useEffect(() => {
    if (!form.date) {
      return;
    }

    let ignore = false;

    const fetchAvailability = async () => {
      setLoadingAvailability(true);
      setAvailabilityError(null);

      try {
        const response = await fetch(`/api/availability?date=${form.date}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(
            errorResult?.message || "Unable to fetch availability.",
          );
        }

        const data = await response.json();
        const times = Array.isArray(data.availableTimes)
          ? (data.availableTimes as string[])
          : [];

        const now = new Date();
        const todayIso = formatDateIso(now);
        const filteredTimes = times.filter((slot: string) => {
          if (form.date !== todayIso) {
            return true;
          }

          const [slotHour, slotMinute] = slot.split(":").map(Number);
          const slotMinutes = slotHour * 60 + slotMinute;
          const nowMinutes = now.getHours() * 60 + now.getMinutes();
          return slotMinutes > nowMinutes;
        });

        if (ignore) return;

        setAvailableTimes(filteredTimes);
        setForm((prev) => {
          if (prev.startTime && filteredTimes.includes(prev.startTime)) {
            return prev;
          }

          return {
            ...prev,
            startTime: "",
            endTime: "",
          };
        });
      } catch (error: unknown) {
        if (!ignore) {
          setAvailabilityError((error as Error).message);
          setAvailableTimes([]);
        }
      } finally {
        if (!ignore) {
          setLoadingAvailability(false);
        }
      }
    };

    fetchAvailability();

    return () => {
      ignore = true;
    };
  }, [form.date]);

  const goToStepTwo = () => {
    if (!form.date || !form.startTime) return;
    setStep(2);
  };

  const validate = (state: FormState): FormErrors => {
    const next: FormErrors = {};
    const e = t.appointment.errorRequired;

    if (!state.firstName.trim()) next.firstName = e.firstName;
    if (!state.lastName.trim()) next.lastName = e.lastName;

    if (!state.email.trim()) {
      next.email = e.email;
    } else if (!EMAIL_REGEX.test(state.email.trim())) {
      next.email = e.emailInvalid;
    }

    if (!state.phone.trim()) {
      next.phone = e.phone;
    } else if (!state.phone.startsWith("+")) {
      next.phone = e.phoneCountry;
    } else if (!isValidPhoneNumber(state.phone)) {
      next.phone = e.phoneInvalid;
    } else {
      const parsed = parsePhoneNumber(state.phone);
      if (!parsed || !parsed.country) {
        next.phone = e.phoneInvalid;
      } else if (parsed.getType() === "FIXED_LINE") {
        next.phone = e.phoneMobile;
      }
    }

    if (!state.dob.trim()) next.dob = e.dob;
    if (!state.address.trim()) next.address = e.address;

    return next;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);

    const errorCount = Object.keys(nextErrors).length;
    if (errorCount > 0) {
      toast.error(t.appointment.toastFixErrors, {
        description:
          errorCount === 1
            ? t.appointment.toastErrorsSingular
            : t.appointment.toastErrorsPlural.replace(
                "{n}",
                String(errorCount),
              ),
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, language: lang }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message ?? t.appointment.toastBookingFailed);
      }

      const smsNote = result?.sms?.sent
        ? t.appointment.toastSmsSent
        : t.appointment.toastSmsFailed;

      toast.success(t.appointment.toastBookingSuccess, {
        description: `${form.date} at ${form.startTime}. ${smsNote}`,
      });

      setForm(initialFormState);
      setErrors({});
      setStep(1);
    } catch (error: unknown) {
      toast.error(t.appointment.toastBookingFailed, {
        description: (error as Error).message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <div className="mx-auto flex max-w-6xl flex-col px-6 py-24 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
            {t.appointment.eyebrow}
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t.appointment.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            {t.appointment.subtitle}
          </p>
        </div>
        <div className="rounded-[2.5rem] border border-white/10 bg-white/3 p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-amber-300">
                    {t.appointment.stepOfTwo.replace("{n}", String(step))}
                  </span>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {step === 1
                      ? t.appointment.stepChooseDateTime
                      : t.appointment.stepCompleteDetails}
                  </h2>
                </div>
                {step === 2 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    {t.appointment.changeSlot}
                  </Button>
                ) : null}
              </div>

              {step === 1 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4 max-md:flex-col max-md:items-start">
                    <div>
                      <p className="text-sm text-slate-300">
                        {t.appointment.browseWeek}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 max-md:self-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={previousWeek}
                        disabled={weekStart <= currentWeekStart}
                      >
                        {t.appointment.previousWeek}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={nextWeek}
                        disabled={weekStart >= maxWeekStart}
                      >
                        {t.appointment.nextWeek}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {getWeekDays(weekStart).map((day) => {
                      const iso = formatDateIso(day);
                      return (
                        <button
                          key={iso}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              date: iso,
                              startTime: "",
                              endTime: "",
                            }))
                          }
                          disabled={
                            isPastDay(day) ||
                            isWeekend(day) ||
                            blockedDates.includes(iso)
                          }
                          className={`rounded-[1.75rem] border px-3 py-4 text-left text-sm transition ${
                            isPastDay(day) ||
                            isWeekend(day) ||
                            blockedDates.includes(iso)
                              ? "cursor-not-allowed border-white/10 bg-slate-900/60 text-slate-500"
                              : form.date === iso
                                ? "cursor-pointer border-white bg-white/10 text-white"
                                : "cursor-pointer border-white/10 bg-white/3 text-slate-200 hover:border-white/20"
                          }`}
                        >
                          <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                            {day.toLocaleDateString("en-GB", {
                              weekday: "short",
                            })}
                          </div>
                          <div className="mt-2 text-lg font-semibold">
                            {day.toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-slate-300">
                      {t.appointment.selectSlot}
                    </p>
                    {!form.date ? (
                      <div className="rounded-3xl border border-dashed border-white/15 bg-white/3 p-6 text-sm text-slate-400">
                        {t.appointment.chooseDateFirst}
                      </div>
                    ) : loadingAvailability ? (
                      <div className="rounded-3xl border border-dashed border-white/15 bg-white/3 p-6 text-sm text-slate-400">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/10 bg-slate-900/80 text-white animate-spin">
                            <span className="block h-4 w-4 rounded-full border-t-2 border-white"></span>
                          </span>
                          <span>{t.appointment.loadingAvailability}</span>
                        </div>
                      </div>
                    ) : availabilityError ? (
                      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-rose-100">
                        {availabilityError}
                      </div>
                    ) : availableTimes.length > 0 ? (
                      <div className="grid max-h-80 grid-cols-2 gap-3 overflow-y-auto pr-1 sm:max-h-none sm:grid-cols-3 sm:overflow-visible sm:pr-0">
                        {availableTimes.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => selectTime(slot)}
                            className={`rounded-3xl border px-4 py-4 text-sm font-semibold transition ${
                              form.startTime === slot
                                ? "cursor-pointer border-white bg-white/10 text-white"
                                : "cursor-pointer border-white/10 bg-white/3 text-slate-200 hover:border-white/20"
                            }`}
                          >
                            {slot} – {addSlotDuration(slot)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-3xl border border-dashed border-white/15 bg-white/3 p-6 text-sm text-slate-400">
                        {t.appointment.noTimes}
                      </div>
                    )}
                  </div>

                  <Button
                    type="button"
                    size="lg"
                    onClick={goToStepTwo}
                    disabled={!form.date || !form.startTime}
                    className="w-full"
                  >
                    {t.appointment.continueToDetails}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-white/10 bg-white/3 px-5 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">
                        {t.appointment.summaryDate}
                      </span>
                      <strong className="text-white">
                        {form.date
                          ? format(parseIsoDate(form.date), "EEE, d MMM yyyy")
                          : "—"}
                      </strong>
                    </div>
                    <div className="hidden h-4 w-px bg-white/10 sm:block" />
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">
                        {t.appointment.summaryTime}
                      </span>
                      <strong className="text-white">
                        {form.startTime
                          ? `${form.startTime} – ${form.endTime}`
                          : "—"}
                      </strong>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-sm">
                      <span className="text-slate-300">
                        {t.appointment.firstName}
                      </span>
                      <Input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="Anna"
                        aria-invalid={!!errors.firstName}
                      />
                      {errors.firstName ? (
                        <span className="text-xs text-rose-300">
                          {errors.firstName}
                        </span>
                      ) : null}
                    </label>
                    <label className="space-y-2 text-sm">
                      <span className="text-slate-300">
                        {t.appointment.lastName}
                      </span>
                      <Input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Kovács"
                        aria-invalid={!!errors.lastName}
                      />
                      {errors.lastName ? (
                        <span className="text-xs text-rose-300">
                          {errors.lastName}
                        </span>
                      ) : null}
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-sm">
                      <span className="text-slate-300">
                        {t.appointment.email}
                      </span>
                      <Input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="anna@example.com"
                        aria-invalid={!!errors.email}
                      />
                      {errors.email ? (
                        <span className="text-xs text-rose-300">
                          {errors.email}
                        </span>
                      ) : null}
                    </label>
                    <label className="space-y-2 text-sm">
                      <span className="text-slate-300">
                        {t.appointment.phone}
                      </span>
                      <PhoneInput
                        defaultCountry="HU"
                        international
                        aria-invalid={!!errors.phone}
                        value={form.phone}
                        onChange={(value) => {
                          setForm((prev) => ({
                            ...prev,
                            phone: value ?? "",
                          }));
                          setErrors((prev) => {
                            if (!prev.phone) return prev;
                            const next = { ...prev };
                            delete next.phone;
                            return next;
                          });
                        }}
                        placeholder="30 123 4567"
                      />
                      {errors.phone ? (
                        <span className="text-xs text-rose-300">
                          {errors.phone}
                        </span>
                      ) : null}
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-sm">
                      <span className="text-slate-300">
                        {t.appointment.dob}
                      </span>
                      <Popover open={dobOpen} onOpenChange={setDobOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            aria-invalid={!!errors.dob}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !form.dob && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 size-4" />
                            {form.dob
                              ? format(parseIsoDate(form.dob), "d MMMM yyyy")
                              : t.appointment.selectDate}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            startMonth={new Date(1920, 0)}
                            endMonth={today}
                            selected={
                              form.dob ? parseIsoDate(form.dob) : undefined
                            }
                            onSelect={(date) => {
                              if (!date) return;
                              setForm((prev) => ({
                                ...prev,
                                dob: formatDateIso(date),
                              }));
                              setErrors((prev) => {
                                if (!prev.dob) return prev;
                                const next = { ...prev };
                                delete next.dob;
                                return next;
                              });
                              setDobOpen(false);
                            }}
                            disabled={{ after: today }}
                            defaultMonth={
                              form.dob
                                ? parseIsoDate(form.dob)
                                : new Date(
                                    today.getFullYear() - 30,
                                    today.getMonth(),
                                  )
                            }
                            autoFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.dob ? (
                        <span className="text-xs text-rose-300">
                          {errors.dob}
                        </span>
                      ) : null}
                    </label>
                    <label className="space-y-2 text-sm">
                      <span className="text-slate-300">
                        {t.appointment.address}
                      </span>
                      <Input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder={t.appointment.addressPlaceholder}
                        aria-invalid={!!errors.address}
                      />
                      {errors.address ? (
                        <span className="text-xs text-rose-300">
                          {errors.address}
                        </span>
                      ) : null}
                    </label>
                  </div>

                  <label className="space-y-2 text-sm">
                    <span className="text-slate-300">
                      {t.appointment.notes}
                    </span>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base text-foreground placeholder:text-muted-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30 resize-none"
                      style={{ minHeight: 120 }}
                      placeholder={t.appointment.notesPlaceholder}
                    />
                  </label>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="w-full mt-4"
                  >
                    {submitting
                      ? t.appointment.submitting
                      : t.appointment.confirmBooking}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
