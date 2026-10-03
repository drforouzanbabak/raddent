import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Időpontfoglalás fogorvoshoz Szigetszentmiklóson",
  description:
    "Foglaljon online időpontot a szigetszentmiklósi RadDent fogorvosi rendelőbe. Válasszon szabad napot és órát, és e-mailben értesítjük, amint a rendelő jóváhagyta a foglalást.",
  path: "/appointment",
  keywords: [
    "időpontfoglalás fogorvos",
    "fogorvos időpontfoglalás Szigetszentmiklós",
    "magán fogorvos Szigetszentmiklós időpont",
    "online fogorvos időpontfoglalás",
    "book dental appointment Szigetszentmiklós",
    "RadDent időpont",
  ],
});

export default function AppointmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
