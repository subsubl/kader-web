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
    "intro1": "Kader je picerija, bistro in klub v grajskem kompleksu Codelli v Kodeljevem. Spečemo pico Tonda Romana z rustičnim testom v peči na drva, ki je vedno na 375 °C.",
    "intro2": "Odprto od ponedeljka do nedelje, vikendi pa pozno v noč. Vrt in terasa sta zapolnjena, poletja pa glasba do zore.",
    "intro3": "Za večjo skupino, poroke ali kakšen drug dogodek seveda napiši na",
    "intro4": "Sledi nam na Instagramu za novosti in odprtine.",
    "signoff": "Liefs, Kader.",
    "menuTitle": "Meni",
    "eventsTitle": "Program",
    "eventsSub": "Vse klubske noči najdeš na Resident Advisor.",
    "eventsEmpty": "Trenutno ni razpisanih prihodnjih dogodkov.",
    "eventsMore": "Vse dogodke na Resident Advisor →",
    "hoursTitle": "Delovni čas",
    "kitchen": "Kuhinja: 12:00 – 22:00.",
    "venueTitle": "Prizorišče",
    "venue1": "Grad Kodeljevo je tudi zasebno na voljo. Zgodovinski baročni dvorec, velik vrt, poletna terasa in klubski obok pod streho.",
    "venue2": "Za poroke, poslovna srečanja, zasebne zabave, razstave ali koncerte. Do 500 gostov, z našo kuhinjo in ozvočenjem.",
    "venue3": "Ogled in povpraševanje naprej:",
    "contactTitle": "Kontakt",
    "reserveNote": "Rezervacije in naročila sprejemamo po telefonu.",
    "band1Alt": "Klubski obok v Gradu Kodeljevo",
    "band2Alt": "Notranjost Kaderja v večeru",
    "band3Alt": "Zaseljen grad Kodeljevo",
    "seoTitle": "Kader Grad Kodeljevo — Pizza bistro in plesni bar",
    "seoDesc": "Pizza bistro in plesni bar v grajskem kompleksu Codelli v Kodeljevem. Pica Tonda Romana z rustičnim testom, pečena v peči na drva, vrt, terasa in klubski obok.",
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
    "intro1": "Kader is a pizzeria, bistro and club in the Codelli castle estate in Kodeljevo. We bake Tonda Romana with rustic dough in a wood-fired oven that always sits at 375 °C.",
    "intro2": "Open Monday to Sunday, and late into the night at the weekend. The garden and the terrace fill up, in summer the music runs until dawn.",
    "intro3": "For a larger group, a wedding or any other occasion, just write to",
    "intro4": "Follow us on Instagram for news and pop-ups.",
    "signoff": "Love, Kader.",
    "menuTitle": "Menu",
    "eventsTitle": "Programme",
    "eventsSub": "Every club night is listed on Resident Advisor.",
    "eventsEmpty": "No upcoming dates at the moment.",
    "eventsMore": "All events on Resident Advisor →",
    "hoursTitle": "Opening hours",
    "kitchen": "Kitchen: 12:00 – 22:00.",
    "venueTitle": "Venue",
    "venue1": "Kodeljevo Castle is also available privately. A historic baroque manor, a large garden, a summer terrace and a club vault under the roof.",
    "venue2": "For weddings, corporate events, private parties, exhibitions or concerts. Up to 500 guests, with our kitchen and sound system.",
    "venue3": "Viewings and enquiries:",
    "contactTitle": "Contact",
    "reserveNote": "We take reservations and orders by telephone.",
    "band1Alt": "The club vault at Kodeljevo Castle",
    "band2Alt": "Kader in the evening",
    "band3Alt": "The Kodeljevo estate",
    "seoTitle": "Kader Grad Kodeljevo — Pizza bistro and dance bar",
    "seoDesc": "Pizza bistro and dance bar in the Codelli castle estate in Kodeljevo. Tonda Romana pizza with rustic dough baked in a wood-fired oven, a garden, a terrace and a club vault.",
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
    "intro1": "Kader ist eine Pizzeria, ein Bistro und ein Club im Schlossanwesen Codelli in Kodeljevo. Wir backen Tonda Romana mit rustikalem Teig in einem Holzofen, der immer auf 375 °C steht.",
    "intro2": "Von Montag bis Sonntag geöffnet, am Wochenende geht es spät in die Nacht. Garten und Terrace sind voll, im Sommer läuft die Musik bis zum Morgengrauen.",
    "intro3": "Für eine größere Gruppe, eine Hochzeit oder jeden anderen Anlass, schreib einfach an",
    "intro4": "Folge uns auf Instagram für Neuigkeiten und Pop-ups.",
    "signoff": "Liebe Grüße, Kader.",
    "menuTitle": "Speisekarte",
    "eventsTitle": "Programm",
    "eventsSub": "Alle Klubsnächte findest du auf Resident Advisor.",
    "eventsEmpty": "Zurzeit sind keine Termine angekündigt.",
    "eventsMore": "Alle Events auf Resident Advisor →",
    "hoursTitle": "Öffnungszeiten",
    "kitchen": "Küche: 12:00 – 22:00 Uhr.",
    "venueTitle": "Location",
    "venue1": "Schloss Kodeljevo steht auch privat zur Verfügung. Historisches barockes Herrenhaus, großer Garten, Sommerterrasse und ein Clubkeller unter dem Dach.",
    "venue2": "Für Hochzeiten, Firmenveranstaltungen, private Feiern, Ausstellungen oder Konzerte. Bis zu 500 Gäste, mit unserer Küche und Beschallung.",
    "venue3": "Besichtigung und Anfragen an:",
    "contactTitle": "Kontakt",
    "reserveNote": "Reservierungen und Bestellungen nehmen wir telefonisch entgegen.",
    "band1Alt": "Der Kellerclub im Schloss Kodeljevo",
    "band2Alt": "Kader am Abend",
    "band3Alt": "Das Anwesen Kodeljevo",
    "seoTitle": "Kader Grad Kodeljevo — Pizza-Bistro und Tanzbar",
    "seoDesc": "Pizza-Bistro und Tanzbar im Schlossanwesen Codelli in Kodeljevo. Tonda-Romana-Pizza mit rustikalem Teig aus dem Holzofen, Garten, Terrasse und Clubkeller.",
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
    "intro1": "Kader est une pizzeria, un bistrot et un club dans le domaine du château Codelli à Kodeljevo. Nous cuisons la Tonda Romana à pâte rustique dans un four à bois toujours à 375 °C.",
    "intro2": "Ouvert du lundi au dimanche, et tard dans la nuit le week-end. Le jardin et la terrasse sont pris, en été la musique court jusqu'à l'aube.",
    "intro3": "Pour un groupe plus large, un mariage ou toute autre occasion, écris-nous à",
    "intro4": "Suis-nous sur Instagram pour les nouveautés et les ouvertures spéciales.",
    "signoff": "À bientôt, Kader.",
    "menuTitle": "Menu",
    "eventsTitle": "Programme",
    "eventsSub": "Toutes les soirées club sont sur Resident Advisor.",
    "eventsEmpty": "Aucune date annoncée pour le moment.",
    "eventsMore": "Tous les événements sur Resident Advisor →",
    "hoursTitle": "Horaires d'ouverture",
    "kitchen": "Cuisine : 12:00 – 22:00.",
    "venueTitle": "Lieu",
    "venue1": "Le château de Kodeljevo est aussi disponible en privé. Manoir baroque historique, grand jardin, terrasse d'été et club en sous-sol.",
    "venue2": "Pour mariages, événements d'entreprise, fêtes privées, expositions ou concerts. Jusqu'à 500 personnes, avec notre cuisine et notre sonorisation.",
    "venue3": "Visites et demandes à :",
    "contactTitle": "Contact",
    "reserveNote": "Réservations et commandes se font par téléphone.",
    "band1Alt": "Le club en sous-sol du château de Kodeljevo",
    "band2Alt": "Kader le soir",
    "band3Alt": "Le domaine de Kodeljevo",
    "seoTitle": "Kader Grad Kodeljevo — Pizza, bistro et bar dansant",
    "seoDesc": "Pizza, bistro et bar dansant dans le domaine du château Codelli à Kodeljevo. Pizza Tonda Romana à pâte rustique au four à bois, jardin, terrasse et club en sous-sol.",
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
    "intro1": "Kader è una pizzeria, un bistrot e un club nella tenuta del castello Codelli a Kodeljevo. Cuociamo la Tonda Romana con impasto rustico in un forno a legna sempre a 375 °C.",
    "intro2": "Aperti dal lunedì alla domenica, e fino a tardi nel weekend. Il giardino e la terrazza sono pieni, d'estate la musica va fino all'alba.",
    "intro3": "Per un gruppo più grande, un matrimonio o qualsiasi altra occasione, scrivici a",
    "intro4": "Seguici su Instagram per novità e aperture speciali.",
    "signoff": "A presto, Kader.",
    "menuTitle": "Menu",
    "eventsTitle": "Programma",
    "eventsSub": "Tutte le serate club sono su Resident Advisor.",
    "eventsEmpty": "Nessuna data annunciata al momento.",
    "eventsMore": "Tutti gli eventi su Resident Advisor →",
    "hoursTitle": "Orari",
    "kitchen": "Cucina: 12:00 – 22:00.",
    "venueTitle": "Spazio",
    "venue1": "Il castello di Kodeljevo è disponibile anche in forma privata. Maniero barocco storico, grande giardino, terrazza estiva e club nel seminterrato.",
    "venue2": "Per matrimoni, eventi aziendali, feste private, mostre o concerti. Fino a 500 ospiti, con la nostra cucina e l'impianto audio.",
    "venue3": "Visite e richieste a:",
    "contactTitle": "Contatti",
    "reserveNote": "Prenotazioni e ordini si effettuano via telefono.",
    "band1Alt": "Il club nel seminterrato del castello di Kodeljevo",
    "band2Alt": "Kader la sera",
    "band3Alt": "La tenuta di Kodeljevo",
    "seoTitle": "Kader Grad Kodeljevo — Pizza, bistrot e bar dance",
    "seoDesc": "Pizza, bistrot e bar dance nella tenuta del castello Codelli a Kodeljevo. Pizza Tonda Romana con impasto rustico al forno a legna, giardino, terrazza e club nel seminterrato.",
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
    "intro1": "Kader je picerija, bistro i klub u imanju dvorca Codelli u Kodeljevom. Pečemo Tonda Romana sa rustičnim testom u peći na drva koja je uvek na 375 °C.",
    "intro2": "Otvoreno od ponedeljka do nedelje, a vikendom do kasno u noć. Dvorište i terasa su puni, leti muzika traje do zore.",
    "intro3": "Za veću grupu, svadbu ili bilo koji drugi događaj, samo nam pišite na",
    "intro4": "Prati nas na Instagramu za novosti i posebna otvaranja.",
    "signoff": "Vidimo se uskoro, Kader.",
    "menuTitle": "Meni",
    "eventsTitle": "Program",
    "eventsSub": "Sve klubske noći su na Resident Advisor.",
    "eventsEmpty": "Trenutno nema najavljenih termina.",
    "eventsMore": "Svi događaji na Resident Advisor →",
    "hoursTitle": "Radno vreme",
    "kitchen": "Kuhinja: 12:00 – 22:00.",
    "venueTitle": "Prostor",
    "venue1": "Dvorac Kodeljevo je dostupan i za privatne događaje. Istorijski barokni dvorac, veliko dvorište, letnja terasa i klupski podrum.",
    "venue2": "Za svadbe, poslovne događaje, žurke, izložbe i koncerte. Do 500 gostiju, sa našom kuhinjom i ozvučenjem.",
    "venue3": "Obilazak i upiti na:",
    "contactTitle": "Kontakt",
    "reserveNote": "Rezervacije i porudžbine primamo telefonom.",
    "band1Alt": "Klupski podrum u dvorcu Kodeljevo",
    "band2Alt": "Kader uveče",
    "band3Alt": "Imanje Kodeljevo",
    "seoTitle": "Kader Grad Kodeljevo — Pizza bistro i plesni bar",
    "seoDesc": "Pizza bistro i plesni bar u imanju dvorca Codelli u Kodeljevom. Pica Tonda Romana sa rustičnim testom u peći na drva, dvorište, terasa i klupski podrum.",
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
    "intro1": "Kader is een pizzeria, bistro en club in het kasteelgoed Codelli in Kodeljevo. We bakken Tonda Romana met rustiek deeg in een houtoven die altijd op 375 °C staat.",
    "intro2": "Open van maandag tot zondag, en in het weekend tot laat. De tuin en het terras zitten vol, in de zomer loopt de muziek tot de ochtend.",
    "intro3": "Voor een grotere groep, een bruiloft of een andere gelegenheid, schrijf gewoon naar",
    "intro4": "Volg ons op Instagram voor nieuws en speciale avonden.",
    "signoff": "Tot snel, Kader.",
    "menuTitle": "Menu",
    "eventsTitle": "Programma",
    "eventsSub": "Alle clubavonden staan op Resident Advisor.",
    "eventsEmpty": "Op dit moment geen data aangekondigd.",
    "eventsMore": "Alle evenementen op Resident Advisor →",
    "hoursTitle": "Openingstijden",
    "kitchen": "Keuken: 12:00 – 22:00.",
    "venueTitle": "Locatie",
    "venue1": "Kasteel Kodeljevo is ook privé te huur. Een historisch barok landgoed, grote tuin, zomerterras en een clubkelder onder het dak.",
    "venue2": "Voor bruiloften, zakelijke evenementen, privéfeesten, tentoonstellingen en concerten. Tot 500 gasten, met onze keuken en geluidsinstallatie.",
    "venue3": "Bezichtiging en vragen aan:",
    "contactTitle": "Contact",
    "reserveNote": "Reserveringen en bestellingen gaan telefonisch.",
    "band1Alt": "De kelderclub in Kasteel Kodeljevo",
    "band2Alt": "Kader in de avond",
    "band3Alt": "Landgoed Kodeljevo",
    "seoTitle": "Kader Grad Kodeljevo — Pizzabistro en dansbar",
    "seoDesc": "Pizzabistro en dansbar in het kasteelgoed Codelli in Kodeljevo. Tonda Romana-pizza met rustiek deeg uit de houtoven, tuin, terras en kelderclub.",
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
    "intro1": "Kader to pizzeria, bistro i klub w folwarku zamku Codelli w Kodeljewie. Pieczemy pizzę Tonda Romana na rustycznym cieście w piecu na drewno, który zawsze ma 375 °C.",
    "intro2": "Otwarte od poniedziałku do niedzieli, a w weekendy do późna w nocy. Ogród i taras są pełne, latem muzyka gra do świtu.",
    "intro3": "Większej grupie, na wesele lub przy innej okazji, po prostu napisz do",
    "intro4": "Śledź nas na Instagramie, aby znać nowości i pop-upy.",
    "signoff": "Do zobaczenia, Kader.",
    "menuTitle": "Menu",
    "eventsTitle": "Program",
    "eventsSub": "Wszystkie wieczory klubowe znajdziesz na Resident Advisor.",
    "eventsEmpty": "Na razie nie ogłoszono żadnych terminów.",
    "eventsMore": "Wszystkie wydarzenia na Resident Advisor →",
    "hoursTitle": "Godziny otwarcia",
    "kitchen": "Kuchnia: 12:00 – 22:00.",
    "venueTitle": "Przestrzeń",
    "venue1": "Zamek Kodeljevo jest też dostępny prywatnie. Historyczny barokowy dwór, duży ogród, letni taras i klub w piwnicy.",
    "venue2": "Na wesela, wydarzenia firmowe, przyjęcia prywatne, wystawy i koncerty. Do 500 gości, z naszą kuchnią i nagłośnieniem.",
    "venue3": "Oględziny i zapytania:",
    "contactTitle": "Kontakt",
    "reserveNote": "Rezerwacje i zamówienia przyjmujemy telefonicznie.",
    "band1Alt": "Klub w piwnicy Zamku Kodeljevo",
    "band2Alt": "Kader wieczorem",
    "band3Alt": "Zamek Kodeljevo",
    "seoTitle": "Kader Grad Kodeljevo — Pizza, bistro i bar taneczny",
    "seoDesc": "Pizza, bistro i bar taneczny w folwarku zamku Codelli w Kodeljewie. Pizza Tonda Romana na rustycznym cieście z pieca na drewno, ogród, taras i klub w piwnicy.",
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
    "intro1": "Kader je pizzerie, bistro a klub v areálu zámku Codelli v Kodeljevě. Pečeme pizzu Tonda Romana na rustikálním těstě v peci na dřevo, která je vždy na 375 °C.",
    "intro2": "Otevřeno od pondělí do neděle, o víkendu dlouho do noci. Zahrada i terasa jsou plné, v létě hraje hudba do svítání.",
    "intro3": "Větší skupině, na svatbu nebo při jiné příležitosti, prostě napište na",
    "intro4": "Sledujte nás na Instagramu pro novinky a speciální otevření.",
    "signoff": "Brzy na viděnou, Kader.",
    "menuTitle": "Menu",
    "eventsTitle": "Program",
    "eventsSub": "Všechny klubové noci najdete na Resident Advisor.",
    "eventsEmpty": "Zatím nejsou vyhlášeny žádné termíny.",
    "eventsMore": "Všechny akce na Resident Advisor →",
    "hoursTitle": "Otevírací doba",
    "kitchen": "Kuchyně: 12:00 – 22:00.",
    "venueTitle": "Prostor",
    "venue1": "Zámek Kodeljevo je k dispozici i pro soukromé akce. Historický barokní dvorec, velká zahrada, letní terasa a klubský sklep.",
    "venue2": "Na svatby, firemní akce, soukromé oslavy, výstavy a koncerty. Až pro 500 hostů, s naší kuchyní a ozvučením.",
    "venue3": "Prohlídky a dotazy:",
    "contactTitle": "Kontakt",
    "reserveNote": "Rezervace a objednávky přijímáme telefonicky.",
    "band1Alt": "Klub v sklepě zámku Kodeljevo",
    "band2Alt": "Kader večer",
    "band3Alt": "Panství Kodeljevo",
    "seoTitle": "Kader Grad Kodeljevo — Pizza, bistro a taneční bar",
    "seoDesc": "Pizza, bistro a taneční bar v areálu zámku Codelli v Kodeljevě. Pizza Tonda Romana na rustikálním těstě z pece na dřevo, zahrada, terasa a klubský sklep.",
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
    "intro1": "Kader es una pizzería, un bistró y un club en la finca del castillo Codelli, en Kodeljevo. Horneamos pizza Tonda Romana con masa rústica en un horno de leña que siempre está a 375 °C.",
    "intro2": "Abierto de lunes a domingo, y hasta tarde el fin de semana. El jardín y la terraza se llenan, en verano la música suena hasta el amanecer.",
    "intro3": "Para un grupo grande, una boda o cualquier otra ocasión, escríbenos a",
    "intro4": "Síguenos en Instagram para novedades y aperturas especiales.",
    "signoff": "Hasta pronto, Kader.",
    "menuTitle": "Carta",
    "eventsTitle": "Programa",
    "eventsSub": "Todas las noches de club están en Resident Advisor.",
    "eventsEmpty": "Todavía no hay fechas anunciadas.",
    "eventsMore": "Todos los eventos en Resident Advisor →",
    "hoursTitle": "Horario",
    "kitchen": "Cocina: 12:00 – 22:00.",
    "venueTitle": "Espacio",
    "venue1": "El castillo de Kodeljevo también está disponible en privado. Manor barroco histórico, jardín grande, terraza de verano y club en el sótano.",
    "venue2": "Para bodas, eventos corporativos, fiestas privadas, exposiciones o conciertos. Hasta 500 invitados, con nuestra cocina y sonido.",
    "venue3": "Visitas y consultas:",
    "contactTitle": "Contacto",
    "reserveNote": "Las reservas y pedidos se hacen por teléfono.",
    "band1Alt": "El club del sótano del castillo de Kodeljevo",
    "band2Alt": "Kader por la noche",
    "band3Alt": "La finca de Kodeljevo",
    "seoTitle": "Kader Grad Kodeljevo — Pizza, bistró y bar de baile",
    "seoDesc": "Pizza, bistró y bar de baile en la finca del castillo Codelli, en Kodeljevo. Pizza Torda Romana con masa rústica al horno de leña, jardín, terraza y club en el sótano.",
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
