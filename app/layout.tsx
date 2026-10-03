import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LanguageProvider } from "@/components/language-provider";
import { getServicePrices } from "@/actions/google_sheet";
import { SITE_URL } from "@/lib/site-config";
import { JsonLd, OG_IMAGE, dentistJsonLd } from "@/lib/seo";

const nunitoSans = Nunito_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_TITLE =
  "RadDent – magán fogorvos és esztétikai fogászat Szigetszentmiklóson";
const SITE_DESCRIPTION =
  "A RadDent magánfogászat Szigetszentmiklóson, Dr. Forouzan Babak vezetésével. Esztétikai fogászat, implantátum, korona, fogfehérítés és megelőző ellátás – foglaljon időpontot online.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · RadDent",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "RadDent",
    "Rad Dent",
    "Dr Babak Forouzan",
    "Dr Forouzan Babak",
    "fogorvos Szigetszentmiklós",
    "magán fogorvos Szigetszentmiklós",
    "fogászat Szigetszentmiklós",
    "magánfogászat Szigetszentmiklós",
    "esztétikai fogászat Szigetszentmiklós",
    "fogorvosi rendelő Szigetszentmiklós",
    "fogfehérítés",
    "fogászati implantátum",
    "korona",
    "héj veneer",
    "Semmelweis Egyetem fogorvos",
    "dentist Szigetszentmiklós",
    "private dentist Szigetszentmiklós",
    "aesthetic dentistry Szigetszentmiklós",
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
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "hu_HU",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
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
      lang="hu-HU"
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
        <JsonLd data={dentistJsonLd()} />
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
