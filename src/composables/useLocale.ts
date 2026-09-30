// src/composables/useLocale.ts
// Complete 10-Language Internationalization Composable for Kader Grad Kodeljevo
// Supported Languages: sl (Slovenian), en (English UK), de (German), fr (French), it (Italian), sr (Serbian), nl (Dutch), pl (Polish), cs (Czech), es (Spanish)
// Features: SSR Cookie + State Hydration, O(1) Pre-flattening Cache, Dual Interpolation ({param} & {{param}}), 100% Key Parity

import { computed, type Ref } from 'vue'

export const SUPPORTED_LOCALES = ['sl', 'en', 'de', 'fr', 'it', 'sr', 'nl', 'pl', 'cs', 'es'] as const
export type Locale = typeof SUPPORTED_LOCALES[number]
export const DEFAULT_LOCALE: Locale = 'sl'

export function isSupportedLocale(val: unknown): val is Locale {
  return typeof val === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(val)
}

// Typed composable signatures for auto-imported Nuxt globals
type UseCookieFn = <T = string>(name: string, opts?: {
  default?: () => T | Ref<T>
  maxAge?: number
  sameSite?: true | false | 'lax' | 'strict' | 'none'
  path?: string
  watch?: boolean | 'shallow'
  readonly?: boolean
}) => Ref<T>

type UseStateFn = <T>(key: string, init?: () => T | Ref<T>) => Ref<T>

export interface Dict {
  [key: string]: string | Dict
}

export const localeLabels: Record<Locale, { label: string; name: string; native: string; flag: string }> = {
  sl: { label: 'Slovenščina', name: 'Slovenščina', native: 'SL', flag: '🇸🇮' },
  en: { label: 'English (UK)', name: 'English', native: 'EN', flag: '🇬🇧' },
  de: { label: 'Deutsch', name: 'Deutsch', native: 'DE', flag: '🇩🇪' },
  fr: { label: 'Français', name: 'Français', native: 'FR', flag: '🇫🇷' },
  it: { label: 'Italiano', name: 'Italiano', native: 'IT', flag: '🇮🇹' },
  sr: { label: 'Srpski', name: 'Srpski', native: 'SR', flag: '🇷🇸' },
  nl: { label: 'Nederlands', name: 'Nederlands', native: 'NL', flag: '🇳🇱' },
  pl: { label: 'Polski', name: 'Polski', native: 'PL', flag: '🇵🇱' },
  cs: { label: 'Čeština', name: 'Čeština', native: 'CS', flag: '🇨🇿' },
  es: { label: 'Español', name: 'Español', native: 'ES', flag: '🇪🇸' }
}

const sl: Dict = {
  "header": {
    "langSelectAria": "Izbira jezika",
    "langSelector": "Izbira jezika",
    "logoAlt": "Kader Grad Kodeljevo"
  },
  "home": {
    "monWed": "Ponedeljek – Sreda",
    "thu": "Četrtek",
    "fri": "Petek (Klubska zabava)",
    "sat": "Sobota",
    "sun": "Nedelja",
  },
  "pizzeria": {
    "provenanceTitle": "Zaveza Pristnosti & Certificirano Poreklo",
    "provenanceDesc": "Uporabljamo izključno certificirane italijanske sestavine (D.O.P. in I.G.P.) ter hladno stiskano ekološko oljčno olje.",
    "regularFamily": "Navadna/Družinska",
    "colPizzaTitle": "PIZZE",
    "colPanuozzoTitle": "PANUOZZO SENDVIČI",
    "colNarezekTitle": "NAREZEK (ZA 2 OSEBI)",
    "colSaladsTitle": "SOLATE",
    "priceListValidFrom": "Cenik velja od 1.6.2026",
    "pricesVat": "Vse cene so v evrih (€) in vključujejo DDV.",
    "allergenLegendTitle": "Legenda alergenov:",
    "allergenLegendText": "1 gluten | 2 raki | 3 jajca | 4 ribe | 5 soja | 6 sulfiti | 7 mleko in mlečni izdelki (vključno z laktozo) | 8 oreščki | 9 gorčica | 10 sezam | 11 mehkužci",
    "m_marinara_desc": "Pelati San Marzano DOP, bazilika, origano, konfitiran česen",
    "m_margerita_desc": "Pelati San Marzano DOP, mozzarella fior di latte, origano",
    "m_klasika_name": "Klasika",
    "m_klasika_desc": "Pelati San Marzano DOP, mozzarella fior di latte, kuhan pršut, sveži šampinjoni, origano",
    "m_bufalina_desc": "Pelati San Marzano DOP, sveža bazilika, mozzarella di bufala DOP, Grana Padano DOP, češnjev paradižnik",
    "m_regina_desc": "Pelati San Marzano DOP, sveža bazilika, Parmigiano Reggiano, sušeni paradižniki, stracciatella",
    "m_bresaola_desc": "Pelati San Marzano DOP, mozzarella fior di latte, bresaola, mlada špinača, Grana Padano DOP, češnjev paradižnik, stracciatella, reduciran balzamični kis",
    "m_krasotica_name": "Krasotica",
    "m_krasotica_desc": "Pelati San Marzano DOP, mozzarella fior di latte, Grana Padano DOP, pršut, konfitiran česen, rukola",
    "m_peperoni_desc": "Pelati San Marzano DOP, mozzarella fior di latte, pikantna salama, rdeča čebula",
    "m_kalabria_desc": "Pelati San Marzano DOP, mozzarella fior di latte, 'nduja, marinirane artičoke, sušeni paradižniki, rukola, Grana Padano DOP",
    "m_arrotolata_desc": "Pelati San Marzano DOP, mozzarella fior di latte, panceta arrotolata, mlada špinača, dimljena rikota",
    "m_tuna_desc": "Pelati San Marzano DOP, mozzarella fior di latte, tuna, rdeča čebula, olive taggiasce",
    "m_ortolana_desc": "Pelati San Marzano DOP, mozzarella fior di latte, bučke, melancani, šampinjoni, rukola, Grana Padano DOP",
    "m_satarasa_name": "Sataraša",
    "m_satarasa_desc": "Pelati San Marzano DOP, mozzarella fior di latte, peperonata, konfitiran česen, rukola, dimljena rikota",
    "m_tartufina_desc": "Pelati San Marzano DOP, mozzarella fior di latte, šampinjoni, tartufata, rukola, stracciatella, Grana Padano DOP",
    "m_vegana_name": "Vegana",
    "m_vegana_desc": "Pelati San Marzano DOP, sveža bazilika, sicilijanska caponata, sušeni paradižnik, mlada špinača, rukola, olive taggiasche",
    "m_dodatek1_title": "Dodatek I",
    "m_dodatek1_items": "Pelati, šampinjoni, rdeča čebula, jajce, sveža bazilika, koruza",
    "m_dodatek2_title": "Dodatek II",
    "m_dodatek3_title": "Dodatek III",
    "m_panGarlicBread_name": "Česnov kruh s parmezanom",
    "m_narezek_name": "Narezek (za 2 osebi)",
    "m_narezek_desc": "Pršut, rolana panceta, mortadela, pikantna salama, bresaola (goveji pršut), olive taggiasce, Grana Padano DOP, focaccia z rožmarinom",
    "m_salMesana_name": "Mešana solata",
    "m_salTuna_name": "Tuna solata",
    "m_salBuffalo_name": "Buffalo solata",
    "m_salRoastbeef_name": "Solata z roastbeefom",
  },
  "site": {
    "eventsTitle": "Program",
    "eventsSub": "Naslednji dogodki v Gradu Kodeljevo.",
    "eventsEmpty": "Trenutno ni razpisanih prihodnjih dogodkov. Sledi nam na Instagramu.",
    "eventsMore": "Vsi dogodki na Resident Advisor →",
    "eventsFree": "Vstop prost",
    "intro": "“Pizza bistro in plesni bar na gradu Kodeljevo.”",
    "follow": "Sledi nam na Instagramu za novosti in odprtine.",
    "closing": "Vljudno, Kader.",
    "menuCta": "Meni",
    "menuImageAlt": "Meni Kader — pice, panuozzo, solate in ploščad",
    "band1Alt": "Klubski obok v Gradu Kodeljevo",
    "band2Alt": "Pica v peči na drva",
    "band3Alt": "Zaseljen grad Kodeljevo",
    "dodatkiTitle": "Dodatki",
    "seoTitle": "Kader Grad Kodeljevo — Pica Tonda Romana & Klub Ljubljana",
    "seoDesc": "Pica Tonda Romana z rustičnim testom, pečena v 375 °C peči na drva, ter klubska kultura v baročnem gradu Kodeljevo v Ljubljani. Meni, delovni čas in prizorišče.",
    "menuTitle": "Meni",
    "menuNote": "Pice, sendviči panuozzo, solate in ploščad za dva. Pice pečemo v peči na drva; cene so v evrih.",
    "hoursTitle": "Delovni čas",
    "kitchen": "Kuhinja: 12:00 – 22:00.",
    "venueTitle": "Prizorišče",
    "venueP1": "Zgodovinski baročni dvorec Codelli iz 17. stoletja z velikim vrtom, poletno teraso in klubskim obokom je na voljo za zasebne dogodke.",
    "venueP2": "Za poroke, poslovna srečanja, zasebne zabave, razstave in koncerte. Ponujamo celoten gostinski servis, profesionalno ozvočenje in razsvetljavo, skupaj z razpoložljivostjo do 500 gostov.",
    "venueP3": "Za povpraševanja in ogled prostora pišite na naš e-poštni naslov ali nas pokličite.",
    "contactTitle": "Kontakt",
    "reserveNote": "Rezervacije in naročanje sprejemamo po telefonu."
  },
}

