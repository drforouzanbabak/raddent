import type { Metadata } from "next";

const TITLE = "Adatvédelmi tájékoztató";
const DESCRIPTION =
  "Hogyan kezeli a RadDent az Ön személyes adatait. Csak azokat az információkat gyűjtjük, amelyeket az időpontfoglalás során Ön ad meg.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "RadDent adatvédelem",
    "adatvédelmi tájékoztató fogorvos",
    "RadDent privacy policy",
    "fogorvos adatvédelem Szigetszentmiklós",
  ],
  robots: {
    index: true,
    follow: false,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
