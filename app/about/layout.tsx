import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Dr. Forouzan Babak – fogorvos Szigetszentmiklóson",
  description:
    "Ismerje meg Dr. Forouzan Babakot, a Semmelweis Egyetemen végzett fogorvost, aki a szigetszentmiklósi RadDent rendelőben az esztétikai fogászatra, a kíméletes ellátásra és a természetes fogak megőrzésére összpontosít.",
  path: "/about",
  keywords: [
    "Dr Babak Forouzan",
    "Dr Forouzan Babak",
    "Forouzan Babak fogorvos",
    "fogorvos Szigetszentmiklós",
    "esztétikai fogorvos Szigetszentmiklós",
    "Semmelweis Egyetem fogorvos",
    "perzsa fogorvos Szigetszentmiklós",
    "angolul beszélő fogorvos Szigetszentmiklós",
    "aesthetic dentist Szigetszentmiklós",
    "Farsi speaking dentist Szigetszentmiklós",
  ],
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