const en: Dict = {
  "header": {
    "langSelectAria": "Language selector",
    "langSelector": "Language selector",
    "logoAlt": "Kader Grad Kodeljevo"
  },
  "home": {
    "monWed": "Monday – Wednesday",
    "thu": "Thursday",
    "fri": "Friday (Club Night)",
    "sat": "Saturday",
    "sun": "Sunday",
  },
  "pizzeria": {
    "provenanceTitle": "Commitment to Authenticity & Certified Origin",
    "provenanceDesc": "We exclusively use certified Italian ingredients (D.O.P. and I.G.P.) and cold-pressed organic extra virgin olive oil.",
    "regularFamily": "Regular/Family",
    "colPizzaTitle": "PIZZAS",
    "colPanuozzoTitle": "PANUOZZO SANDWICHES",
    "colNarezekTitle": "CHARCUTERIE (FOR 2)",
    "colSaladsTitle": "SALADS",
    "priceListValidFrom": "Price list valid from 1 June 2026",
    "pricesVat": "All prices are in Euros (€) and include VAT.",
    "allergenLegendTitle": "Allergen guide:",
    "allergenLegendText": "1 gluten | 2 crustaceans | 3 eggs | 4 fish | 5 soy | 6 sulphites | 7 milk & dairy (incl. lactose) | 8 tree nuts | 9 mustard | 10 sesame | 11 molluscs",
    "m_marinara_desc": "San Marzano DOP tomatoes, fresh basil, oregano, garlic confit",
    "m_margerita_desc": "San Marzano DOP tomatoes, mozzarella fior di latte, oregano",
    "m_klasika_name": "Capricciosa Classica",
    "m_klasika_desc": "San Marzano DOP tomatoes, mozzarella fior di latte, cooked ham, fresh mushrooms, oregano",
    "m_bufalina_desc": "San Marzano DOP tomatoes, fresh basil, mozzarella di bufala DOP, Grana Padano DOP, cherry tomatoes",
    "m_regina_desc": "San Marzano DOP tomatoes, fresh basil, Parmigiano Reggiano, sun-dried tomatoes, stracciatella",
    "m_bresaola_desc": "San Marzano DOP tomatoes, mozzarella fior di latte, bresaola, baby spinach, Grana Padano DOP, cherry tomatoes, stracciatella, balsamic reduction",
    "m_krasotica_name": "Krasotica (Beauty)",
    "m_krasotica_desc": "San Marzano DOP tomatoes, mozzarella fior di latte, Grana Padano DOP, prosciutto, garlic confit, arugula",
    "m_peperoni_desc": "San Marzano DOP tomatoes, mozzarella fior di latte, spicy salami, red onion",
    "m_kalabria_desc": "San Marzano DOP tomatoes, mozzarella fior di latte, 'nduja, marinated artichokes, sun-dried tomatoes, arugula, Grana Padano DOP",
    "m_arrotolata_desc": "San Marzano DOP tomatoes, mozzarella fior di latte, rolled pancetta, baby spinach, smoked ricotta",
    "m_tuna_desc": "San Marzano DOP tomatoes, mozzarella fior di latte, tuna, red onion, Taggiasca olives",
    "m_ortolana_desc": "San Marzano DOP tomatoes, mozzarella fior di latte, zucchini, eggplant, mushrooms, arugula, Grana Padano DOP",
    "m_satarasa_name": "Satarasha",
    "m_satarasa_desc": "San Marzano DOP tomatoes, mozzarella fior di latte, peperonata, garlic confit, arugula, smoked ricotta",
    "m_tartufina_desc": "San Marzano DOP tomatoes, mozzarella fior di latte, mushrooms, truffle cream (tartufata), arugula, stracciatella, Grana Padano DOP",
    "m_vegana_name": "Vegana",
    "m_vegana_desc": "San Marzano DOP tomatoes, fresh basil, Sicilian caponata, sun-dried tomatoes, baby spinach, arugula, Taggiasca olives",
    "m_dodatek1_title": "Toppings I",
    "m_dodatek1_items": "Tomatoes, mushrooms, red onion, egg, fresh basil, corn",
    "m_dodatek2_title": "Toppings II",
    "m_dodatek3_title": "Toppings III",
    "m_panGarlicBread_name": "Garlic Bread with Parmesan",
    "m_narezek_name": "Charcuterie Platter (for 2)",
    "m_narezek_desc": "Prosciutto, rolled pancetta, mortadella, spicy salami, bresaola (cured beef), Taggiasca olives, Grana Padano DOP, rosemary focaccia",
    "m_salMesana_name": "Mixed Salad",
    "m_salTuna_name": "Tuna Salad",
    "m_salBuffalo_name": "Buffalo Salad",
    "m_salRoastbeef_name": "Roast Beef Salad",
  },
  "site": {
    "eventsTitle": "Programme",
    "eventsSub": "Upcoming events at Kodeljevo Castle.",
    "eventsEmpty": "No upcoming dates announced yet. Follow us on Instagram.",
    "eventsMore": "All events on Resident Advisor →",
    "eventsFree": "Free entry",
    "intro": "“Pizza bistro and dance bar at Kodeljevo Castle.”",
    "follow": "Follow us on Instagram for news and pop-ups.",
    "closing": "See you soon, Kader.",
    "menuCta": "Menu",
    "menuImageAlt": "Kader menu — pizzas, panuozzo, salads and a sharing board",
    "band1Alt": "The club vault at Kadeljevo Castle",
    "band2Alt": "Pizza in the wood-fired oven",
    "band3Alt": "The Kodeljevo estate",
    "dodatkiTitle": "Extra toppings",
    "seoTitle": "Kader Grad Kodeljevo — Tonda Romana Pizza & Club Ljubljana",
    "seoDesc": "Tonda Romana pizza with rustic dough, baked in a 375 °C wood-fired oven, and club culture inside the baroque Kodeljevo castle in Ljubljana. Menu, opening hours and venue.",
    "menuTitle": "Menu",
    "menuNote": "Pizzas, panuozzo sandwiches, salads and a sharing board for two. Pizzas are baked in our wood-fired oven; prices are in euros.",
    "hoursTitle": "Opening hours",
    "kitchen": "Kitchen: 12:00 – 22:00.",
    "venueTitle": "Venue",
    "venueP1": "The 17th-century Codelli baroque manor with its large garden, summer terrace and basement club is available for private events.",
    "venueP2": "Suitable for weddings, corporate events, private parties, exhibitions and concerts. We offer full in-house catering, professional sound and lighting, and space for up to 500 guests.",
    "venueP3": "For enquiries and viewings, write to our email address or give us a call.",
    "contactTitle": "Contact",
    "reserveNote": "Reservations and orders are taken by telephone."
  },
}

