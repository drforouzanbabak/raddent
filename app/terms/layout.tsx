import type { Metadata } from "next";

const TITLE = "Felhasználási feltételek";
const DESCRIPTION =
  "A RadDent weboldal és online időpontfoglaló rendszer használatát szabályozó feltételek.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "RadDent felhasználási feltételek",
    "fogorvos feltételek",
    "RadDent terms of use",
    "online booking terms",
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

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
