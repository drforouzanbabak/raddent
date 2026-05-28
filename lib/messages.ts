export type Lang = "en" | "hu";

type DeepStringify<T> = T extends readonly (infer U)[]
  ? ReadonlyArray<DeepStringify<U>>
  : T extends string
    ? string
    : { readonly [K in keyof T]: DeepStringify<T[K]> };

export type Messages = DeepStringify<typeof MESSAGES.en>;

export const MESSAGES = {
  en: {
    nav: {
      about: "About",
      services: "Services",
      prices: "Prices",
      faq: "FAQ",
      reviews: "Reviews",
      contact: "Contact",
    },
    faq: {
      eyebrow: "Frequently asked",
      title: "Answers to the questions patients ask most.",
      subtitle:
        "If you don't see your question here, send a message and I'll get back to you personally.",
      items: [
        {
          q: "What can I expect during my first visit?",
          a: "During your first visit, I perform a comprehensive oral examination, supplemented with digital X-rays if needed. We discuss your dental history, current concerns, and aesthetic goals. I explain the findings and prepare a personalised treatment plan. The visit usually takes 60–90 minutes and includes a professional cleaning, unless an urgent intervention is needed.",
        },
        {
          q: "Do you accept insurance?",
          a: "I work with most major Hungarian insurance providers and help you navigate the details of your coverage. Before treatment begins, I verify your insurance eligibility and provide a transparent quote for any out-of-pocket costs. For extensive treatments I also offer instalment payment options. I accept cash, bank card, and bank transfer.",
        },
        {
          q: "How often should I come in for check-ups?",
          a: "I generally recommend a check-up every six months to keep your oral hygiene on track. For some patients with specific issues, more frequent visits may be appropriate. During your first examination I'll put together a personalised schedule based on your individual needs and risk factors.",
        },
        {
          q: "What pain-management options do you offer?",
          a: "Patient comfort is very important to me, so I offer several pain-management methods, including local anaesthesia and modern, gentle techniques. I always use the latest methods to minimise discomfort, and for more extensive procedures we can also discuss sedation options beforehand.",
        },
        {
          q: "Do you handle dental emergencies?",
          a: "Yes — I'm available for emergencies because dental problems can't wait. I keep dedicated time slots open for urgent cases and stay reachable outside regular hours. Common emergencies include severe toothache, a broken tooth, a lost filling, or dental trauma. Please call immediately if you have one of these issues.",
        },
        {
          q: "What technology do you use in the practice?",
          a: "I invest in the latest dental technology to deliver high-quality care. In the practice I use low-radiation digital X-rays, an intraoral camera for more precise diagnosis, laser therapy for gum treatment, and an advanced sterilisation system. I also use CAD/CAM technology for same-day crowns and digital impressions for a more comfortable experience.",
        },
        {
          q: "Do you offer orthodontics?",
          a: "No, I don't perform orthodontic treatment. I focus on general and aesthetic dentistry — including fillings, restorations, aesthetic treatments, whitening, and oral hygiene care. When orthodontics is needed, I refer patients to a trusted specialist.",
        },
      ],
      ctaTitle: "Still have a question?",
      ctaSubtitle:
        "Send a message and I'll get back to you personally — usually within a day.",
      ctaButton: "Message us",
      bookButton: "Book a consultation",
    },
    footer: {
      tagline:
        "Aesthetic dentistry in Szigetszentmiklós. Gentle care, premium materials, the smile you've been waiting for.",
      services: "Services",
      visitUs: "Visit Us",
      contact: "Contact",
      hours: "Mon – Fri · 09:00 – 19:00",
      copyright: "RadDent Clinic. All rights reserved.",
      privacy: "Privacy",
      terms: "Terms",
      viewPriceList: "View price list →",
    },
    home: {
      heroEyebrow: "Boutique dental care",
      heroTitle: "Dentistry that gives you your smile back.",
      heroSubtitle:
        "I'm Dr Babak Forouzan — and at RadDent we believe every smile is precious. Modern procedures, premium materials, and the kind of care that gives you back your confidence.",
      bookAppointment: "Book an appointment",
      messageUs: "Message us",
      exploreTreatments: "Explore treatments",
      statsYears: "Years",
      statsPatients: "Patients",
      statsLanguages: "Languages",
      portraitRole: "Lead Dentist",
      portraitName: "Dr Babak Forouzan",
      portraitSubtitle: "Aesthetic & Cosmetic Dentistry · 10+ years",
      servicesEyebrow: "Treatments",
      servicesTitle: "Specialist care across every chair.",
      servicesSubtitle:
        "Implantology, cosmetic, orthodontic and preventive treatments — all delivered by clinicians who have built their reputations on these procedures.",
      services: [
        {
          title: "Premium Implants",
          description:
            "Lifetime-grade titanium implants placed by board-certified surgeons.",
        },
        {
          title: "Cosmetic Dentistry",
          description:
            "Veneers, bonding, and contouring designed around your face shape.",
        },
        {
          title: "Studio Whitening",
          description:
            "In-clinic whitening that protects enamel — up to eight shades brighter.",
        },
        {
          title: "Orthodontics",
          description:
            "Invisible aligners and modern bracket systems for adults and teens.",
        },
        {
          title: "Preventive Care",
          description:
            "Bi-annual check-ups, deep cleans, and gum-health monitoring.",
        },
        {
          title: "Emergency Treatment",
          description:
            "Same-day appointments for pain, trauma, and urgent repairs.",
        },
      ],
      studioEyebrow: "Inside the studio",
      studioTitle: "A space designed to feel like anything but a dentist.",
      studioSubtitle:
        "Natural light, soft acoustics, and equipment chosen for both clinical precision and patient comfort.",
      whyEyebrow: "Why RadDent",
      whyTitle: "Designed for people who notice the details.",
      whySubtitle:
        "Most clinics rush. We don't. Longer appointments, fewer patients per day, and a single point of contact through every stage of your treatment.",
      reasons: [
        {
          title: "Boutique experience",
          description:
            "Private treatment suites, calm lighting, weighted blankets — designed to soothe even the most anxious patients.",
        },
        {
          title: "Specialist team",
          description:
            "Implantologists, orthodontists, and prosthodontists working under one roof, collaborating on every plan.",
        },
        {
          title: "Modern technology",
          description:
            "3D imaging, digital impressions, and CAD/CAM milling — fewer visits, more precise results.",
        },
      ],
      reviewsEyebrow: "Loved on Facebook",
      reviewsTitle: "What our patients say.",
      reviewsSubtitle: "Real reviews from real patients on our Facebook page,",
      seeAllReviews: "See all reviews",
      reviewsViaFacebook: "via Facebook",
      ctaTitle: "Book your first visit.",
      ctaSubtitle:
        "A 45-minute consultation, a digital scan, and an honest plan. No upsell. No pressure.",
    },
    about: {
      eyebrow: "About",
      title: "Meet Dr Babak Forouzan.",
      subtitle:
        "I graduated from Semmelweis University in 2014. The thing I have learned in the years since is that the fear of dentistry is almost always greater than the treatment itself — and my job is to make sure that never holds you back from the care you deserve.",
      bookConsultation: "Book a consultation",
      seePricing: "See pricing",
      cardRole: "Lead Dentist",
      cardName: "Dr Babak Forouzan",
      cardBadge: "DMD",
      cardEducation: "Semmelweis University · 2014",
      cardSpecialty: "Aesthetic & general dentistry",
      cardLanguages: "Hungarian · English · Farsi",
      cardLocation: "Szigetszentmiklós, Hungary",
      storyEyebrow: "My story",
      storyTitle: "A note from Dr Forouzan.",
      storyP1:
        "I really love aesthetic dentistry because it gives people back their self-confidence. I feel the best when I see that quiet satisfaction in my patients' eyes.",
      storyP2:
        "For me, the two most beautiful things in the world are music and a smile. I hope to give my patients many smiles — and I trust that life has the most beautiful surprises in store for all of us.",
      storyP3:
        "I believe every tooth is precious. My goal is to preserve the natural ones as much as possible. I work with modern procedures and premium materials, because the most important thing to me is the smile of the person sitting in front of me.",
      quote:
        "After more than ten years of experience, I have come to understand that patients' fears are often greater than reality itself. During every treatment, I strive — both as a doctor and as a person — to ensure that those who trust me feel as safe as possible and do not experience pain during the treatment.",
      attributionName: "Dr Babak Forouzan",
      attributionRole: "Lead Dentist, RadDent",
      valuesEyebrow: "How I work",
      valuesTitle: "Four principles, every visit.",
      valuesSubtitle:
        "The way care is delivered matters as much as the procedure itself. These are the standards every patient at RadDent can expect.",
      values: [
        {
          title: "Calm, painless care",
          description:
            "Gentle technique, generous anaesthesia, and unhurried appointments — designed around how you feel, not the clock.",
        },
        {
          title: "Honest treatment plans",
          description:
            "Written plans, fixed quotes, and an honest conversation about what is necessary now versus what can wait.",
        },
        {
          title: "Continuous training",
          description:
            "Ongoing education in implantology, prosthetics, and digital dentistry to bring the best of the field into the chair.",
        },
        {
          title: "Multilingual practice",
          description:
            "Consultations in Hungarian, English, and Farsi — clear communication is part of the treatment.",
        },
      ],
      meetCtaTitle: "Come and meet me.",
      meetCtaSubtitle:
        "A 45-minute consultation, a digital scan, and an honest conversation about what you want for your smile.",
    },
    prices: {
      eyebrow: "Pricing",
      title: "Transparent pricing for every treatment.",
      description:
        "Your final treatment plan and quote are confirmed in person after a consultation and diagnostic examination.",
      disclaimer:
        "* Prices are in Hungarian Forints (HUF) and sometimes include a range or “from” designation.",
      searchEyebrow: "Search services",
      searchPlaceholder: "e.g. fogfehérítés, implant, panoráma...",
      matchSingular: "match",
      matchPlural: "matches",
      matchesFor: "for",
      noMatches: "No services match your search.",
      loadError:
        "We couldn't load the price list right now. Please contact us directly for an up-to-date quote.",
      noServices: "No services found.",
      serviceSingular: "service",
      servicePlural: "services",
      ctaTitle: "Not sure where to start?",
      ctaSubtitle:
        "Book a consultation and we'll prepare a written treatment plan with a fixed quote — no commitment.",
      bookConsultation: "Book a consultation",
    },
    privacy: {
      eyebrow: "Privacy",
      title: "Privacy Policy",
      lastUpdated: "Last updated: 28 May 2026",
      intro:
        "RadDent is a private dental practice run by Dr Babak Forouzan. We respect your privacy and only collect the information necessary to book and provide your dental care. This notice explains what we collect, why, on what legal basis, who has access, how long we keep it, and the rights you have under the EU General Data Protection Regulation (GDPR) and Hungarian data protection law.",
      sections: [
        {
          heading: "Data controller",
          body: "The data controller is Dr Babak Forouzan, operating as RadDent at 2310 Szigetszentmiklós, Bajcsy-Zsilinszky utca 21/B., 1st floor, door 2, Hungary. For any privacy matter you can reach us at drforouzanbabak@gmail.com or +36 70 746 0776.",
        },
        {
          heading: "What we collect",
          body: "We only collect the information you enter into the booking form: your first and last name, email address, phone number, date of birth, postal address, any notes you choose to share, and your selected interface language. Some of this data — your date of birth, and anything health-related you write in the notes field — is treated as special-category health data under GDPR Article 9, and we process it solely for the purpose of providing your dental care. We do not run analytics, advertising trackers, or third-party cookies. Your selected language is stored in your browser's localStorage so the site remembers your preference between visits.",
        },
        {
          heading: "How we use your information",
          body: "Your details are used to create your appointment in Google Calendar, to keep a patient record in a private Google Sheet so that we remember you on your next visit, to send a confirmation SMS through Infobip immediately after booking, and to send a reminder SMS the day before your appointment.",
        },
        {
          heading: "Legal basis for processing",
          body: "We process your personal data on the following legal bases under GDPR: (a) performance of a contract and pre-contractual steps at your request — Article 6(1)(b) — to schedule and provide the appointment you have asked for; (b) provision of healthcare — Article 9(2)(h) — for special-category health data such as your date of birth and any clinical information in the notes field; (c) legitimate interests — Article 6(1)(f) — to send you an appointment reminder SMS the day before your visit, so you don't miss your slot; (d) legal obligation — Article 6(1)(c) — to retain medical records for the period required by Hungarian healthcare law.",
        },
        {
          heading: "Who has access",
          body: "Only Dr Forouzan has access to your patient record. The only third parties involved are Google (Sheets and Calendar) and Infobip (SMS delivery). These providers act as data processors on our behalf under written data processing agreements and are subject to their own privacy policies.",
        },
        {
          heading: "International transfers",
          body: "Google may process some of your data on servers located outside the European Economic Area. Where this happens, Google relies on the EU-US Data Privacy Framework and the European Commission's Standard Contractual Clauses to provide a level of protection equivalent to that required by GDPR. Infobip processes data within the EEA.",
        },
        {
          heading: "How long we keep your data",
          body: "Hungarian healthcare law — Act XLVII of 1997 on the Processing and Protection of Health and Related Personal Data (Eüak. tv.) — requires us to retain medical documentation for at least 30 years from the date it is recorded, and at least 50 years for imaging records. We keep your patient record for these statutory periods. Non-medical contact information that is not part of the medical record will be deleted on your request. After the statutory retention period, records are securely deleted or fully anonymised.",
        },
        {
          heading: "Your rights",
          body: "Under GDPR you have the right to request access to your personal data, to ask for it to be corrected, and — subject to the statutory retention period for medical records — to ask for it to be deleted or for processing to be restricted. You may also object to processing based on legitimate interests (for example, our appointment reminders). To exercise any of these rights, email us — see Contact below.",
        },
        {
          heading: "Right to lodge a complaint",
          body: "If you believe we have mishandled your personal data, you have the right to lodge a complaint with the Hungarian National Authority for Data Protection and Freedom of Information (NAIH): H-1055 Budapest, Falk Miksa utca 9-11; ugyfelszolgalat@naih.hu; +36 1 391 1400; naih.hu.",
        },
        {
          heading: "Contact",
          body: "If you have any privacy-related questions, write to drforouzanbabak@gmail.com or call +36 70 746 0776.",
        },
      ],
    },
    terms: {
      eyebrow: "Terms",
      title: "Terms of Use",
      lastUpdated: "Last updated: 20 May 2026",
      intro:
        "These terms govern your use of the RadDent website. By using the site you agree to them.",
      sections: [
        {
          heading: "What this website is",
          body: "The RadDent website is an information and booking tool for Dr Babak Forouzan's private dental practice in Szigetszentmiklós. It is not a substitute for clinical advice. Any information shown here is general and may change.",
        },
        {
          heading: "Booking an appointment",
          body: "When you submit the booking form you are requesting an appointment at the selected date and time. The appointment is confirmed once we receive the request, add it to the calendar, and send you a confirmation SMS. If you do not receive a confirmation, please get in touch.",
        },
        {
          heading: "Cancelling or rescheduling",
          body: "Please give us at least 24 hours' notice if you need to cancel or move your appointment so we can offer the slot to another patient.",
        },
        {
          heading: "Pricing",
          body: "Prices shown on the website are in Hungarian Forints (HUF) and are guide prices. Your final treatment plan and quote are agreed in person after a consultation and diagnostic examination.",
        },
        {
          heading: "Treatment",
          body: "The terms of any treatment, the materials used, expected outcomes, and risks are discussed in person before the work begins. Nothing on this website forms a treatment agreement.",
        },
        {
          heading: "Liability and availability",
          body: "We work to keep the website accurate and available, but we cannot guarantee uninterrupted access or that every detail is up to date at all times. The website is provided as is.",
        },
        {
          heading: "Changes to these terms",
          body: "We may update these terms occasionally. The latest version always applies and will be available on this page.",
        },
        {
          heading: "Governing law",
          body: "These terms are governed by the laws of Hungary.",
        },
        {
          heading: "Contact",
          body: "Questions about these terms? Email drforouzanbabak@gmail.com or call +36 70 746 0776.",
        },
      ],
    },
    appointment: {
      eyebrow: "Book your visit",
      title: "Book Your Appointment",
      subtitle:
        "Pick a date and time that works for you, share a few details, and we'll confirm your visit instantly.",
      stepOfTwo: "Step {n} of 2",
      stepChooseDateTime: "Choose date & time",
      stepCompleteDetails: "Complete your details",
      changeSlot: "Change slot",
      browseWeek: "Browse the current week and choose an hour.",
      previousWeek: "← Previous",
      nextWeek: "Next →",
      selectSlot: "Select an available one-hour slot for the chosen date.",
      chooseDateFirst: "Choose a date to view available appointment times.",
      loadingAvailability: "Loading availability from Google Calendar...",
      noTimes: "No available times found for this date.",
      continueToDetails: "Continue to details",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone",
      dob: "Date of Birth",
      address: "Address",
      notes: "Notes",
      notesPlaceholder: "Tell us anything we should know...",
      addressPlaceholder: "2030 Budapest, Fő utca 10.",
      selectDate: "Select date",
      summaryDate: "Date",
      summaryTime: "Time",
      confirmBooking: "Confirm Booking",
      submitting: "Booking…",
      consentBefore: "I have read and accept the ",
      consentLink: "Privacy Policy",
      consentAfter:
        ", and I agree to RadDent processing my personal and health-related data to schedule and provide my dental appointment.",
      errorRequired: {
        firstName: "First name is required.",
        lastName: "Last name is required.",
        email: "Email is required.",
        emailInvalid: "Enter a valid email address.",
        phone: "Phone number is required.",
        phoneCountry: "Phone number must include a country code.",
        phoneInvalid: "Enter a valid phone number.",
        phoneMobile: "Enter a mobile number — we'll send SMS confirmations.",
        dob: "Date of birth is required.",
        address: "Address is required.",
        consent: "You must accept the Privacy Policy to book an appointment.",
      },
      toastFixErrors: "Please fix the errors below.",
      toastErrorsSingular: "1 field needs your attention.",
      toastErrorsPlural: "{n} fields need your attention.",
      toastBookingFailed: "Booking failed.",
      toastBookingSuccess: "Appointment booked!",
      toastSmsSent: "We've sent you a confirmation SMS.",
      toastSmsFailed: "Booking confirmed (SMS could not be sent).",
    },
  },
  hu: {
    nav: {
      about: "Rólam",
      services: "Szolgáltatások",
      prices: "Árak",
      faq: "GYIK",
      reviews: "Vélemények",
      contact: "Kapcsolat",
    },
    faq: {
      eyebrow: "Gyakori kérdések",
      title: "Válaszok a leggyakrabban feltett kérdésekre.",
      subtitle:
        "Ha nem találja meg a kérdését, küldjön üzenetet és személyesen válaszolok Önnek.",
      items: [
        {
          q: "Mit várhatok az első vizit során?",
          a: "Az első vizit alkalmával átfogó szájvizsgálatot végzek, szükség esetén digitális röntgennel kiegészítve. Megbeszéljük a fogászati előzményeket, aktuális panaszokat és esztétikai célokat. Ismertetem a vizsgálati eredményeket és személyre szabott kezelési tervet készítek. A vizit általában 60–90 percet vesz igénybe, és professzionális tisztítást is tartalmaz, kivéve, ha sürgős beavatkozás szükséges.",
        },
        {
          q: "Elfogad biztosítást?",
          a: "A legtöbb nagyobb magyarországi biztosítóval együttműködöm, és segítek eligazodni a fedezet részleteiben. A kezelés megkezdése előtt ellenőrzöm a biztosítási jogosultságot, és átlátható árajánlatot adok az esetleges saját költségekről. Kiterjedt kezelésekhez részletfizetési lehetőséget is biztosítok. Készpénzt, bankkártyát és átutalást is elfogadok.",
        },
        {
          q: "Milyen gyakran javasolt ellenőrzésre járni?",
          a: "Általában félévente javaslom az ellenőrzést a megfelelő szájhigiénia fenntartásához. Bizonyos páciensek esetében, speciális problémáknál gyakoribb vizsgálat lehet indokolt. Az első vizsgálat során személyre szabott ütemezést állítok össze az egyéni igények és kockázati tényezők alapján.",
        },
        {
          q: "Milyen fájdalomcsillapítási lehetőségeket kínál?",
          a: "Kiemelten fontos számomra a páciensek kényelme, ezért többféle fájdalomcsillapítási módszert kínálok, például helyi érzéstelenítést és korszerű, kíméletes eljárásokat. Mindig a legmodernebb technikákat alkalmazom a kellemetlenség minimalizálására, és szükség esetén nyugtatási lehetőségeket is megbeszélhetünk kiterjedtebb beavatkozások előtt.",
        },
        {
          q: "Vállal sürgősségi fogászati ellátást?",
          a: "Igen, sürgősségi esetekben is rendelkezésre állok, mert tudom, hogy a fogászati problémák nem várhatnak. Külön idősávokat tartok fenn sürgős esetekre, és elérhetőséget biztosítok rendelési időn kívül is. Gyakori sürgősségi problémák közé tartozik az erős fogfájás, letört fog, kiesett tömés vagy fogsérülés. Kérjük, hívjon azonnal, ha ilyen problémája van.",
        },
        {
          q: "Milyen technológiát használ a rendelőben?",
          a: "A legmodernebb fogászati technológiákba fektetek a magas színvonalú ellátás érdekében. A rendelőben digitális röntgent alkalmazok alacsony sugárzással, intraorális kamerát a pontosabb diagnózisért, lézerterápiát az ínykezeléshez, valamint fejlett sterilizálási rendszert. CAD/CAM technológiát is használok az egynapos koronákhoz, és digitális lenyomatvételt a kényelmesebb kezeléshez.",
        },
        {
          q: "Vállal fogszabályozást?",
          a: "Nem, fogszabályozást (orthodontia) nem végzek. Általános és esztétikai fogászattal foglalkozom, beleértve a fogtöméseket, fogpótlásokat, esztétikai kezeléseket, fehérítést és szájhigiénés kezeléseket. Szükség esetén megbízható szakemberhez irányítom a pácienseket fogszabályozás céljából.",
        },
      ],
      ctaTitle: "Van még kérdése?",
      ctaSubtitle:
        "Küldjön üzenetet és személyesen válaszolok — általában egy napon belül.",
      ctaButton: "Üzenjen nekünk",
      bookButton: "Konzultáció foglalása",
    },
    footer: {
      tagline:
        "Esztétikai fogászat Budapesten. Gyengéd ellátás, prémium anyagok, a mosoly, amire várt.",
      services: "Szolgáltatások",
      visitUs: "Látogasson el",
      contact: "Kapcsolat",
      hours: "Hétfő – Péntek · 08:00 – 17:00",
      copyright: "RadDent Klinika. Minden jog fenntartva.",
      privacy: "Adatvédelem",
      terms: "Feltételek",
      viewPriceList: "Árlista megtekintése →",
    },
    home: {
      heroEyebrow: "Butik fogászati ellátás",
      heroTitle: "Fogászat, ami visszaadja a mosolyát.",
      heroSubtitle:
        "Dr. Forouzan Babak vagyok — és a RadDent-ben hisszük, hogy minden mosoly értékes. Modern eljárások, prémium anyagok és az a fajta törődés, ami visszaadja az önbizalmát.",
      bookAppointment: "Időpontfoglalás",
      messageUs: "Üzenjen nekünk",
      exploreTreatments: "Kezeléseink",
      statsYears: "Év",
      statsPatients: "Páciens",
      statsLanguages: "Nyelvek",
      portraitRole: "Vezető fogorvos",
      portraitName: "Dr. Forouzan Babak",
      portraitSubtitle: "Esztétikai és kozmetikai fogászat · 10+ év",
      servicesEyebrow: "Kezelések",
      servicesTitle: "Szakorvosi ellátás minden székben.",
      servicesSubtitle:
        "Implantológia, esztétikai, fogszabályozási és megelőző kezelések — mindezt olyan szakemberek végzik, akik ezekre az eljárásokra építették hírnevüket.",
      services: [
        {
          title: "Prémium implantátumok",
          description:
            "Élethosszra tervezett titán implantátumok, igazolt szakorvosok által.",
        },
        {
          title: "Esztétikai fogászat",
          description:
            "Héjak, kötések és kontúrozás az Ön arcformájához igazítva.",
        },
        {
          title: "Stúdió fogfehérítés",
          description:
            "Rendelői fogfehérítés, ami óvja a zománcot — akár nyolc árnyalattal világosabb.",
        },
        {
          title: "Fogszabályozás",
          description:
            "Láthatatlan sínek és modern brackett-rendszerek felnőttek és tinédzserek számára.",
        },
        {
          title: "Megelőző ellátás",
          description:
            "Féléves szűrővizsgálatok, mély tisztítás és íny-egészségügyi ellenőrzés.",
        },
        {
          title: "Sürgősségi kezelés",
          description:
            "Aznapi időpontok fájdalom, sérülés és sürgős javítások esetén.",
        },
      ],
      studioEyebrow: "A stúdió belül",
      studioTitle: "Olyan tér, ami bármi inkább, mint egy fogorvosi rendelő.",
      studioSubtitle:
        "Természetes fény, lágy akusztika és berendezések, amelyeket a klinikai pontosság és a páciensek kényelme szempontjából választottunk.",
      whyEyebrow: "Miért a RadDent",
      whyTitle: "Azoknak terveztük, akik észreveszik a részleteket.",
      whySubtitle:
        "A legtöbb rendelő rohan. Mi nem. Hosszabb időpontok, kevesebb páciens naponta, és egyetlen kapcsolattartó a kezelés minden szakaszában.",
      reasons: [
        {
          title: "Butik élmény",
          description:
            "Privát kezelőhelyiségek, nyugodt megvilágítás, súlyozott takarók — a legszorongóbb páciensek megnyugtatására tervezve.",
        },
        {
          title: "Szakorvosi csapat",
          description:
            "Implantológusok, fogszabályozók és protetikai szakorvosok egy fedél alatt, minden tervben együttműködve.",
        },
        {
          title: "Modern technológia",
          description:
            "3D képalkotás, digitális lenyomatok és CAD/CAM marás — kevesebb látogatás, pontosabb eredmények.",
        },
      ],
      reviewsEyebrow: "Szeretik a Facebookon",
      reviewsTitle: "Amit pácienseink mondanak.",
      reviewsSubtitle:
        "Valódi vélemények valódi pácienseinktől a Facebook-oldalunkon,",
      seeAllReviews: "Összes vélemény",
      reviewsViaFacebook: "Facebookon",
      ctaTitle: "Foglalja le első látogatását.",
      ctaSubtitle:
        "45 perces konzultáció, digitális szkennelés és őszinte terv. Nincs ráerőltetés. Nincs nyomás.",
    },
    about: {
      eyebrow: "Rólam",
      title: "Ismerje meg Dr. Forouzan Babakot.",
      subtitle:
        "2014-ben szereztem diplomát a Semmelweis Egyetemen. Az eltelt évek alatt megtanultam, hogy a fogászattól való félelem szinte mindig nagyobb, mint maga a kezelés — és az én feladatom, hogy ez soha ne álljon az Ön megérdemelt ellátásának útjába.",
      bookConsultation: "Konzultáció foglalása",
      seePricing: "Árak megtekintése",
      cardRole: "Vezető fogorvos",
      cardName: "Dr. Forouzan Babak",
      cardBadge: "DMD",
      cardEducation: "Semmelweis Egyetem · 2014",
      cardSpecialty: "Esztétikai és általános fogászat",
      cardLanguages: "Magyar · Angol · Perzsa",
      cardLocation: "Budapest, Magyarország",
      storyEyebrow: "Történetem",
      storyTitle: "Néhány szó Dr. Forouzantól.",
      storyP1:
        "Nagyon szeretem az esztétikai fogászatot, mert visszaadja az emberek önbizalmát. Akkor érzem magam a legjobban, amikor azt a csendes elégedettséget látom a pácienseim szemében.",
      storyP2:
        "Számomra a világ két legszebb dolga a zene és egy mosoly. Remélem, hogy sok mosolyt adhatok pácienseimnek — és hiszem, hogy az élet a legszebb meglepetéseket tartogatja mindannyiunk számára.",
      storyP3:
        "Hiszem, hogy minden fog értékes. Célom, hogy a természetes fogakat amennyire csak lehet, megőrizzem. Modern eljárásokkal és prémium anyagokkal dolgozom, mert a legfontosabb számomra az előttem ülő ember mosolya.",
      quote:
        "Több mint tíz év tapasztalat után megértettem, hogy a páciensek félelme gyakran nagyobb, mint a valóság. Minden kezelés során arra törekszem — orvosként és emberként egyaránt —, hogy azok, akik bíznak bennem, a lehető legbiztonságosabban érezzék magukat, és ne tapasztaljanak fájdalmat a kezelés során.",
      attributionName: "Dr. Forouzan Babak",
      attributionRole: "Vezető fogorvos, RadDent",
      valuesEyebrow: "Hogyan dolgozom",
      valuesTitle: "Négy alapelv, minden látogatáskor.",
      valuesSubtitle:
        "A kezelés módja ugyanolyan fontos, mint maga az eljárás. Ezek azok a szabványok, amelyekre minden RadDent páciens számíthat.",
      values: [
        {
          title: "Nyugodt, fájdalommentes ellátás",
          description:
            "Gyengéd technika, bőséges érzéstelenítés és kényelmes tempójú időpontok — az Ön érzéseit, nem az órát figyelve.",
        },
        {
          title: "Őszinte kezelési tervek",
          description:
            "Írott tervek, fix árajánlatok és őszinte beszélgetés arról, mi szükséges most és mi várhat.",
        },
        {
          title: "Folyamatos képzés",
          description:
            "Folyamatos továbbképzés az implantológia, protetika és digitális fogászat területén, hogy a szakma legjobbját hozzuk a székhez.",
        },
        {
          title: "Többnyelvű praxis",
          description:
            "Konzultációk magyar, angol és perzsa nyelven — a tiszta kommunikáció a kezelés része.",
        },
      ],
      meetCtaTitle: "Találkozzunk személyesen.",
      meetCtaSubtitle:
        "45 perces konzultáció, digitális szkennelés és őszinte beszélgetés arról, mit szeretne a mosolyával.",
    },
    prices: {
      eyebrow: "Árak",
      title: "Átlátható árak minden kezeléshez.",
      description:
        "A végleges kezelési terv és árajánlat személyesen kerül megerősítésre konzultációt és diagnosztikai vizsgálatot követően.",
      disclaimer:
        "* Az árak magyar forintban (HUF) értendők, és néha tartományt vagy „-tól” jelzést tartalmaznak.",
      searchEyebrow: "Keresés a szolgáltatások között",
      searchPlaceholder: "pl. fogfehérítés, implantátum, panoráma...",
      matchSingular: "találat",
      matchPlural: "találat",
      matchesFor: "erre:",
      noMatches: "Nincs találat a keresésére.",
      loadError:
        "Pillanatnyilag nem tudtuk betölteni az árlistát. Kérjük, vegye fel velünk a kapcsolatot egy aktuális árajánlatért.",
      noServices: "Nem találhatók szolgáltatások.",
      serviceSingular: "szolgáltatás",
      servicePlural: "szolgáltatás",
      ctaTitle: "Nem biztos, hol kezdje?",
      ctaSubtitle:
        "Foglaljon konzultációt, és írásos kezelési tervet készítünk fix árajánlattal — kötelezettség nélkül.",
      bookConsultation: "Konzultáció foglalása",
    },
    privacy: {
      eyebrow: "Adatvédelem",
      title: "Adatvédelmi tájékoztató",
      lastUpdated: "Utolsó frissítés: 2026. május 28.",
      intro:
        "A RadDent Dr. Forouzan Babak magán fogászati rendelője. Tiszteletben tartjuk a magánéletét, és csak az időpontfoglaláshoz és a fogászati ellátás biztosításához feltétlenül szükséges adatokat gyűjtjük. Ez a tájékoztató ismerteti, milyen adatokat kezelünk, milyen célból és jogalapon, ki fér hozzá, meddig őrizzük azokat, valamint az Önt megillető jogokat az EU általános adatvédelmi rendelete (GDPR) és a magyar adatvédelmi jogszabályok szerint.",
      sections: [
        {
          heading: "Adatkezelő",
          body: "Az adatkezelő Dr. Forouzan Babak, aki RadDent néven a 2310 Szigetszentmiklós, Bajcsy-Zsilinszky utca 21/B. I. emelet 2. ajtó címen végzi tevékenységét. Adatvédelemmel kapcsolatos kérdésével a drforouzanbabak@gmail.com címen vagy a +36 70 746 0776 telefonszámon érhet el minket.",
        },
        {
          heading: "Milyen adatokat kezelünk",
          body: "Csak az időpontfoglaló űrlapon megadott adatokat gyűjtjük: keresztnév és vezetéknév, e-mail cím, telefonszám, születési dátum, lakcím, az opcionális megjegyzések, valamint a kiválasztott felület-nyelv. Ezen adatok egy része — a születési dátum és a megjegyzésekbe írt, egészségi állapotra vonatkozó információ — a GDPR 9. cikke szerinti különleges kategóriájú, egészségügyi adatnak minősül, és kizárólag az Ön fogászati ellátásának biztosítása céljából kezeljük. Nem használunk analitikai vagy hirdetési követőket, sem harmadik féltől származó sütiket. A nyelvi beállítást a böngészője localStorage-ában tároljuk, hogy a következő látogatáskor is emlékezzünk rá.",
        },
        {
          heading: "Hogyan használjuk az adatait",
          body: "Az adatait az időpont létrehozására használjuk a Google Naptárban, egy privát Google Sheet páciensnyilvántartás vezetésére, hogy a következő látogatáskor is emlékezzünk Önre, megerősítő SMS küldésére az Infobip szolgáltatáson keresztül közvetlenül a foglalás után, valamint emlékeztető SMS küldésére az időpontot megelőző napon.",
        },
        {
          heading: "Az adatkezelés jogalapja",
          body: "Személyes adatait a GDPR alábbi jogalapjai alapján kezeljük: (a) szerződés teljesítése és a szerződéskötést megelőző lépések megtétele az Ön kérésére — 6. cikk (1) bekezdés b) pont — az Ön által kért időpont biztosításához; (b) egészségügyi ellátás nyújtása — 9. cikk (2) bekezdés h) pont — a különleges kategóriájú egészségügyi adatok kezeléséhez (születési dátum, a megjegyzésekben szereplő klinikai információk); (c) jogos érdek — 6. cikk (1) bekezdés f) pont — az időpontot megelőző napon küldött emlékeztető SMS célja, hogy ne maradjon le a foglalt időpontról; (d) jogi kötelezettség teljesítése — 6. cikk (1) bekezdés c) pont — az egészségügyi dokumentáció magyar jogszabályok által előírt megőrzése.",
        },
        {
          heading: "Ki fér hozzá",
          body: "A páciensnyilvántartásához kizárólag Dr. Forouzan fér hozzá. A folyamatban érintett harmadik felek a Google (Sheets és Calendar) és az Infobip (SMS-küldés). Ezek a szolgáltatók írásos adatfeldolgozási szerződés alapján, adatfeldolgozóként nevünkben kezelik az adatokat, és saját adatvédelmi szabályzatuk vonatkozik rájuk.",
        },
        {
          heading: "Adattovábbítás harmadik országba",
          body: "A Google bizonyos esetekben az Európai Gazdasági Térségen (EGT) kívüli szervereken is kezelheti az adatait. Ilyen esetben a Google az EU–USA Adatvédelmi Keretrendszerre (EU-US Data Privacy Framework) és az Európai Bizottság által elfogadott Általános Szerződési Feltételekre (SCC) támaszkodik, amelyek a GDPR-ral egyenértékű védelmi szintet biztosítanak. Az Infobip az EGT-n belül kezeli az adatokat.",
        },
        {
          heading: "Meddig őrizzük az adatait",
          body: "A magyar egészségügyi jogszabályok — különösen az egészségügyi és a hozzájuk kapcsolódó személyes adatok kezeléséről szóló 1997. évi XLVII. törvény (Eüak. tv.) — előírják, hogy az egészségügyi dokumentációt legalább 30 évig, képalkotó felvételeket legalább 50 évig meg kell őriznünk a felvétel keletkezésétől számítva. Páciensnyilvántartását ezekre a törvényi időtartamokra őrizzük meg. Az egészségügyi dokumentációhoz nem tartozó kapcsolattartási adatokat kérésére töröljük. A törvényi megőrzési idő lejártát követően a nyilvántartásokat biztonságosan töröljük vagy teljes mértékben anonimizáljuk.",
        },
        {
          heading: "Az Ön jogai",
          body: "A GDPR alapján jogosult személyes adataihoz való hozzáférést kérni, javításukat kezdeményezni, valamint — az egészségügyi dokumentációra vonatkozó kötelező megőrzési időre figyelemmel — kérni a törlésüket vagy az adatkezelés korlátozását. A jogos érdeken alapuló adatkezelés (például az emlékeztető SMS) ellen tiltakozhat. Jogainak gyakorlásához írjon nekünk a lenti Kapcsolat részben megadott elérhetőségre.",
        },
        {
          heading: "Panasztételi jog",
          body: "Ha úgy érzi, hogy személyes adatainak kezelése során jogsértés történt, panaszt nyújthat be a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH): 1055 Budapest, Falk Miksa utca 9-11.; ugyfelszolgalat@naih.hu; +36 1 391 1400; naih.hu.",
        },
        {
          heading: "Kapcsolat",
          body: "Adatvédelemmel kapcsolatos kérdés esetén írjon a drforouzanbabak@gmail.com címre, vagy hívja a +36 70 746 0776 telefonszámot.",
        },
      ],
    },
    terms: {
      eyebrow: "Feltételek",
      title: "Felhasználási feltételek",
      lastUpdated: "Utolsó frissítés: 2026. május 20.",
      intro:
        "Ezek a feltételek szabályozzák a RadDent weboldal használatát. Az oldal használatával elfogadja ezeket.",
      sections: [
        {
          heading: "Mire szolgál ez a weboldal",
          body: "A RadDent weboldal Dr. Forouzan Babak budapesti magán fogászati rendelőjének tájékoztató és időpontfoglaló oldala. Nem helyettesíti az orvosi tanácsadást. Az itt megjelenő információ általános jellegű és változhat.",
        },
        {
          heading: "Időpontfoglalás",
          body: "Amikor elküldi az időpontfoglaló űrlapot, kérelmet nyújt be a kiválasztott dátumra és időpontra. Az időpont akkor minősül megerősítettnek, amikor megkapjuk a kérelmet, bekerül a naptárba, és Ön megerősítő SMS-t kap. Ha nem érkezik megerősítés, kérjük, vegye fel velünk a kapcsolatot.",
        },
        {
          heading: "Lemondás és módosítás",
          body: "Kérjük, lemondás vagy időpont-módosítás esetén legalább 24 órával korábban értesítsen minket, hogy másik páciensnek felajánlhassuk az időpontot.",
        },
        {
          heading: "Árak",
          body: "A weboldalon szereplő árak magyar forintban (HUF) értendők és tájékoztató jellegűek. A végleges kezelési tervet és árajánlatot konzultációt és diagnosztikai vizsgálatot követően személyesen véglegesítjük.",
        },
        {
          heading: "Kezelés",
          body: "A kezelés feltételeit, a felhasznált anyagokat, a várható eredményeket és a kockázatokat személyesen, a beavatkozás megkezdése előtt megbeszéljük. A weboldalon szereplő tartalom nem keletkeztet kezelési szerződést.",
        },
        {
          heading: "Felelősség és elérhetőség",
          body: 'Mindent megteszünk a weboldal pontosságáért és elérhetőségéért, de nem garantálunk megszakítás nélküli üzemelést, és azt sem, hogy minden részlet mindig naprakész. A weboldalt jelenlegi állapotában ("as is") biztosítjuk.',
        },
        {
          heading: "A feltételek módosítása",
          body: "Ezek a feltételek időről időre frissülhetnek. Mindig az aktuális verzió érvényes, amely ezen az oldalon érhető el.",
        },
        {
          heading: "Irányadó jog",
          body: "Ezekre a feltételekre Magyarország joga irányadó.",
        },
        {
          heading: "Kapcsolat",
          body: "A feltételekkel kapcsolatos kérdéseivel forduljon a drforouzanbabak@gmail.com e-mail címhez, vagy hívja a +36 70 746 0776 számot.",
        },
      ],
    },
    appointment: {
      eyebrow: "Foglaljon időpontot",
      title: "Időpontfoglalás",
      subtitle:
        "Válasszon egy dátumot és időpontot, adjon meg néhány adatot, és azonnal megerősítjük a látogatását.",
      stepOfTwo: "{n}. lépés a 2-ből",
      stepChooseDateTime: "Válasszon dátumot és időpontot",
      stepCompleteDetails: "Töltse ki az adatait",
      changeSlot: "Időpont módosítása",
      browseWeek: "Böngéssze az aktuális hetet és válasszon egy órát.",
      previousWeek: "← Előző",
      nextWeek: "Következő →",
      selectSlot:
        "Válasszon egy elérhető egyórás időpontot a kiválasztott napon.",
      chooseDateFirst:
        "Válasszon dátumot az elérhető időpontok megtekintéséhez.",
      loadingAvailability: "Elérhetőség betöltése a Google Naptárból...",
      noTimes: "Nincs elérhető időpont ezen a napon.",
      continueToDetails: "Tovább az adatokhoz",
      firstName: "Keresztnév",
      lastName: "Vezetéknév",
      email: "E-mail",
      phone: "Telefonszám",
      dob: "Születési dátum",
      address: "Cím",
      notes: "Megjegyzések",
      notesPlaceholder: "Mondja el, amit tudnunk kell...",
      addressPlaceholder: "2030 Budapest, Fő utca 10.",
      selectDate: "Válasszon dátumot",
      summaryDate: "Dátum",
      summaryTime: "Idő",
      confirmBooking: "Foglalás megerősítése",
      submitting: "Foglalás folyamatban…",
      consentBefore: "Elolvastam és elfogadom az ",
      consentLink: "adatvédelmi tájékoztatót",
      consentAfter:
        ", és hozzájárulok ahhoz, hogy a RadDent személyes és egészségügyi adataimat a fogászati időpont egyeztetése és biztosítása céljából kezelje.",
      errorRequired: {
        firstName: "A keresztnév megadása kötelező.",
        lastName: "A vezetéknév megadása kötelező.",
        email: "Az e-mail cím megadása kötelező.",
        emailInvalid: "Adjon meg egy érvényes e-mail címet.",
        phone: "A telefonszám megadása kötelező.",
        phoneCountry: "A telefonszámnak tartalmaznia kell az országhívót.",
        phoneInvalid: "Adjon meg egy érvényes telefonszámot.",
        phoneMobile: "Adjon meg egy mobilszámot — SMS megerősítést küldünk.",
        dob: "A születési dátum megadása kötelező.",
        address: "A cím megadása kötelező.",
        consent:
          "Az időpontfoglaláshoz el kell fogadnia az adatvédelmi tájékoztatót.",
      },
      toastFixErrors: "Kérjük, javítsa az alábbi hibákat.",
      toastErrorsSingular: "1 mezőre figyelmet kell fordítania.",
      toastErrorsPlural: "{n} mezőre figyelmet kell fordítania.",
      toastBookingFailed: "A foglalás sikertelen.",
      toastBookingSuccess: "Időpont lefoglalva!",
      toastSmsSent: "Megerősítő SMS-t küldtünk.",
      toastSmsFailed: "Foglalás megerősítve (az SMS nem volt elküldhető).",
    },
  },
} as const;