const de: Dict = {
  "header": {
    "langSelectAria": "Sprachauswahl",
    "langSelector": "Sprachauswahl",
    "logoAlt": "Kader Schloss Kodeljevo"
  },
  "home": {
    "monWed": "Montag – Mittwoch",
    "thu": "Donnerstag",
    "fri": "Freitag (Clubnacht)",
    "sat": "Samstag",
    "sun": "Sonntag",
  },
  "pizzeria": {
    "provenanceTitle": "Bekenntnis zur Echtheit & Zertifizierte Herkunft",
    "provenanceDesc": "Wir verwenden ausschließlich zertifizierte italienische Zutaten (D.O.P. und I.G.P.) und kaltgepresstes Bio-Olivenöl extra.",
    "regularFamily": "Normal/Familie",
    "colPizzaTitle": "PIZZEN",
    "colPanuozzoTitle": "PANUOZZO-SANDWICHES",
    "colNarezekTitle": "AUFSCHNITT (FÜR 2)",
    "colSaladsTitle": "SALATE",
    "priceListValidFrom": "Preisliste gültig ab 01.06.2026",
    "pricesVat": "Alle Preise in Euro (€) inklusive Mehrwertsteuer.",
    "allergenLegendTitle": "Allergen-Legende:",
    "allergenLegendText": "1 Gluten | 2 Krebstiere | 3 Eier | 4 Fisch | 5 Soja | 6 Sulfite | 7 Milch & Laktose | 8 Schalenfrüchte | 9 Senf | 10 Sesam | 11 Weichtiere",
    "m_marinara_desc": "San Marzano DOP Tomaten, frisches Basilikum, Oregano, Knoblauchconfit",
    "m_margerita_desc": "San Marzano DOP Tomaten, Mozzarella Fior di Latte, Oregano",
    "m_klasika_name": "Klassik",
    "m_klasika_desc": "San Marzano DOP Tomaten, Mozzarella Fior di Latte, Kochschinken, frische Champignons, Oregano",
    "m_bufalina_desc": "San Marzano DOP Tomaten, frisches Basilikum, Mozzarella di Bufala DOP, Grana Padano DOP, Kirschtomaten",
    "m_regina_desc": "San Marzano DOP Tomaten, frisches Basilikum, Parmigiano Reggiano, getrocknete Tomaten, Stracciatella",
    "m_bresaola_desc": "San Marzano DOP Tomaten, Mozzarella Fior di Latte, Bresaola, Babyspinat, Grana Padano DOP, Kirschtomaten, Stracciatella, Balsamico-Reduktion",
    "m_krasotica_name": "Krasotica",
    "m_krasotica_desc": "San Marzano DOP Tomaten, Mozzarella Fior di Latte, Grana Padano DOP, Prosciutto, Knoblauchconfit, Rucola",
    "m_peperoni_desc": "San Marzano DOP Tomaten, Mozzarella Fior di Latte, scharfe Salami, rote Zwiebeln",
    "m_kalabria_desc": "San Marzano DOP Tomaten, Mozzarella Fior di Latte, 'Nduja, marinierte Artischocken, getrocknete Tomaten, Rucola, Grana Padano DOP",
    "m_arrotolata_desc": "San Marzano DOP Tomaten, Mozzarella Fior di Latte, gerollte Pancetta, Babyspinat, geräucherter Ricotta",
    "m_tuna_desc": "San Marzano DOP Tomaten, Mozzarella Fior di Latte, Thunfisch, rote Zwiebeln, Taggiasca-Oliven",
    "m_ortolana_desc": "San Marzano DOP Tomaten, Mozzarella Fior di Latte, Zucchini, Auberginen, Champignons, Rucola, Grana Padano DOP",
    "m_satarasa_name": "Satarascha",
    "m_satarasa_desc": "San Marzano DOP Tomaten, Mozzarella Fior di Latte, Peperonata, Knoblauchconfit, Rucola, geräucherter Ricotta",
    "m_tartufina_desc": "San Marzano DOP Tomaten, Mozzarella Fior di Latte, Champignons, Trüffelcreme (Tartufata), Rucola, Stracciatella, Grana Padano DOP",
    "m_vegana_name": "Vegana",
    "m_vegana_desc": "San Marzano DOP Tomaten, frisches Basilikum, sizilianische Caponata, getrocknete Tomaten, Babyspinat, Rucola, Taggiasca-Oliven",
    "m_dodatek1_title": "Zutaten I",
    "m_dodatek1_items": "Tomaten, Champignons, rote Zwiebeln, Ei, frisches Basilikum, Mais",
    "m_dodatek2_title": "Zutaten II",
    "m_dodatek3_title": "Zutaten III",
    "m_panGarlicBread_name": "Knoblauchbrot mit Parmesan",
    "m_narezek_name": "Aufschnittplatte (für 2 Personen)",
    "m_narezek_desc": "Prosciutto, gerollte Pancetta, Mortadella, scharfe Salami, Bresaola (Rinderschinken), Taggiasca-Oliven, Grana Padano DOP, Rosmarin-Focaccia",
    "m_salMesana_name": "Gemischter Salat",
    "m_salTuna_name": "Thunfischsalat",
    "m_salBuffalo_name": "Büffelsalat",
    "m_salRoastbeef_name": "Roastbeef-Salat",
  },
  "site": {
    "eventsTitle": "Programm",
    "eventsSub": "Kommende Veranstaltungen im Schloss Kodeljevo.",
    "eventsEmpty": "Derzeit keine Termine angekündigt. Folge uns auf Instagram.",
    "eventsMore": "Alle Events auf Resident Advisor →",
    "eventsFree": "Eintritt frei",
    "intro": "“Pizza-Bistro und Tanzbar auf dem Schloss Kodeljevo.”",
    "follow": "Folge uns auf Instagram für Neuigkeiten und Pop-ups.",
    "closing": "Bis bald, Kader.",
    "menuCta": "Speisekarte",
    "menuImageAlt": "Kader Speisekarte — Pizzen, Panuozzo, Salate und Platte",
    "band1Alt": "Der Kellerclub im Schloss Kodeljevo",
    "band2Alt": "Pizza im Holzofen",
    "band3Alt": "Das Anwesen Kodeljevo",
    "dodatkiTitle": "Extras",
    "seoTitle": "Kader Grad Kodeljevo — Tonda-Romana-Pizza & Club Ljubljana",
    "seoDesc": "Tonda-Romana-Pizza mit rustikalem Teig aus dem 375-°C-Holzofen und Clubkultur im barocken Schloss Kodeljevo in Ljubljana. Speisekarte, Öffnungszeiten und Location.",
    "menuTitle": "Speisekarte",
    "menuNote": "Pizzen, Panuozzo-Sandwiches, Salate und ein Brett zum Teilen. Pizzen werden im Holzofen gebacken; Preise in Euro.",
    "hoursTitle": "Öffnungszeiten",
    "kitchen": "Küche: 12:00 – 22:00 Uhr.",
    "venueTitle": "Location",
    "venueP1": "Das barocke Schloss Codelli aus dem 17. Jahrhundert mit großem Garten, Sommerterrasse und Kellerclub steht für private Veranstaltungen zur Verfügung.",
    "venueP2": "Geeignet für Hochzeiten, Firmenveranstaltungen, private Feiern, Ausstellungen und Konzerte. Wir bieten komplettes Catering, professionelle Beschallung und Beleuchtung sowie Platz für bis zu 500 Gäste.",
    "venueP3": "Für Anfragen und Besichtigungen schreibe uns oder ruf uns an.",
    "contactTitle": "Kontakt",
    "reserveNote": "Reservierungen und Bestellungen nehmen wir telefonisch entgegen."
  },
}

const fr: Dict = {
  "header": {
    "langSelectAria": "Sélecteur de langue",
    "langSelector": "Sélecteur de langue",
    "logoAlt": "Kader Château Kodeljevo"
  },
  "home": {
    "monWed": "Lundi – Mercredi",
    "thu": "Jeudi",
    "fri": "Vendredi (Soirée Club)",
    "sat": "Samedi",
    "sun": "Dimanche",
  },
  "pizzeria": {
    "provenanceTitle": "Engagement d'Authenticité & Origine Certifiée",
    "provenanceDesc": "Nous sélectionnons rigoureusement des ingrédients italiens labellisés (D.O.P. et I.G.P.) et de l'huile d'olive vierge extra bio pressée à froid.",
    "regularFamily": "Normale/Familiale",
    "colPizzaTitle": "PIZZAS",
    "colPanuozzoTitle": "SANDWICHS PANUOZZO",
    "colNarezekTitle": "CHARCUTERIE (POUR 2)",
    "colSaladsTitle": "SALADES",
    "priceListValidFrom": "Tarifs valables à partir du 01/06/2026",
    "pricesVat": "Tous les prix sont en euros (€) et comprennent la TVA.",
    "allergenLegendTitle": "Guide des allergènes :",
    "allergenLegendText": "1 gluten | 2 crustacés | 3 œufs | 4 poissons | 5 soja | 6 sulfites | 7 lait & lactose | 8 fruits à coque | 9 moutarde | 10 sésame | 11 mollusques",
    "m_marinara_desc": "Tomates San Marzano AOP, basilic frais, origan, ail confit",
    "m_margerita_desc": "Tomates San Marzano AOP, mozzarella fior di latte, origan",
    "m_klasika_name": "Classique",
    "m_klasika_desc": "Tomates San Marzano AOP, mozzarella fior di latte, jambon cuit, champignons frais, origan",
    "m_bufalina_desc": "Tomates San Marzano AOP, basilic frais, mozzarella di bufala AOP, Grana Padano AOP, tomates cerises",
    "m_regina_desc": "Tomates San Marzano AOP, basilic frais, Parmigiano Reggiano, tomates séchées, stracciatella",
    "m_bresaola_desc": "Tomates San Marzano AOP, mozzarella fior di latte, bresaola, pousses d'épinard, Grana Padano AOP, tomates cerises, stracciatella, réduction de balsamique",
    "m_krasotica_name": "Krasotica",
    "m_krasotica_desc": "Tomates San Marzano AOP, mozzarella fior di latte, Grana Padano AOP, prosciutto, ail confit, roquette",
    "m_peperoni_desc": "Tomates San Marzano AOP, mozzarella fior di latte, saucisson piquant, oignon rouge",
    "m_kalabria_desc": "Tomates San Marzano AOP, mozzarella fior di latte, 'nduja, cœurs d'artichaut marinés, tomates séchées, roquette, Grana Padano AOP",
    "m_arrotolata_desc": "Tomates San Marzano AOP, mozzarella fior di latte, pancetta roulée, jeunes épinards, ricotta fumée",
    "m_tuna_desc": "Tomates San Marzano AOP, mozzarella fior di latte, thon, oignon rouge, olives taggiasche",
    "m_ortolana_desc": "Tomates San Marzano AOP, mozzarella fior di latte, courgettes, aubergines, champignons, roquette, Grana Padano AOP",
    "m_satarasa_name": "Satarascha",
    "m_satarasa_desc": "Tomates San Marzano AOP, mozzarella fior di latte, peperonata, ail confit, roquette, ricotta fumée",
    "m_tartufina_desc": "Tomates San Marzano AOP, mozzarella fior di latte, champignons, crème de truffe (tartufata), roquette, stracciatella, Grana Padano AOP",
    "m_vegana_name": "Vegana",
    "m_vegana_desc": "Tomates San Marzano AOP, basilic frais, caponata sicilienne, tomates séchées, jeunes pousses d'épinard, roquette, olives taggiasche",
    "m_dodatek1_title": "Supplément I",
    "m_dodatek1_items": "Tomates, champignons, oignon rouge, œuf, basilic frais, maïs",
    "m_dodatek2_title": "Supplément II",
    "m_dodatek3_title": "Supplément III",
    "m_panGarlicBread_name": "Pain à l'ail et parmesan",
    "m_narezek_name": "Planche de Charcuterie (pour 2 personnes)",
    "m_narezek_desc": "Prosciutto, pancetta roulée, mortadelle, saucisson piquant, bresaola (bœuf séché), olives taggiasche, Grana Padano AOP, focaccia au romarin",
    "m_salMesana_name": "Salade Mixte",
    "m_salTuna_name": "Salade au Thon",
    "m_salBuffalo_name": "Salade Bufflonne",
    "m_salRoastbeef_name": "Salade au Rosbif",
  },
  "site": {
    "eventsTitle": "Programme",
    "eventsSub": "Prochains événements au château de Kodeljevo.",
    "eventsEmpty": "Aucune date annoncée pour le moment. Suis-nous sur Instagram.",
    "eventsMore": "Tous les événements sur Resident Advisor →",
    "eventsFree": "Entrée libre",
    "intro": "“Pizza, bistro et bar dansant au château de Kodeljevo.”",
    "follow": "Suis-nous sur Instagram pour les nouveautés et les événements éphémères.",
    "closing": "À bientôt, Kader.",
    "menuCta": "Menu",
    "menuImageAlt": "Carte Kader — pizzas, panuozzo, salades et planche",
    "band1Alt": "Le club en sous-sol du château de Kodeljevo",
    "band2Alt": "Pizza au four à bois",
    "band3Alt": "Le domaine de Kodeljevo",
    "dodatkiTitle": "Suppléments",
    "seoTitle": "Kader Grad Kodeljevo — Pizza Tonda Romana & Club Ljubljana",
    "seoDesc": "Pizza Tonda Romana à pâte rustique, cuite au four à bois de 375 °C, et culture club dans le château baroque de Kodeljevo à Ljubljana. Menu, horaires et lieu.",
    "menuTitle": "Menu",
    "menuNote": "Pizzas, panuozzo, salades et une planche à partager. Les pizzas sont cuites au four à bois ; prix en euros.",
    "hoursTitle": "Horaires d'ouverture",
    "kitchen": "Cuisine : 12:00 – 22:00.",
    "venueTitle": "Lieu",
    "venueP1": "Le manoir baroque de Codelli du XVIIe siècle, avec son grand jardin, sa terrasse d'été et son club en sous-sol, est disponible pour des événements privés.",
    "venueP2": "Convient aux mariages, événements d'entreprise, fêtes privées, expositions et concerts. Nous proposons un service traiteur complet, une sonorisation et un éclairage professionnels, ainsi qu'une capacité de 500 personnes.",
    "venueP3": "Pour toute demande ou visite, écris-nous ou appelle-nous.",
    "contactTitle": "Contact",
    "reserveNote": "Les réservations et commandes se font par téléphone."
  },
}

