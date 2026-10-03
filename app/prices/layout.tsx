import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Fogászati árak Szigetszentmiklóson – árlista",
  description:
    "A szigetszentmiklósi RadDent magánfogászat aktuális árlistája: konzultáció, implantátum, korona, fogfehérítés, tömés és további kezelések árai forintban.",
  path: "/prices",
  keywords: [
    "fogászati árak Szigetszentmiklós",
    "magánfogászat Szigetszentmiklós árak",
    "fogorvos árak",
    "implantátum ár",
    "fogfehérítés ár",
    "fogtömés ár",
    "korona ár",
    "dentist prices Szigetszentmiklós",
    "RadDent árlista",
  ],
});

export default function PricesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
