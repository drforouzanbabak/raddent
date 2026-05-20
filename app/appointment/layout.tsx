import type { Metadata } from "next";

const TITLE = "Időpontfoglalás";
const DESCRIPTION =
  "Foglaljon fogorvosi időpontot a budapesti RadDent rendelőjébe. Válasszon szabad dátumot és órát, adja meg adatait, és azonnali SMS-megerősítést kap.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "időpontfoglalás fogorvos",
    "fogorvos időpontfoglalás Budapest",
    "online fogorvos időpontfoglalás",
    "magán fogorvos időpont",
    "book dental appointment Budapest",
    "online dentist booking Budapest",
    "RadDent appointment",
    "Dr Babak Forouzan appointment",
    "Kossuth Lajos utca fogorvos",
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
