import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Felhasználási feltételek",
  description:
    "A RadDent weboldal és online időpontfoglaló rendszer használatát szabályozó feltételek.",
  path: "/terms",
  keywords: ["RadDent felhasználási feltételek", "RadDent terms of use"],
});

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
