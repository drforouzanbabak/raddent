import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Gyakori kérdések – fogászat Szigetszentmiklóson",
  description:
    "Válaszok a leggyakoribb kérdésekre a szigetszentmiklósi RadDent fogászati rendelővel kapcsolatban: első vizit, biztosítás, sürgősségi ellátás, fájdalomcsillapítás és technológia.",
  path: "/faq",
  keywords: [
    "fogászati GYIK",
    "fogorvos gyakori kérdések",
    "első fogorvosi vizit",
    "fogászati sürgősség Szigetszentmiklós",
    "fájdalommentes fogászat",
    "fogászat Szigetszentmiklós",
    "dental FAQ Szigetszentmiklós",
    "RadDent kérdések",
  ],
});

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