const it: Dict = {
  "header": {
    "langSelectAria": "Selettore lingua",
    "langSelector": "Selettore lingua",
    "logoAlt": "Kader Castello Kodeljevo"
  },
  "home": {
    "monWed": "Lunedì – Mercoledì",
    "thu": "Giovedì",
    "fri": "Venerdì (Serata Club)",
    "sat": "Sabato",
    "sun": "Domenica",
  },
  "pizzeria": {
    "provenanceTitle": "Autenticità & Origine Protetta",
    "provenanceDesc": "Scegliamo esclusivamente ingredienti italiani con certificazione D.O.P. e I.G.P. e olio extravergine d'oliva biologico spremuto a freddo.",
    "regularFamily": "Normale/Famiglia",
    "colPizzaTitle": "PIZZE",
    "colPanuozzoTitle": "PANUOZZI",
    "colNarezekTitle": "TAGLIERE (PER 2)",
    "colSaladsTitle": "INSALATE",
    "priceListValidFrom": "Listino prezzi valido dal 01/06/2026",
    "pricesVat": "Tutti i prezzi sono espressi in Euro (€) e sono comprensivi di IVA.",
    "allergenLegendTitle": "Legenda allergeni:",
    "allergenLegendText": "1 glutine | 2 crostacei | 3 uova | 4 pesce | 5 soia | 6 solfiti | 7 latte e lattosio | 8 frutta a guscio | 9 senape | 10 sesamo | 11 molluschi",
    "m_marinara_desc": "Pomodori San Marzano DOP, basilico fresco, origano, aglio confit",
    "m_margerita_desc": "Pomodori San Marzano DOP, mozzarella fior di latte, origano",
    "m_klasika_name": "Classica",
    "m_klasika_desc": "Pomodori San Marzano DOP, mozzarella fior di latte, prosciutto cotto, funghi freschi, origano",
    "m_bufalina_desc": "Pomodori San Marzano DOP, basilico fresco, mozzarella di bufala DOP, Grana Padano DOP, pomodorini ciliegino",
    "m_regina_desc": "Pomodori San Marzano DOP, basilico fresco, Parmigiano Reggiano, pomodori secchi, stracciatella",
    "m_bresaola_desc": "Pomodori San Marzano DOP, mozzarella fior di latte, bresaola, spinacino novello, Grana Padano DOP, pomodorini, stracciatella, glassa di balsamico",
    "m_krasotica_name": "Krasotica",
    "m_krasotica_desc": "Pomodori San Marzano DOP, mozzarella fior di latte, Grana Padano DOP, prosciutto crudo, aglio confit, rucola",
    "m_peperoni_desc": "Pomodori San Marzano DOP, mozzarella fior di latte, salame piccante, cipolla rossa",
    "m_kalabria_desc": "Pomodori San Marzano DOP, mozzarella fior di latte, 'nduja, carciofi marinati, pomodori secchi, rucola, Grana Padano DOP",
    "m_arrotolata_desc": "Pomodori San Marzano DOP, mozzarella fior di latte, pancetta arrotolata, spinacino fresco, ricotta affumicata",
    "m_tuna_desc": "Pomodori San Marzano DOP, mozzarella fior di latte, tonno, cipolla rossa, olive taggiasche",
    "m_ortolana_desc": "Pomodori San Marzano DOP, mozzarella fior di latte, zucchine, melanzane, funghi, rucola, Grana Padano DOP",
    "m_satarasa_name": "Sataraša",
    "m_satarasa_desc": "Pomodori San Marzano DOP, mozzarella fior di latte, peperonata, aglio confit, rucola, ricotta affumicata",
    "m_tartufina_desc": "Pomodori San Marzano DOP, mozzarella fior di latte, funghi champignon, tartufata, rucola, stracciatella, Grana Padano DOP",
    "m_vegana_name": "Vegana",
    "m_vegana_desc": "Pomodori San Marzano DOP, basilico fresco, caponata siciliana, pomodori secchi, spinacino fresco, rucola, olive taggiasche",
    "m_dodatek1_title": "Aggiunta I",
    "m_dodatek1_items": "Pomodoro, funghi, cipolla rossa, uovo, basilico fresco, mais",
    "m_dodatek2_title": "Aggiunta II",
    "m_dodatek3_title": "Aggiunta III",
    "m_panGarlicBread_name": "Pane all'aglio e parmigiano",
    "m_narezek_name": "Tagliere di Salumi (per 2 persone)",
    "m_narezek_desc": "Prosciutto crudo, pancetta arrotolata, mortadella, salame piccante, bresaola, olive taggiasche, Grana Padano DOP, focaccia al rosmarino",
    "m_salMesana_name": "Insalata Mista",
    "m_salTuna_name": "Insalata di Tonno",
    "m_salBuffalo_name": "Insalata Bufalina",
    "m_salRoastbeef_name": "Insalata con Roast Beef",
  },
  "site": {
    "eventsTitle": "Programma",
    "eventsSub": "Prossimi eventi al castello di Kodeljevo.",
    "eventsEmpty": "Nessuna data annunciata al momento. Seguici su Instagram.",
    "eventsMore": "Tutti gli eventi su Resident Advisor →",
    "eventsFree": "Ingresso libero",
    "intro": "“Pizza, bistrot e bar dance al castello di Kodeljevo.”",
    "follow": "Seguici su Instagram per novità e aperture speciali.",
    "closing": "A presto, Kader.",
    "menuCta": "Menu",
    "menuImageAlt": "Menu Kader — pizze, panuozzo, insalate e tagliera",
    "band1Alt": "Il club nel seminterrato del castello di Kodeljevo",
    "band2Alt": "Pizza nel forno a legna",
    "band3Alt": "La tenuta di Kodeljevo",
    "dodatkiTitle": "Extra",
    "seoTitle": "Kader Grad Kodeljevo — Pizza Tonda Romana & Club Lubiana",
    "seoDesc": "Pizza Tonda Romana con impasto rustico, cotta nel forno a legna a 375 °C, e cultura club nel castello barocco di Kodeljevo a Lubiana. Menu, orari e spazio.",
    "menuTitle": "Menu",
    "menuNote": "Pizze, panuozzo, insalate e una tagliera da dividere. Le pizze sono cotte nel forno a legna; prezzi in euro.",
    "hoursTitle": "Orari",
    "kitchen": "Cucina: 12:00 – 22:00.",
    "venueTitle": "Spazio",
    "venueP1": "La villa barocca Codelli del XVII secolo, con il suo ampio giardino, la terrazza estiva e il club nel seminterrato, è disponibile per eventi privati.",
    "venueP2": "Adatta a matrimoni, eventi aziendali, feste private, mostre e concerti. Offriamo catering interno, impianto audio e luci professionali, fino a 500 ospiti.",
    "venueP3": "Per richieste e visite, scrivici o chiamaci.",
    "contactTitle": "Contatti",
    "reserveNote": "Prenotazioni e ordini si effettuano via telefono."
  },
}

