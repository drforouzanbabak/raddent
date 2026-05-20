import type { Metadata } from "next";

const TITLE = "Árak és szolgáltatások";
const DESCRIPTION =
  "Átlátható árak minden kezelésre a szigetszentmiklósi RadDent rendelőjében. Konzultáció, implantátumok, koronák, fehérítés, tömések és még sok más — magyar forintban (HUF).";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "fogászati árak Szigetszentmiklós",
    "fogorvos árak",
    "implantátum ár",
    "fogfehérítés ár",
    "fogtömés ár",
    "korona ár",
    "fogászati kezelés árak",
    "konzultáció ár fogorvos",
    "dentist prices Szigetszentmiklós",
    "dental implant price Szigetszentmiklós",
    "teeth whitening price Szigetszentmiklós",
    "dental crown price",
    "RadDent árlista",
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

export default function PricesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
