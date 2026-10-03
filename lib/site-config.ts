// Single source of truth for public business details (NAP: name, address,
// phone). Keep in sync with the clinic's Google Business Profile.

const resolveSiteUrl = () => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
};

export const SITE_URL = resolveSiteUrl();

export const CLINIC = {
  name: "RadDent",
  alternateName: "Rad Dent",
  doctor: "Dr. Forouzan Babak",
  phone: "+36 70 746 0776",
  phoneHref: "tel:+36707460776",
  email: "drforouzanbabak@gmail.com",
  address: {
    streetAddress: "Bajcsy-Zsilinszky utca 21/B. I. emelet 2. ajtó",
    postalCode: "2310",
    addressLocality: "Szigetszentmiklós",
    addressCountry: "HU",
  },
  fullAddress:
    "2310 Szigetszentmiklós, Bajcsy-Zsilinszky utca 21/B. I. emelet 2. ajtó",
  social: {
    facebook: "https://www.facebook.com/FogorvosDentist",
    instagram: "https://www.instagram.com/drforouzanbabak",
  },
} as const;