const sr: Dict = {
  "header": {
    "langSelectAria": "Izbor jezika",
    "langSelector": "Izbor jezika",
    "logoAlt": "Kader Dvorac Kodeljevo"
  },
  "home": {
    "monWed": "Ponedeljak – Sreda",
    "thu": "Četvrtak",
    "fri": "Petak (Klupska noć)",
    "sat": "Subota",
    "sun": "Nedelja",
  },
  "pizzeria": {
    "provenanceTitle": "Posvećenost Kvalitetu & Sertifikovano Poreklo",
    "provenanceDesc": "Koristimo isključivo sertifikovane italijanske namirnice (D.O.P. i I.G.P.) i hladno ceđeno ekstra devičansko maslinovo ulje.",
    "regularFamily": "Standardna/Porodična",
    "colPizzaTitle": "PICE",
    "colPanuozzoTitle": "PANUOZZO SENDVIČI",
    "colNarezekTitle": "MEZE (ZA 2 OSOBE)",
    "colSaladsTitle": "SALATE",
    "priceListValidFrom": "Cenovnik važi od 01.06.2026.",
    "pricesVat": "Sve cene su u evrima (€) i uključuju PDV.",
    "allergenLegendTitle": "Legenda alergena:",
    "allergenLegendText": "1 gluten | 2 ljuskari | 3 jaja | 4 riba | 5 soja | 6 sulfiti | 7 mleko i laktoza | 8 orašasti plodovi | 9 senf | 10 susam | 11 mekušci",
    "m_marinara_desc": "San Marzano DOP pelat, svež bosiljak, origano, konfitirani beli luk",
    "m_margerita_desc": "San Marzano DOP pelat, mocarela fior di latte, origano",
    "m_klasika_name": "Klasika",
    "m_klasika_desc": "San Marzano DOP pelat, mocarela fior di latte, kuvana šunka, sveži šampinjoni, origano",
    "m_bufalina_desc": "San Marzano DOP pelat, svež bosiljak, bivolja mocarela DOP, Grana Padano DOP, čeri paradajz",
    "m_regina_desc": "San Marzano DOP pelat, svež bosiljak, Parmigiano Reggiano, sušeni paradajz, stračatela",
    "m_bresaola_desc": "San Marzano DOP pelat, mocarela fior di latte, bresaola, mladi spanać, Grana Padano DOP, čeri paradajz, stračatela, redukovani balzamiko",
    "m_krasotica_name": "Krasotica",
    "m_krasotica_desc": "San Marzano DOP pelat, mocarela fior di latte, Grana Padano DOP, pršuta, konfitirani beli luk, rukola",
    "m_peperoni_desc": "San Marzano DOP pelat, mocarela fior di latte, pikantna salama, crveni luk",
    "m_kalabria_desc": "San Marzano DOP pelat, mocarela fior di latte, 'nduja, marinirane artičoke, sušeni paradajz, rukola, Grana Padano DOP",
    "m_arrotolata_desc": "San Marzano DOP pelat, mocarela fior di latte, rolovana pančeta, mladi spanać, dimljena rikota",
    "m_tuna_desc": "San Marzano DOP pelat, mocarela fior di latte, tuna, crveni luk, taggiasca masline",
    "m_ortolana_desc": "San Marzano DOP pelat, mocarela fior di latte, tikvice, patlidžan, šampinjoni, rukola, Grana Padano DOP",
    "m_satarasa_name": "Sataraša",
    "m_satarasa_desc": "San Marzano DOP pelat, mocarela fior di latte, đuveč od paprika (peperonata), konfitirani beli luk, rukola, dimljena rikota",
    "m_tartufina_desc": "San Marzano DOP pelat, mocarela fior di latte, šampinjoni, tartufata, rukola, stračatela, Grana Padano DOP",
    "m_vegana_name": "Vegana",
    "m_vegana_desc": "San Marzano DOP pelat, svež bosiljak, sicilijanska kaponata, sušeni paradajz, mladi spanać, rukola, taggiasca masline",
    "m_dodatek1_title": "Dodatak I",
    "m_dodatek1_items": "Pelat, šampinjoni, crveni luk, jaje, svež bosiljak, kukuruz",
    "m_dodatek2_title": "Dodatek II",
    "m_dodatek3_title": "Dodatek III",
    "m_panGarlicBread_name": "Beli luk hleb sa parmezanom",
    "m_narezek_name": "Meze / Daska narezaka (za 2 osobe)",
    "m_narezek_desc": "Pršuta, rolovana pančeta, mortadela, pikantna salama, bresaola (goveđa pršuta), taggiasca masline, Grana Padano DOP, fokača sa ruzmarinom",
    "m_salMesana_name": "Mešana Salata",
    "m_salTuna_name": "Tuna Salata",
    "m_salBuffalo_name": "Bivolja Salata",
    "m_salRoastbeef_name": "Salata sa Rostbifom",
  },
  "site": {
    "eventsTitle": "Program",
    "eventsSub": "N sledeći događaji u dvorcu Kodeljevo.",
    "eventsEmpty": "Trenutno nema najavljenih termina. Prati nas na Instagramu.",
    "eventsMore": "Svi događaji na Resident Advisor →",
    "eventsFree": "Besplatan ulaz",
    "intro": "“Pizza bistro i plesni bar na dvorcu Kodeljevo.”",
    "follow": "Prati nas na Instagramu za novosti i posebna otvaranja.",
    "closing": "Vidimo se uskoro, Kader.",
    "menuCta": "Meni",
    "menuImageAlt": "Meni Kader — pice, panuozzo, salate i zajednička ploča",
    "band1Alt": "Klupski podrum u dvorcu Kodeljevo",
    "band2Alt": "Pica u peći na drva",
    "band3Alt": "Imanje Kodeljevo",
    "dodatkiTitle": "Dodaci",
    "seoTitle": "Kader Grad Kodeljevo — Pica Tonda Romana & klub Ljubljana",
    "seoDesc": "Pica Tonda Romana sa rustičnim testom, pečena u peći na drva na 375 °C, i klubska kultura u baroknom dvorcu Kodeljevo u Ljubljani. Meni, radno vreme i prostor.",
    "menuTitle": "Meni",
    "menuNote": "Pice, sendviči panuozzo, salate i zajednička ploča za dvoje. Pice se peku u peći na drva; cene u evrima.",
    "hoursTitle": "Radno vreme",
    "kitchen": "Kuhinja: 12:00 – 22:00.",
    "venueTitle": "Prostor",
    "venueP1": "Barokni dvorac Codelli iz 17. veka sa velikim vrtom, letnjom terasom i klupskim podrumom dostupan je za privatne događaje.",
    "venueP2": "Pogodno za svadbe, poslovne događaje, žurke, izložbe i koncerte. Nudimo kompletan katering, profesionalno ozvučenje i rasvetu, do 500 gostiju.",
    "venueP3": "Za upite i obilazak, pišite nam ili nas pozovite.",
    "contactTitle": "Kontakt",
    "reserveNote": "Rezervacije i porudžbine primamo telefonom."
  },
}

const nl: Dict = {
  "header": {
    "langSelectAria": "Taalkeuze",
    "langSelector": "Taalkeuze",
    "logoAlt": "Kader Kasteel Kodeljevo"
  },
  "home": {
    "monWed": "Maandag – Woensdag",
    "thu": "Donderdag",
    "fri": "Vrijdag (Clubnacht)",
    "sat": "Zaterdag",
    "sun": "Zondag",
  },
  "pizzeria": {
    "provenanceTitle": "Authenticiteit & Gecertificeerde Oorsprong",
    "provenanceDesc": "Wij gebruiken uitsluitend gecertificeerde Italiaanse ingrediënten (D.O.P. en I.G.P.) en koudgeperste biologische olijfolie.",
    "regularFamily": "Normaal/Familie",
    "colPizzaTitle": "PIZZA'S",
    "colPanuozzoTitle": "PANUOZZO SANDWICHES",
    "colNarezekTitle": "BORRELPLANK (VOOR 2)",
    "colSaladsTitle": "SALADES",
    "priceListValidFrom": "Prijslijst geldig vanaf 01-06-2026",
    "pricesVat": "Alle prijzen zijn in Euro (€) en inclusief btw.",
    "allergenLegendTitle": "Allergenenlegenda:",
    "allergenLegendText": "1 gluten | 2 schaaldieren | 3 eieren | 4 vis | 5 soja | 6 sulfieten | 7 melk & lactose | 8 noten | 9 mosterd | 10 sesam | 11 weekdieren",
    "m_marinara_desc": "San Marzano DOP tomaten, verse basilicum, oregano, knoflookconfit",
    "m_margerita_desc": "San Marzano DOP tomaten, mozzarella fior di latte, oregano",
    "m_klasika_name": "Klassiek",
    "m_klasika_desc": "San Marzano DOP tomaten, mozzarella fior di latte, gekookte ham, verse champignons, oregano",
    "m_bufalina_desc": "San Marzano DOP tomaten, verse basilicum, mozzarella di bufala DOP, Grana Padano DOP, kerstomaten",
    "m_regina_desc": "San Marzano DOP tomaten, verse basilicum, Parmigiano Reggiano, zongedroogde tomaten, stracciatella",
    "m_bresaola_desc": "San Marzano DOP tomaten, mozzarella fior di latte, bresaola, babyspinazie, Grana Padano DOP, kerstomaten, stracciatella, balsamico-reductie",
    "m_krasotica_name": "Krasotica",
    "m_krasotica_desc": "San Marzano DOP tomaten, mozzarella fior di latte, Grana Padano DOP, prosciutto, knoflookconfit, rucola",
    "m_peperoni_desc": "San Marzano DOP tomaten, mozzarella fior di latte, pikante salami, rode ui",
    "m_kalabria_desc": "San Marzano DOP tomaten, mozzarella fior di latte, 'nduja, gemarineerde artisjokken, zongedroogde tomaten, rucola, Grana Padano DOP",
    "m_arrotolata_desc": "San Marzano DOP tomaten, mozzarella fior di latte, gerolde pancetta, babyspinazie, gerookte ricotta",
    "m_tuna_desc": "San Marzano DOP tomaten, mozzarella fior di latte, tonijn, rode ui, Taggiasche olijven",
    "m_ortolana_desc": "San Marzano DOP tomaten, mozzarella fior di latte, courgette, aubergine, champignons, rucola, Grana Padano DOP",
    "m_satarasa_name": "Satarasja",
    "m_satarasa_desc": "San Marzano DOP tomaten, mozzarella fior di latte, peperonata, knoflookconfit, rucola, gerookte ricotta",
    "m_tartufina_desc": "San Marzano DOP tomaten, mozzarella fior di latte, champignons, truffelcrème (tartufata), rucola, stracciatella, Grana Padano DOP",
    "m_vegana_name": "Vegana",
    "m_vegana_desc": "San Marzano DOP tomaten, verse basilicum, Siciliaanse caponata, zongedroogde tomaten, babyspinazie, rucola, Taggiasche olijven",
    "m_dodatek1_title": "Extra toppings I",
    "m_dodatek1_items": "Tomaten, champignons, rode ui, ei, verse basilicum, maïs",
    "m_dodatek2_title": "Extra toppings II",
    "m_dodatek3_title": "Extra toppings III",
    "m_panGarlicBread_name": "Knoflookbrood met parmezaan",
    "m_narezek_name": "Borrelplank (voor 2 personen)",
    "m_narezek_desc": "Prosciutto, gerolde pancetta, mortadella, pikante salami, bresaola, Taggiasche olijven, Grana Padano DOP, rozemarijn focaccia",
    "m_salMesana_name": "Gemengde Salade",
    "m_salTuna_name": "Tonijnsalade",
    "m_salBuffalo_name": "Buffelsalade",
    "m_salRoastbeef_name": "Rosbiefsalade",
  },
  "site": {
    "eventsTitle": "Programma",
    "eventsSub": "Aankomende evenementen in Kasteel Kodeljevo.",
    "eventsEmpty": "Nog geen data aangekondigd. Volg ons op Instagram.",
    "eventsMore": "Alle evenementen op Resident Advisor →",
    "eventsFree": "Gratis entree",
    "intro": "“Pizzabistro en dansbar op Kasteel Kodeljevo.”",
    "follow": "Volg ons op Instagram voor nieuws en speciale avonden.",
    "closing": "Tot snel, Kader.",
    "menuCta": "Menu",
    "menuImageAlt": "Kader menu — pizza’s, panuozzo, salades en plank",
    "band1Alt": "De kelderclub in Kasteel Kodeljevo",
    "band2Alt": "Pizza in de houtoven",
    "band3Alt": "Landgoed Kodeljevo",
    "dodatkiTitle": "Extra’s",
    "seoTitle": "Kader Grad Kodeljevo — Tonda Romana-pizza & club Ljubljana",
    "seoDesc": "Tonda Romana-pizza met rustiek deeg, gebakken in een houtoven van 375 °C, en clubcultuur in het barokke kasteel Kodeljevo in Ljubljana. Menu, openingstijden en locatie.",
    "menuTitle": "Menu",
    "menuNote": "Pizza's, panuozzo's, salades en een plank om te delen. Pizza's worden in de houtoven gebakken; prijzen in euro.",
    "hoursTitle": "Openingstijden",
    "kitchen": "Keuken: 12:00 – 22:00.",
    "venueTitle": "Locatie",
    "venueP1": "Het barokke landgoed Codelli uit de 17e eeuw met grote tuin, zomerterras en kelderclub is beschikbaar voor privé-evenementen.",
    "venueP2": "Geschikt voor bruiloften, zakelijke evenementen, privéfeesten, tentoonstellingen en concerten. Wij verzorgen volledige catering, professioneel geluid en belichting, voor maximaal 500 gasten.",
    "venueP3": "Voor vragen en een rondleiding: schrijf ons of bel ons.",
    "contactTitle": "Contact",
    "reserveNote": "Reserveringen en bestellingen gaan telefonisch."
  },
}

