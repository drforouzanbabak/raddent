import type { Metadata } from "next";

const TITLE = "Gyakran ismételt kérdések";
const DESCRIPTION =
  "Válaszok a leggyakoribb kérdésekre a budapesti RadDent fogászati rendelőjével kapcsolatban — első vizit, biztosítás, sürgősségi ellátás, fájdalomcsillapítás, technológia és még sok más.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "fogászati GYIK",
    "fogorvos gyakori kérdések",
    "első fogorvosi vizit",
    "fogászati sürgősség Budapest",
    "fogászati biztosítás",
    "fájdalommentes fogászat",
    "dental FAQ Budapest",
    "first dental visit Budapest",
    "dental emergency Budapest",
    "painless dentistry",
    "RadDent kérdések",
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

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
