import type { Metadata } from "next";

import { CLINIC, SITE_URL } from "@/lib/site-config";

export const OG_IMAGE = {
  url: "/my-photo.jpg",
  width: 2520,
  height: 3528,
  alt: "Dr. Forouzan Babak fogorvos a szigetszentmiklósi RadDent rendelőben",
};

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  robots?: Metadata["robots"];
};

// Child segments replace (not merge) the parent's openGraph/twitter objects,
// so every page rebuilds them in full together with its canonical URL.
export const pageMetadata = ({
  title,
  description,
  path,
  keywords,
  robots,
}: PageMetadataInput): Metadata => ({
  title,
  description,
  // Spread conditionally: an explicit `undefined` would wipe the root defaults.
  ...(keywords && { keywords }),
  ...(robots && { robots }),
  alternates: { canonical: path },
  openGraph: {
    type: "website",
    siteName: CLINIC.name,
    locale: "hu_HU",
    url: path,
    title,
    description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [OG_IMAGE.url],
  },
});

export const dentistJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Dentist",
  "@id": `${SITE_URL}/#dentist`,
  name: CLINIC.name,
  alternateName: CLINIC.alternateName,
  description:
    "Magánfogászat Szigetszentmiklóson Dr. Forouzan Babak vezetésével: esztétikai fogászat, implantátumok, koronák, fogfehérítés és megelőző ellátás.",
  url: SITE_URL,
  image: `${SITE_URL}${OG_IMAGE.url}`,
  logo: `${SITE_URL}/icon.png`,
  telephone: CLINIC.phone,
  email: CLINIC.email,
  address: {
    "@type": "PostalAddress",
    ...CLINIC.address,
  },
  sameAs: [CLINIC.social.facebook, CLINIC.social.instagram],
  employee: {
    "@type": "Person",
    name: CLINIC.doctor,
    jobTitle: "Fogorvos",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Semmelweis Egyetem",
    },
    knowsLanguage: ["hu", "en", "fa"],
  },
});

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
