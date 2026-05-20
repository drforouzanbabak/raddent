import type { Metadata } from "next";

const TITLE = "Időpontfoglalás";
const DESCRIPTION =
  "Foglaljon fogorvosi időpontot a szigetszentmiklósi RadDent rendelőjébe. Válasszon szabad dátumot és órát, adja meg adatait, és azonnali SMS-megerősítést kap.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "időpontfoglalás fogorvos",
    "fogorvos időpontfoglalás Szigetszentmiklós",
    "online fogorvos időpontfoglalás",
    "magán fogorvos időpont",
    "book dental appointment Szigetszentmiklós",
    "online dentist booking Szigetszentmiklós",
    "RadDent appointment",
    "Dr Babak Forouzan appointment",
    "2310 Szigetszentmiklós, Bajcsy-Zsilinszky utca 21/B. I. emelet 2. ajtó",
    "XIV. kerület fogorvos",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function AppointmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