const pl: Dict = {
  "header": {
    "langSelectAria": "Wybór języka",
    "langSelector": "Wybór języka",
    "logoAlt": "Kader Zamek Kodeljevo"
  },
  "home": {
    "monWed": "Poniedziałek – Środa",
    "thu": "Czwartek",
    "fri": "Piątek (Noc klubowa)",
    "sat": "Sobota",
    "sun": "Niedziela",
  },
  "pizzeria": {
    "provenanceTitle": "Zaangażowanie w Autentyczność i Certyfikowane Pochodzenie",
    "provenanceDesc": "Stosujemy wyłącznie certyfikowane włoskie składniki (D.O.P. i I.G.P.) pochodzące od sprawdzonych producentów z Kampanii i Emilii-Romanii.",
    "regularFamily": "Standard / Duża",
    "colPizzaTitle": "PIZZE",
    "colPanuozzoTitle": "KANAPKI PANUOZZO",
    "colNarezekTitle": "DESKA WĘDLIN (DLA 2 OSÓB)",
    "colSaladsTitle": "SAŁATKI",
    "priceListValidFrom": "Cennik obowiązuje od 1 czerwca 2026",
    "pricesVat": "Wszystkie ceny podane są w euro (€) i zawierają podatek VAT.",
    "allergenLegendTitle": "Wykaz alergenów:",
    "allergenLegendText": "1 gluten | 2 skorupiaki | 3 jaja | 4 ryby | 5 soja | 6 mleko | 7 orzechy | 8 seler | 9 gorczyca | 10 sezam | 11 dwutlenek siarki | 12 łubin | 13 mięczaki",
    "m_marinara_desc": "Pomidory San Marzano DOP, świeża bazylia, oregano, czosnek confit, oliwa z oliwek extra virgin",
    "m_margerita_desc": "Pomidory San Marzano DOP, mozzarella fior di latte, oregano, oliwa extra virgin",
    "m_klasika_name": "Capricciosa Klasyczna",
    "m_klasika_desc": "Pomidory San Marzano DOP, mozzarella fior di latte, gotowana szynka praska, pieczarki, karczochy, oliwki",
    "m_bufalina_desc": "Pomidory San Marzano DOP, świeża bazylia, mozzarella di bufala campana DOP, oliwa extra virgin",
    "m_regina_desc": "Pomidory San Marzano DOP, świeża bazylia, Parmigiano Reggiano 24m, oliwa extra virgin, świeża burrata",
    "m_bresaola_desc": "Pomidory San Marzano DOP, mozzarella fior di latte, bresaola z Valtelliny, rukola, płatki Grana Padano DOP",
    "m_krasotica_name": "Krasotica (Piękność)",
    "m_krasotica_desc": "Pomidory San Marzano DOP, mozzarella fior di latte, Grana Padano DOP, pikantne salami spianata calabra, świeża bazylia",
    "m_peperoni_desc": "Pomidory San Marzano DOP, mozzarella fior di latte, pikantne salami pepperoni, papryczki jalapeño",
    "m_kalabria_desc": "Pomidory San Marzano DOP, mozzarella fior di latte, kalabryjska 'nduja, wędzona ricotta, czerwona cebula",
    "m_arrotolata_desc": "Pomidory San Marzano DOP, mozzarella fior di latte, zawijana pancetta arrotolata, pieczarki, rozmaryn",
    "m_tuna_desc": "Pomidory San Marzano DOP, mozzarella fior di latte, tuńczyk w oliwie, czerwona cebula, kapary, oliwki",
    "m_ortolana_desc": "Pomidory San Marzano DOP, mozzarella fior di latte, grillowana cukinia, bakłażan, pieczona papryka, oregano",
    "m_satarasa_name": "Szatarasza",
    "m_satarasa_desc": "Pomidory San Marzano DOP, mozzarella fior di latte, domowy gulasz warzywny szatarasz, kiełbaski, świeża bazylia",
    "m_tartufina_desc": "Pomidory San Marzano DOP, mozzarella fior di latte, pasta truflowa, grzyby leśne, oliwa truflowa",
    "m_vegana_name": "Wegańska",
    "m_vegana_desc": "Pomidory San Marzano DOP, świeża bazylia, sycylijska caponata warzywna, karczochy, prażone orzeszki piniowe",
    "m_dodatek1_title": "Dodatki I",
    "m_dodatek1_items": "Pomidory, pieczarki, czerwona cebula, jajko, świeża bazylia, kukurydza",
    "m_dodatek2_title": "Dodatki II",
    "m_dodatek3_title": "Dodatki III",
    "m_panGarlicBread_name": "Pieczywo Czosnkowe z Parmezanem",
    "m_narezek_name": "Deska Wędlin i Serów (dla 2 osób)",
    "m_narezek_desc": "Szynka parmeńska, pancetta, mortadela, pikantne salami, bresaola, oliwki, sery włoskie, ciepły chlebek",
    "m_salMesana_name": "Sałatka Mieszana",
    "m_salTuna_name": "Sałatka z Tuńczykiem",
    "m_salBuffalo_name": "Sałatka z Mozzarellą di Bufala",
    "m_salRoastbeef_name": "Sałatka z Rostbefem",
  },
  "site": {
    "eventsTitle": "Program",
    "eventsSub": "Najbliższe wydarzenia w Zamku Kodeljevo.",
    "eventsEmpty": "Na razie nie ogłoszono żadnych terminów. Śledź nas na Instagramie.",
    "eventsMore": "Wszystkie wydarzenia na Resident Advisor →",
    "eventsFree": "Wstęp wolny",
    "intro": "“Pizza, bistro i bar taneczny na Zamku Kodeljevo.”",
    "follow": "Śledź nas na Instagramie, aby znać nowości i pop-up'y.",
    "closing": "Do zobaczenia, Kader.",
    "menuCta": "Menu",
    "menuImageAlt": "Menu Kader — pizze, panuozzo, sałatki i deska",
    "band1Alt": "Klub w piwnicy Zamku Kodeljevo",
    "band2Alt": "Pizza w piecu na drewno",
    "band3Alt": "Zamek Kodeljevo",
    "dodatkiTitle": "Dodatki",
    "seoTitle": "Kader Grad Kodeljevo — pizza Tonda Romana & klub Ljubljana",
    "seoDesc": "Pizza Tonda Romana na rustycznym cieście, pieczona w piecu na drewno o temperaturze 375 °C, i kultura klubu w barokowym zamku Kodeljevo w Lublanie. Menu, godziny otwarcia i przestrzeń.",
    "menuTitle": "Menu",
    "menuNote": "Pizze, panuozzo, sałatki i deska do dzielenia. Pizze pieczemy w piecu na drewno; ceny w euro.",
    "hoursTitle": "Godziny otwarcia",
    "kitchen": "Kuchnia: 12:00 – 22:00.",
    "venueTitle": "Przestrzeń",
    "venueP1": "Barokowy dwór Codelli z XVII wieku z dużym ogrodem, letnim tarasem i klubem w piwnicy jest dostępny na wydarzenia prywatne.",
    "venueP2": "Odpowiedni na wesela, wydarzenia firmowe, przyjęcia prywatne, wystawy i koncerty. Oferujemy pełne catering, profesjonalne nagłośnienie i oświetlenie, do 500 gości.",
    "venueP3": "W sprawie zapytań i oględzin napisz do nas lub zadzwoń.",
    "contactTitle": "Kontakt",
    "reserveNote": "Rezerwacje i zamówienia przyjmujemy telefonicznie."
  },
}

