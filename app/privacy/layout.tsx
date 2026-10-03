import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Adatvédelmi tájékoztató",
  description:
    "Hogyan kezeli a RadDent az Ön személyes adatait. Csak azokat az információkat gyűjtjük, amelyeket az időpontfoglalás során Ön ad meg.",
  path: "/privacy",
  keywords: [
    "RadDent adatvédelem",
    "adatvédelmi tájékoztató fogorvos",
    "RadDent privacy policy",
  ],
});

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
