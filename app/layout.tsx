import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LanguageProvider } from "@/components/language-provider";
import { getServicePrices } from "@/actions/google_sheet";

const nunitoSans = Nunito_Sans({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "RadDent — Esztétikai fogászat Budapesten";
const SITE_DESCRIPTION =
  "A RadDent egy magán fogászati rendelő Budapesten, Dr. Forouzan Babak vezetésével. Esztétikai fogászat, implantátumok, koronák, fehérítés és megelőző ellátás — modern berendezések, prémium anyagok, nyugodt rendelés.";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: "%s · RadDent",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "RadDent",
    "Dr Babak Forouzan",
    "Dr Forouzan Babak",
    "fogorvos Budapest",
    "magán fogorvos",
    "esztétikai fogászat Budapest",
    "fogászat Budapest",
    "fogorvosi rendelő Budapest",
    "fogfehérítés",
    "fogászati implantátum",
    "korona",
    "héj veneer",
    "Semmelweis Egyetem fogorvos",
    "XIV. kerület fogorvos",
    "dentist Budapest",
    "private dentist Budapest",
    "aesthetic dentistry Budapest",
    "cosmetic dentistry Budapest",
    "dental implants Budapest",
    "teeth whitening Budapest",
  ],
  authors: [{ name: "Dr Babak Forouzan" }],
  creator: "RadDent",
  publisher: "RadDent",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: "website",
    siteName: "RadDent",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "hu_HU",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const getFooterCategories = async (): Promise<string[]> => {
  try {
    const services = await getServicePrices();
    const seen = new Set<string>();
    const ordered: string[] = [];
    for (const service of services) {
      const category = service.category;
      if (category && !seen.has(category)) {
        seen.add(category);
        ordered.push(category);
      }
    }
    return ordered;
  } catch (error: unknown) {
    console.error(
      "[layout] failed to load categories:",
      (error as Error).message,
    );
    return [];
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getFooterCategories();

  return (
    <html
      lang="hu"
      className={cn(
        "h-full",
        "dark",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        nunitoSans.variable,
      )}
    >
      <body
        className="flex min-h-full flex-col bg-slate-950 text-slate-100"
        style={{
          backgroundImage:
            "radial-gradient(circle at top, rgba(255,255,255,0.10), transparent 45%), radial-gradient(circle at bottom right, rgba(99,102,241,0.12), transparent 35%), #020617",
        }}
      >
        <LanguageProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer categories={categories} />
          <Toaster richColors closeButton position="top-right" />
        </LanguageProvider>
      </body>
    </html>
  );
}