const cs: Dict = {
  "header": {
    "langSelectAria": "Výběr jazyka",
    "langSelector": "Výběr jazyka",
    "logoAlt": "Kader Hrad Kodeljevo"
  },
  "home": {
    "monWed": "Pondělí – Středa",
    "thu": "Čtvrtek",
    "fri": "Pátek (Klubová noc)",
    "sat": "Sobota",
    "sun": "Neděle",
  },
  "pizzeria": {
    "provenanceTitle": "Závazek k Autentičnosti a Certifikovanému Původu",
    "provenanceDesc": "Používáme výhradně certifikované italské suroviny (D.O.P. a I.G.P.) od prověřených rodinných výrobců z Kampánie a Emilie-Romagny.",
    "regularFamily": "Běžná / Rodinná",
    "colPizzaTitle": "PIZZY",
    "colPanuozzoTitle": "SENDVIČE PANUOZZO",
    "colNarezekTitle": "UZENINOVÉ PRKÉNKO (PRO 2)",
    "colSaladsTitle": "SALÁTY",
    "priceListValidFrom": "Ceník platný od 1. června 2026",
    "pricesVat": "Všechny ceny jsou uvedeny v eurech (€) a zahrnují DPH.",
    "allergenLegendTitle": "Přehled alergenů:",
    "allergenLegendText": "1 lepek | 2 korýši | 3 vejce | 4 ryby | 5 sója | 6 mléko | 7 skořápkové plody | 8 celer | 9 hořčice | 10 sezam | 11 oxid siřičitý | 12 vlčí bob | 13 měkkýši",
    "m_marinara_desc": "Rajčata San Marzano DOP, čerstvá bazalka, oregano, česnekový confit, extra panenský olivový olej",
    "m_margerita_desc": "Rajčata San Marzano DOP, mozzarella fior di latte, oregano, extra panenský olivový olej",
    "m_klasika_name": "Klasická Capricciosa",
    "m_klasika_desc": "Rajčata San Marzano DOP, mozzarella fior di latte, dušená pražská šunka, žampiony, artyčoky, olivy",
    "m_bufalina_desc": "Rajčata San Marzano DOP, čerstvá bazalka, mozzarella di bufala campana DOP, extra panenský olivový olej",
    "m_regina_desc": "Rajčata San Marzano DOP, čerstvá bazalka, Parmigiano Reggiano 24m, extra panenský olivový olej, čerstvá burrata",
    "m_bresaola_desc": "Rajčata San Marzano DOP, mozzarella fior di latte, bresaola z Valtelliny, rukola, hobliny Grana Padano DOP",
    "m_krasotica_name": "Krasotica (Krasavice)",
    "m_krasotica_desc": "Rajčata San Marzano DOP, mozzarella fior di latte, Grana Padano DOP, pikantní salám spianata calabra, čerstvá bazalka",
    "m_peperoni_desc": "Rajčata San Marzano DOP, mozzarella fior di latte, pikantní salám pepperoni, feferonky jalapeño",
    "m_kalabria_desc": "Rajčata San Marzano DOP, mozzarella fior di latte, kalábrijská 'nduja, uzená ricotta, červená cibule",
    "m_arrotolata_desc": "Rajčata San Marzano DOP, mozzarella fior di latte, rolovaná pancetta arrotolata, žampiony, rozmarýn",
    "m_tuna_desc": "Rajčata San Marzano DOP, mozzarella fior di latte, tuňák v olivovém oleji, červená cibule, kapary, olivy",
    "m_ortolana_desc": "Rajčata San Marzano DOP, mozzarella fior di latte, grilovaná cuketa, lilek, pečená paprika, oregano",
    "m_satarasa_name": "Šataraša",
    "m_satarasa_desc": "Rajčata San Marzano DOP, mozzarella fior di latte, tradiční zeleninové lečo šataraš, klobásky, čerstvá bazalka",
    "m_tartufina_desc": "Rajčata San Marzano DOP, mozzarella fior di latte, lanýžová pasta, lesní houby, lanýžový olej",
    "m_vegana_name": "Veganská",
    "m_vegana_desc": "Rajčata San Marzano DOP, čerstvá bazalka, sicilská zeleninová caponata, artyčoky, pražené piniové oříšky",
    "m_dodatek1_title": "Přílohy I",
    "m_dodatek1_items": "Rajčata, žampiony, červená cibule, vejce, čerstvá bazalka, kukuřice",
    "m_dodatek2_title": "Přílohy II",
    "m_dodatek3_title": "Přílohy III",
    "m_panGarlicBread_name": "Česnekový Chléb s Parmazánem",
    "m_narezek_name": "Uzeninové a Sýrové Prkénko (pro 2)",
    "m_narezek_desc": "Parmská šunka, pancetta, mortadela, pikantní salám, bresaola, olivy, italské sýry, teplý chléb",
    "m_salMesana_name": "Míchaný Salát",
    "m_salTuna_name": "Tuňákový Salát",
    "m_salBuffalo_name": "Buvolí Salát",
    "m_salRoastbeef_name": "Roastbeef Salát",
  },
  "site": {
    "eventsTitle": "Program",
    "eventsSub": "Nadcházející akce na zámku Kodeljevo.",
    "eventsEmpty": "Zatím nejsou vyhlášeny žádné termíny. Sledujte nás na Instagramu.",
    "eventsMore": "Všechny akce na Resident Advisor →",
    "eventsFree": "Vstup volný",
    "intro": "“Pizza, bistro a taneční bar na zámku Kodeljevo.”",
    "follow": "Sledujte nás na Instagramu pro novinky a speciální otevření.",
    "closing": "Brzy na viděnou, Kader.",
    "menuCta": "Menu",
    "menuImageAlt": "Menu Kader — pizzy, panuozzo, saláty a boardská k doslova",
    "band1Alt": "Klub v sklepě zámku Kodeljevo",
    "band2Alt": "Pizza v peci na dřevo",
    "band3Alt": "Panství Kodeljevo",
    "dodatkiTitle": "Přílohy",
    "seoTitle": "Kader Grad Kodeljevo — pizza Tonda Romana & klub Ljubljana",
    "seoDesc": "Pizza Tonda Romana na rustikálním těstě, pečená v peci na dřevo při 375 °C, a klubová kultura v barokním zámku Kodeljevo v Ljubljani. Menu, otevírací doba a prostor.",
    "menuTitle": "Menu",
    "menuNote": "Pizzy, sendviče panuozzo, saláty a boardská k doslova. Pizzy pečeme v peci na dřevo; ceny v eurech.",
    "hoursTitle": "Otevírací doba",
    "kitchen": "Kuchyně: 12:00 – 22:00.",
    "venueTitle": "Prostor",
    "venueP1": "Barokový dvorec Codelli ze 17. století s velkou zahradou, letní terasou a klubským kletem je k dispozici pro soukromé akce.",
    "venueP2": "Vhodné pro svatby, firemní akce, soukromé oslavy, výstavy a koncerty. Nabízíme kompletní catering, profesionální ozvučení a osvětlení, až pro 500 hostů.",
    "venueP3": "Pro dotazy a prohlídky nám napište nebo zavolejte.",
    "contactTitle": "Kontakt",
    "reserveNote": "Rezervace a objednávky přijímáme telefonicky."
  },
}

