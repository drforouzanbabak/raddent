import type { Metadata } from "next";
import { verifyAppointmentToken } from "@/lib/appointment-token";
import { getPatientById } from "@/actions/google_sheet";
import { SuggestTimeForm, type SuggestRequest } from "./suggest-form";

export const metadata: Metadata = {
  title: "Másik időpont javaslása",
  robots: { index: false, follow: false },
};

export default async function SuggestTimePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = await searchParams;

  let request: SuggestRequest | null = null;
  if (typeof token === "string") {
    try {
      const payload = verifyAppointmentToken(token);
      if (payload.purpose !== "patient") {
        const patient = await getPatientById(payload.patientId);
        if (patient) {
          request = {
            token,
            patientName: `${patient.firstName} ${patient.lastName}`.trim(),
            date: payload.date,
            startTime: payload.startTime,
            endTime: payload.endTime,
          };
        }
      }
    } catch {
      // invalid or expired token — the form renders an error state
    }
  }

  return <SuggestTimeForm request={request} />;
}
