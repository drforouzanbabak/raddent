import type { Metadata } from "next";

const TITLE = "Dr. Forouzan Babak bemutatkozása";
const DESCRIPTION =
  "Ismerje meg Dr. Forouzan Babakot — a Semmelweis Egyetemen végzett fogorvos, aki az esztétikai fogászatra, a gyengéd, fájdalommentes ellátásra és a természetes fogak megőrzésére összpontosít a szigetszentmiklósi RadDent rendelőjében.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Dr Babak Forouzan",
    "Dr Forouzan Babak",
    "Forouzan Babak fogorvos",
    "Semmelweis Egyetem fogorvos",
    "aesthetic dentist Szigetszentmiklós",
    "esztétikai fogorvos Szigetszentmiklós",
    "fogorvos bemutatkozás",
    "Persian dentist Szigetszentmiklós",
    "perzsa fogorvos Szigetszentmiklós",
    "Farsi speaking dentist Szigetszentmiklós",
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

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