const es: Dict = {
  "header": {
    "langSelectAria": "Selector de idioma",
    "langSelector": "Selector de idioma",
    "logoAlt": "Kader Castillo Kodeljevo"
  },
  "home": {
    "monWed": "Lunes – Miércoles",
    "thu": "Jueves",
    "fri": "Viernes (Noche de club)",
    "sat": "Sábado",
    "sun": "Domingo",
  },
  "pizzeria": {
    "provenanceTitle": "Compromiso con la Autenticidad y el Origen Certificado",
    "provenanceDesc": "Utilizamos exclusivamente ingredientes certificados con denominación de origen (D.O.P. e I.G.P.) procedentes de productores de Campania y Emilia-Romaña.",
    "regularFamily": "Normal / Familiar",
    "colPizzaTitle": "PIZZAS",
    "colPanuozzoTitle": "SÁNDWICHES PANUOZZO",
    "colNarezekTitle": "TABLA DE EMBUTIDOS (PARA 2)",
    "colSaladsTitle": "ENSALADAS",
    "priceListValidFrom": "Lista de precios válida desde el 1 de junio de 2026",
    "pricesVat": "Todos los precios se expresan en euros (€) e incluyen IVA.",
    "allergenLegendTitle": "Guía de alérgenos:",
    "allergenLegendText": "1 gluten | 2 crustáceos | 3 huevos | 4 pescado | 5 soja | 6 lácteos | 7 frutos de cáscara | 8 apio | 9 mostaza | 10 sésamo | 11 sulfitos | 12 altramuces | 13 moluscos",
    "m_marinara_desc": "Tomates San Marzano DOP, albahaca fresca, orégano, confit de ajo, aceite de oliva virgen extra",
    "m_margerita_desc": "Tomates San Marzano DOP, mozzarella fior di latte, orégano, aceite de oliva virgen extra",
    "m_klasika_name": "Capricciosa Clásica",
    "m_klasika_desc": "Tomates San Marzano DOP, mozzarella fior di latte, jamón cocido de Praga, champiñones, alcachofas, aceitunas",
    "m_bufalina_desc": "Tomates San Marzano DOP, albahaca fresca, mozzarella di bufala campana DOP, aceite de oliva virgen extra",
    "m_regina_desc": "Tomates San Marzano DOP, albahaca fresca, Parmigiano Reggiano 24m, aceite de oliva virgen extra, burrata fresca",
    "m_bresaola_desc": "Tomates San Marzano DOP, mozzarella fior di latte, bresaola de Valtellina, rúcula, lascas de Grana Padano DOP",
    "m_krasotica_name": "Krasotica (Belleza)",
    "m_krasotica_desc": "Tomates San Marzano DOP, mozzarella fior di latte, Grana Padano DOP, salami picante spianata calabra, albahaca fresca",
    "m_peperoni_desc": "Tomates San Marzano DOP, mozzarella fior di latte, salami picante pepperoni, jalapeños",
    "m_kalabria_desc": "Tomates San Marzano DOP, mozzarella fior di latte, 'nduja calabresa, ricotta ahumada, cebolla roja",
    "m_arrotolata_desc": "Tomates San Marzano DOP, mozzarella fior di latte, pancetta arrotolata enrollada, champiñones, romero",
    "m_tuna_desc": "Tomates San Marzano DOP, mozzarella fior di latte, atún en aceite de oliva, cebolla roja, alcaparras, aceitunas",
    "m_ortolana_desc": "Tomates San Marzano DOP, mozzarella fior di latte, calabacín a la parrilla, berenjena, pimientos asados, orégano",
    "m_satarasa_name": "Satarasha",
    "m_satarasa_desc": "Tomates San Marzano DOP, mozzarella fior di latte, guiso tradicional sataraš de verduras, salchichas, albahaca fresca",
    "m_tartufina_desc": "Tomates San Marzano DOP, mozzarella fior di latte, crema de trufa, setas silvestres, aceite de trufa",
    "m_vegana_name": "Vegana",
    "m_vegana_desc": "Tomates San Marzano DOP, albahaca fresca, caponata siciliana de verduras, alcachofas, piñones tostados",
    "m_dodatek1_title": "Extras I",
    "m_dodatek1_items": "Tomates, champiñones, cebolla roja, huevo, albahaca fresca, maíz",
    "m_dodatek2_title": "Extras II",
    "m_dodatek3_title": "Extras III",
    "m_panGarlicBread_name": "Pan de Ajo con Parmesano",
    "m_narezek_name": "Tabla de Embutidos y Quesos (para 2)",
    "m_narezek_desc": "Jamón de Parma, pancetta, mortadela, salami picante, bresaola, aceitunas, quesos italianos, pan caliente",
    "m_salMesana_name": "Ensalada Mixta",
    "m_salTuna_name": "Ensalada de Atún",
    "m_salBuffalo_name": "Ensalada con Búfala",
    "m_salRoastbeef_name": "Ensalada de Roast Beef",
  },
  "site": {
    "eventsTitle": "Programa",
    "eventsSub": "Próximos eventos en el castillo de Kodeljevo.",
    "eventsEmpty": "Todavía no hay fechas anunciadas. Síguenos en Instagram.",
    "eventsMore": "Todos los eventos en Resident Advisor →",
    "eventsFree": "Entrada libre",
    "intro": "“Pizza, bistró y bar de baile en el castillo de Kodeljevo.”",
    "follow": "Síguenos en Instagram para novedades y aperturas especiales.",
    "closing": "Hasta pronto, Kader.",
    "menuCta": "Carta",
    "menuImageAlt": "Carta Kader — pizzas, panuozzos, ensaladas y tabla",
    "band1Alt": "El club del sótano del castillo de Kodeljevo",
    "band2Alt": "Pizza en el horno de leña",
    "band3Alt": "La finca de Kodeljevo",
    "dodatkiTitle": "Extras",
    "seoTitle": "Kader Grad Kodeljevo — pizza Tonda Romana & club Liubliana",
    "seoDesc": "Pizza Tonda Romana con masa rústica, horneada en horno de leña a 375 °C, y cultura club en el castillo barroco de Kodeljevo en Liublana. Carta, horario y espacio.",
    "menuTitle": "Carta",
    "menuNote": "Pizzas, panuozzos, ensaladas y una tabla para compartir. Las pizzas se hornean en leña; precios en euros.",
    "hoursTitle": "Horario",
    "kitchen": "Cocina: 12:00 – 22:00.",
    "venueTitle": "Espacio",
    "venueP1": "La finca barroca de Codelli del siglo XVII, con su gran jardín, terraza de verano y club en el sótano, está disponible para eventos privados.",
    "venueP2": "Adecuado para bodas, eventos corporativos, fiestas privadas, exposiciones y conciertos. Ofrecemos catering propio, sonido e iluminación profesionales, hasta 500 invitados.",
    "venueP3": "Para consultas y visitas, escríbenos o llámanos.",
    "contactTitle": "Contacto",
    "reserveNote": "Las reservas y pedidos se hacen por teléfono."
  },
}

export const dictionaries: Record<Locale, Dict> = { sl, en, de, fr, it, sr, nl, pl, cs, es }

// Pre-flatten dictionaries at module initialization for instantaneous O(1) property lookup
function flattenDict(obj: Dict, prefix = ''): Record<string, string> {
  const res: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(res, flattenDict(value as Dict, fullKey))
    } else if (typeof value === 'string' || typeof value === 'number') {
      res[fullKey] = String(value)
    }
  }
  return res
}

export const flatDictionaries: Record<Locale, Record<string, string>> = {
  sl: flattenDict(sl),
  en: flattenDict(en),
  de: flattenDict(de),
  fr: flattenDict(fr),
  it: flattenDict(it),
  sr: flattenDict(sr),
  nl: flattenDict(nl),
  pl: flattenDict(pl),
  cs: flattenDict(cs),
  es: flattenDict(es)
}

const STORAGE_KEY = 'kader-lang'

export function useLocale() {
  // Check route query parameter (?lang=) during SSR or client setup
  let queryLang: string | undefined
  try {
    const route = useRoute()
    const raw = route?.query?.lang
    const item = Array.isArray(raw) ? raw[0] : raw
    queryLang = typeof item === 'string' ? item.trim().toLowerCase() : undefined
  } catch {
    // Ignore route access before context is ready
  }

  // SSR Cookie synchronization (1-year persistence)
  const cookie = (useCookie as unknown as UseCookieFn)<Locale>(STORAGE_KEY, {
    default: () => (isSupportedLocale(queryLang) ? queryLang : DEFAULT_LOCALE),
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/'
  })

  // Request-isolated / hydration-safe reactive state
  const locale = (useState as unknown as UseStateFn)<Locale>('locale', () => {
    if (isSupportedLocale(queryLang)) {
      cookie.value = queryLang
      return queryLang
    }
    const cookieVal = cookie.value
    return isSupportedLocale(cookieVal) ? cookieVal : DEFAULT_LOCALE
  })

  // Client-side synchronization on mount
  if (import.meta.client) {
    try {
      if (isSupportedLocale(queryLang) && queryLang !== locale.value) {
        locale.value = queryLang
        cookie.value = queryLang
        localStorage.setItem(STORAGE_KEY, queryLang)
        localStorage.setItem('kader-locale', queryLang)
      } else {
        const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('kader-locale')
        if (isSupportedLocale(stored) && stored !== locale.value && !isSupportedLocale(queryLang)) {
          locale.value = stored
          cookie.value = stored
        }
      }
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = locale.value
      }
    } catch {
      // Ignore private browsing / restricted storage exceptions
    }
  }

  const setLocale = (l: Locale) => {
    if (!isSupportedLocale(l)) return
    locale.value = l
    cookie.value = l
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, l)
        localStorage.setItem('kader-locale', l)
        if (typeof document !== 'undefined' && document.documentElement) {
          document.documentElement.lang = l
        }
      } catch {
        // Ignore storage exceptions
      }
    }
  }

  const toggleLocale = () => {
    const currentIndex = SUPPORTED_LOCALES.indexOf(locale.value)
    const nextIndex = (currentIndex + 1) % SUPPORTED_LOCALES.length
    setLocale(SUPPORTED_LOCALES[nextIndex] ?? DEFAULT_LOCALE)
  }

  const availableLocales = computed(() => SUPPORTED_LOCALES)
  const currentLocaleLabel = computed(() => localeLabels[locale.value]?.native || locale.value.toUpperCase())

  // Fast translation function supporting both {param} and {{param}} syntax
  const t = (key: string, params?: Record<string, string | number>): string => {
    const currentDict = flatDictionaries[locale.value] || flatDictionaries[DEFAULT_LOCALE]
    let text = currentDict[key]
    if (text === undefined || text === '') {
      text = flatDictionaries[DEFAULT_LOCALE]?.[key] ?? key
    }

    if (params && typeof text === 'string') {
      return text.replace(/\{{1,2}([a-zA-Z0-9_-]+)\}{1,2}/g, (match, paramName) => {
        return params[paramName] !== undefined ? String(params[paramName]) : match
      })
    }

    return text
  }

  return {
    locale,
    setLocale,
    toggleLocale,
    t,
    availableLocales,
    currentLocaleLabel,
    dictionaries,
    flatDictionaries,
    localeLabels,
    SUPPORTED_LOCALES,
    DEFAULT_LOCALE
  }
}
