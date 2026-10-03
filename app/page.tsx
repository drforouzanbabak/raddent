import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

import { HomeContent } from "./home-content";

const TITLE =
  "RadDent – magán fogorvos és esztétikai fogászat Szigetszentmiklóson";

export const metadata: Metadata = {
  ...pageMetadata({
    title: TITLE,
    description:
      "A RadDent magánfogászat Szigetszentmiklóson, Dr. Forouzan Babak vezetésével. Esztétikai fogászat, implantátum, korona, fogfehérítés és megelőző ellátás – foglaljon időpontot online.",
    path: "/",
  }),
  // The brand is already in the title, so skip the "%s · RadDent" template.
  title: { absolute: TITLE },
};

export default function Home() {
  return <HomeContent />;
}
