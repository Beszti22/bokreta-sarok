// i18n.js — Bokréta Sarok Virágüzlet
// Keyed translation strings, Hungarian default + English mirror.
// Language toggle persisted via localStorage (see main.js).

const translations = {
  hu: {
    meta_title: "Bokréta Sarok Virágüzlet | Budapest, Ferencváros",
    meta_description:
      "Bokréta Sarok Virágüzlet — friss vágott virágok, csokrok és dekoráció a Mester utca és Bokréta utca sarkán, Budapesten, 2010 óta.",

    nav_home: "Főoldal",
    nav_about: "Rólunk",
    nav_services: "Szolgáltatások",
    nav_gallery: "Galéria",
    nav_reviews: "Vélemények",
    nav_contact: "Kapcsolat",
    nav_booking: "Rendelés",

    hero_eyebrow: "Virágüzlet a sarkon, 2010 óta",
    hero_title: "Bokréta Sarok Virágüzlet",
    hero_subtitle:
      "Friss vágott virágok, kézzel kötött csokrok és egyedi dekoráció — a Mester utca és a Bokréta utca sarkán.",
    hero_cta_primary: "Foglalás most",
    hero_cta_secondary: "Kapcsolat",
    hero_scroll_cue_label: "Görgessen lejjebb",

    about_eyebrow: "Rólunk",
    about_title: "Virágok, amik számítanak",
    about_body:
      "2010 óta válogatjuk a legszebb vágott virágokat és dísznövényeket a Mester utca és a Bokréta utca sarkán. Legyen szó egy spontán ajándékcsokorról, esküvői dekorációról vagy egy ünnepi rendezvényről, nálunk mindig friss árut és személyre szabott összeállítást talál.",
    about_stat_years: "éve a sarkon",
    about_stat_rating: "ajánlja",
    about_stat_reviews: "vélemény",

    services_eyebrow: "Szolgáltatások",
    services_title: "Amiben segíthetünk",
    service_1_title: "Csokrok és ajándék virágok",
    service_1_body:
      "Kézzel kötött csokrok minden alkalomra — születésnap, évforduló, vagy csak mert megérdemli.",
    service_2_title: "Esküvői és ünnepi dekoráció",
    service_2_body:
      "Egyedi virágdíszítés esküvőkre, ünnepségekre és céges eseményekre, a tervezéstől a kivitelezésig.",
    service_3_title: "Cserepes növények",
    service_3_body:
      "Válogatott szobanövények és cserepes dísznövények otthonra vagy irodába.",
    service_4_title: "Rendelés és szállítás",
    service_4_body:
      "Telefonos vagy online foglalás, igény szerint kiszállítással Budapesten.",

    bouquets_eyebrow: "Ihlet",
    bouquets_title: "Néhány csokrunk, amit készítettünk",
    bouquets_subtitle: "Ezekhez hasonló összeállításokat is kérhetsz a rendelési űrlapon.",
    bouquet_1_title: "Vegyes szezonális csokor",
    bouquet_1_body: "Rózsák, gerberák és napraforgók egy élénk, színes összeállításban — bármilyen alkalomra.",
    bouquet_2_title: "Rózsás-liliomos csokor",
    bouquet_2_body: "Klasszikus piros rózsák és liliomok — tökéletes évfordulóra vagy szerelmes meglepetésnek.",
    bouquet_3_title: "Tulipáncsokor",
    bouquet_3_body: "Friss, pasztell tulipánok kraft papírba csomagolva — egyszerű és elegáns.",
    bouquet_4_title: "Koszorú és cserepes dekor",
    bouquet_4_body: "Kézzel font koszorúk és cserepes dísznövények otthonra vagy megemlékezésre.",

    order_eyebrow: "Rendelés",
    order_title: "Kérj egyedi csokrot",
    order_subtitle: "Mondd el, milyen alkalomra és milyen virágokat szeretnél — mi összeállítjuk.",
    order_name_label: "Név",
    order_email_label: "E-mail cím",
    order_phone_label: "Telefonszám (opcionális)",
    order_date_label: "Kívánt dátum (opcionális)",
    order_occasion_label: "Milyen alkalomra?",
    order_occasion_placeholder: "Válassz…",
    order_occasion_option_birthday: "Születésnap",
    order_occasion_option_wedding: "Esküvő",
    order_occasion_option_anniversary: "Évforduló",
    order_occasion_option_remembrance: "Megemlékezés",
    order_occasion_option_surprise: "Csak úgy — meglepetés",
    order_occasion_option_other: "Egyéb",
    order_flowers_label: "Milyen fajta virágokat szeretne bele?",
    order_flower_rose: "Rózsa",
    order_flower_tulip: "Tulipán",
    order_flower_lily: "Liliom",
    order_flower_orchid: "Orchidea",
    order_flower_sunflower: "Napraforgó",
    order_flower_mixed: "Szezonális vegyes",
    order_notes_label: "Egyéb kérés (szín, költségkeret, stb.)",
    order_submit: "Ajánlatkérés küldése",
    order_success: "Köszönjük! Megkaptuk a rendelési igényt, hamarosan válaszolunk.",
    order_error: "Hiba történt a küldéskor. Kérjük, próbálja újra, vagy hívjon telefonon.",

    status_open: "Most nyitva",
    status_closed: "Most zárva",

    gallery_eyebrow: "Galéria",
    gallery_title: "Egy pillantás az üzletbe",

    reviews_eyebrow: "Vélemények",
    reviews_title: "Amit a vásárlóink mondanak",
    reviews_summary: "a vásárlók 98%-a ajánlja (36 értékelés alapján)",

    contact_eyebrow: "Kapcsolat",
    contact_title: "Keressen minket",
    contact_address_label: "Cím",
    contact_phone_label: "Telefon",
    contact_email_label: "E-mail",
    contact_facebook_label: "Facebook",
    contact_map_title: "Bokréta Sarok Virágüzlet térképen",
    contact_hours_label: "Nyitvatartás",
    contact_hours_value: "H–P: 9:00–19:00 · Szo: 8:00–16:00 · V: zárva",
    contact_form_title: "Írjon nekünk",
    contact_form_name: "Név",
    contact_form_email: "E-mail cím",
    contact_form_message: "Üzenet",
    contact_form_submit: "Üzenet küldése",
    contact_form_success: "Köszönjük! Üzenetét megkaptuk, hamarosan válaszolunk.",
    contact_form_error:
      "Hiba történt az üzenet küldésekor. Kérjük, próbálja újra, vagy hívjon telefonon.",

    footer_rights: "Minden jog fenntartva.",
  },

  en: {
    meta_title: "Bokréta Sarok Virágüzlet | Florist in Budapest, Ferencváros",
    meta_description:
      "Bokréta Sarok Virágüzlet — fresh cut flowers, bouquets and decoration on the corner of Mester utca and Bokréta utca, Budapest, since 2010.",

    nav_home: "Home",
    nav_about: "About",
    nav_services: "Services",
    nav_gallery: "Gallery",
    nav_reviews: "Reviews",
    nav_contact: "Contact",
    nav_booking: "Order",

    hero_eyebrow: "A corner flower shop since 2010",
    hero_title: "Bokréta Sarok Virágüzlet",
    hero_subtitle:
      "Fresh cut flowers, hand-tied bouquets and bespoke decoration — on the corner of Mester utca and Bokréta utca.",
    hero_cta_primary: "Book now",
    hero_cta_secondary: "Contact us",
    hero_scroll_cue_label: "Scroll down",

    about_eyebrow: "About us",
    about_title: "Flowers that matter",
    about_body:
      "Since 2010 we've been curating the finest cut flowers and plants on the corner of Mester utca and Bokréta utca. Whether it's a spontaneous gift bouquet, wedding decoration, or a festive event, you'll always find fresh stock and a personal touch with us.",
    about_stat_years: "years on the corner",
    about_stat_rating: "recommend us",
    about_stat_reviews: "reviews",

    services_eyebrow: "Services",
    services_title: "How we can help",
    service_1_title: "Bouquets & gift flowers",
    service_1_body:
      "Hand-tied bouquets for every occasion — birthdays, anniversaries, or just because.",
    service_2_title: "Wedding & event decoration",
    service_2_body:
      "Bespoke floral decoration for weddings, celebrations and corporate events, from planning to delivery.",
    service_3_title: "Potted plants",
    service_3_body:
      "A curated selection of houseplants and potted greenery for home or office.",
    service_4_title: "Ordering & delivery",
    service_4_body:
      "Book by phone or online, with delivery available across Budapest.",

    bouquets_eyebrow: "Inspiration",
    bouquets_title: "A few bouquets we've made",
    bouquets_subtitle: "You can ask for something like these on the order form below.",
    bouquet_1_title: "Mixed seasonal bouquet",
    bouquet_1_body: "Roses, gerberas and sunflowers in one vibrant mix — right for any occasion.",
    bouquet_2_title: "Rose & lily bouquet",
    bouquet_2_body: "Classic red roses and lilies — perfect for an anniversary or a romantic surprise.",
    bouquet_3_title: "Tulip bouquet",
    bouquet_3_body: "Fresh pastel tulips wrapped in kraft paper — simple and elegant.",
    bouquet_4_title: "Wreaths & potted décor",
    bouquet_4_body: "Hand-woven wreaths and potted plants for the home or a remembrance.",

    order_eyebrow: "Order",
    order_title: "Request a custom bouquet",
    order_subtitle: "Tell us the occasion and the flowers you'd like — we'll put it together.",
    order_name_label: "Name",
    order_email_label: "Email address",
    order_phone_label: "Phone number (optional)",
    order_date_label: "Preferred date (optional)",
    order_occasion_label: "What's the occasion?",
    order_occasion_placeholder: "Choose…",
    order_occasion_option_birthday: "Birthday",
    order_occasion_option_wedding: "Wedding",
    order_occasion_option_anniversary: "Anniversary",
    order_occasion_option_remembrance: "Remembrance",
    order_occasion_option_surprise: "Just because — surprise",
    order_occasion_option_other: "Other",
    order_flowers_label: "What kind of flowers would you like in it?",
    order_flower_rose: "Rose",
    order_flower_tulip: "Tulip",
    order_flower_lily: "Lily",
    order_flower_orchid: "Orchid",
    order_flower_sunflower: "Sunflower",
    order_flower_mixed: "Seasonal mix",
    order_notes_label: "Other requests (colors, budget, etc.)",
    order_submit: "Send request",
    order_success: "Thank you! We've received your request and will reply soon.",
    order_error: "Something went wrong sending your request. Please try again or call us.",

    status_open: "Open now",
    status_closed: "Closed now",

    gallery_eyebrow: "Gallery",
    gallery_title: "A look inside the shop",

    reviews_eyebrow: "Reviews",
    reviews_title: "What our customers say",
    reviews_summary: "98% of customers recommend us (based on 36 reviews)",

    contact_eyebrow: "Contact",
    contact_title: "Get in touch",
    contact_address_label: "Address",
    contact_phone_label: "Phone",
    contact_email_label: "Email",
    contact_facebook_label: "Facebook",
    contact_map_title: "Bokréta Sarok Virágüzlet on the map",
    contact_hours_label: "Opening hours",
    contact_hours_value: "Mon–Fri: 9am–7pm · Sat: 8am–4pm · Sun: closed",
    contact_form_title: "Send us a message",
    contact_form_name: "Name",
    contact_form_email: "Email address",
    contact_form_message: "Message",
    contact_form_submit: "Send message",
    contact_form_success: "Thank you! We've received your message and will reply soon.",
    contact_form_error:
      "Something went wrong sending your message. Please try again or call us.",

    footer_rights: "All rights reserved.",
  },
};

// Classic (non-module) <script> top-level `const` does NOT attach to
// `window`, unlike `var` — expose it explicitly so main.js can read it.
if (typeof window !== "undefined") {
  window.translations = translations;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = translations;
}
