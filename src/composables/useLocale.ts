// Lightweight EN/SL i18n — locale state + translate helper.
// Persists choice to localStorage; falls back to browser/EN. No external dep.

import { ref } from 'vue'

export type Locale = 'sl' | 'en'

// Nestable dictionary type (recursive via interface)
export interface Dict {
  [key: string]: string | Dict
}

const sl: Dict = {
  nav: {
    home: 'Začetna',
    pizzeria: 'Pizzeria',
    club: 'Klub',
    events: 'Dogodki',
    buyouts: 'Zasebni najem',
    admin: 'Admin'
  },
  header: {
    orderNow: 'Naročim in pridem iskat',
    bookTable: 'Rezervacije'
  },
  hero: {
    title: 'Grad Kodeljevo',
    tagline: 'Pizza bistro in plesni bar na gradu Kodeljevo',
    address: 'Ulica Carla Benza 20, 1000 Ljubljana',
    orders: 'Naročila',
    menu: 'Poglej Meni / Menu',
    events: 'Klubska Kultura & Dogodki'
  },
  home: {
    dayTitle: 'Pizza Bistro podnevi',
    dayP: 'V dnevnem času Grad Kodeljevo zaživi kot sproščen pizza bistro. Nudimo sveže ročno raztegnjeno pica testo, vrhunske italijanske sestavine (San Marzano pelati, Mocarela Bufala D.O.P, Mortadela D.O.P, sveži panuozzo sendviči) ter obare in salate.',
    dayF1: 'Ročno raztegnjene neapeljske pice in Panuozzo sendviči',
    dayF2: 'Možnost osebenega prevzema ("Naročim in pridem iskat")',
    dayF3: 'Zgodovinski ambient z prostranim gostinskim vrtom',
    dayCta: 'Celoten Meni & Cene →',
    nightTitle: 'Plesni Bar ponoči',
    nightP: 'Ob petkih in vikend večerih se grajski prostori spremenijo v podzemni klub z izjemno zvokovno izkušnjo. Klipsch La Scala ozvočenje in skrbno izbran glasbeni program ustvarjata nepozabno nočno vzdušje.',
    nightF1: 'Avdiofilsko Klipsch La Scala ozvočenje',
    nightF2: 'Petkove in sobote zabave (odprto do 05:00)',
    nightF3: 'Vrhunska izbira hišnih koktajlov, vin in craft piv',
    nightCta: 'Koledar Dogodkov →',
    upcomingTitle: 'Prihajajoči Dogodki',
    noEvents: 'Trenutno ni načrtovanih novih dogodkov.',
    noEvents2: 'Spremljajte naš koledar ali nas obiščite ob vikendih.',
    retry: 'Poskusi znova',
    viewOnRA: 'Oglej si na RA →',
    featuredBy: 'Z nastopom: ',
    fallbackDesc: 'Vabljeni na večer v Kader Grad Kodeljevo.',
    viewRA: 'Več o dogodku (RA) →',
    visitLabel: 'Lokacija & Obratovalni Čas',
    visitTitle: 'Obiščite Nas na Gradu Kodeljevo',
    visitP: 'Nahajamo se na naslovu Ulica Carla Benza 20 v Ljubljani. Za naročila hrane za s seboj nas pokličite na telefonsko številko {food} ali za rezervacije miz na {table}.',
    openMaps: 'Odpri Google Maps ↗',
    hoursTitle: 'Aktualni Delovni Čas (Google)',
    monWed: 'Ponedeljek – Sreda',
    thu: 'Četrtek',
    fri: 'Petek (Klubska zabava)',
    sat: 'Sobota',
    sun: 'Nedelja'
  },
  footer: {
    tagline: 'Pizza bistro in plesni bar na gradu Kodeljevo. Pizzeria podnevi in klubska kultura ponoči v zgodovinskem ambientu.',
    quickLinks: 'Hitre Povezave',
    contacts: 'Kontakt & Naročila',
    pickUp: 'Naročim in pridem iskat:',
    tableRes: 'Rezervacije miz:',
    hours: 'Delovni Čas (Google)',
    kitchenNote: '* Kuhinja obratuje od 12:00 do 22:00',
    rights: 'Vse pravice pridržane.',
    priceNote: 'Cenik velja od 06.09.2024. Cene so v € in vključujejo DDV.'
  },
  // ── Pizzeria page ──
  pizzeria: {
    tagline: 'Pizza bistro in plesni bar na gradu Kodeljevo',
    locationLine: 'Ulica Carla Benza 20, 1000 Ljubljana • Kuhinja obratuje 12:00 – 22:00',
    pickUp: 'Naročim in pridem iskat',
    tableRes: 'Rezervacije miz',
    digitalMenu: 'Digitalni Meni',
    printedMenu: 'Originalni Natisnjeni Meni (A3)',
    printedCaption: 'Prikaz uradnega ponudbenega cenika v Gradu Kodeljevo',
    openFullSize: 'Odpri sliko v polni velikosti ↗',
    zoomedAlt: 'Kader pizzeria meni (povečano)',
    allergenNote: 'Seznam alergenov v hrani in pijači je na voljo pri strežnem osebju pri šanku.',
    hoursNote: 'Bar obratuje 09:00 – 22:00 (ob vikendih dlje) • Kuhinja obratuje 12:00 – 22:00.',
    companyLine: 'Kader d.o.o. • Ulica Carla Benza 20, 1000 Ljubljana • SI45321361',
    // Category names (kept bilingual)
    catPizza: 'Pice',
    catPanuozzo: 'Panuozzo Sendviči',
    catStews: 'Na Žlico / Obare',
    catMains: 'Glavne Jedi',
    catSalads: 'Solate',
    catSides: 'Priloge',
    catDesserts: 'Sladice',
    catDrinks: 'Pijača & Koktajli',
    reviewsTitle: 'Mnenja Obiskovalcev (Google)',
    reviewsSubtitle: 'Avtentična mnenja in izkušnje gostov z Google Business profila Kader Grad Kodeljevo',
    viewGoogle: 'Oddajte mnenje na Google Maps ↗',
    ratingLabel: 'Izjemno 4.8 / 5.0 na podlagi več kot 120 Google mnenj'
  },
  // ── Club page ──
  club: {
    location: 'Grad Kodeljevo · Ljubljana',
    heroTagline: 'Elektronika. Živi nastopi. Vsi so dobrodošli.',
    theVenue: 'Prizorišče',
    venueTitle: 'Grad, nekaj minut od centra Ljubljane',
    venueP1: 'Kader je klub v zgodovinskem gradu. Predvajamo',
    venueP1Accent: 'elektronsko glasbo in gostimo žive nastope',
    venueP2: 'Vključujoč, LGBT-prijazen in odprt za vse. Pridi takšen, kot si; noč je odprta.',
    venueBasement: 'Kletni klub',
    venueFloor: 'Plesišče & bar',
    venueGarden: 'Poletni vrt',
    exploreSpaces: 'Razišči prostore',
    spacesTitle: 'Štirje svetovi v enem gradu',
    space01Title: 'Kletni klub',
    space01Desc: 'Sestopi v obokano klet — intimen, poglobljen prostor za elektroniko in močne sete.',
    space02Title: 'Plesišče & koktajl bar',
    space02Desc: 'Plesišče na nivoju tal z lastnim koktajl barom, zasnovano tako za glasbo kot klepet.',
    space03Title: 'Poletni vrt',
    space03Desc: 'Prostran zunanji vrt, ki zaživi v toplih mesecih — za dnevna druženja in blage večerne sete.',
    space04Title: 'Pizzeria',
    space04Desc: 'Naša pizzeria poskrbi za noč s pico, pečeno na ognju, iz grajske kuhinje.',
    theSound: 'Zvok',
    soundTitle: 'Avdiovrhunski sistemi v obeh notranjih prostorih',
    soundP1: 'Oba notranja prostora poganjata namensko vgrajena avdio sistema, zgrajena za jasnost in polnost — zasnovana tako, da napolnita grajske oboke brez popačenj.',
    soundP2: 'Osrednji kos je <strong>Klipsch La Scala AL6</strong>: povsem hordnato obremenjen, tristezenski zvočnik, izbran zaradi svoje učinkovitosti in udarca v tem zgodovinskem prostoru.',
    hideSpecs: 'Skrij specifikacije',
    viewSpecs: 'Prikaži tehnične specifikacije',
    tapReveal: 'Tapni za ogled inženirske zasnove zvoka.',
    ourPromise: 'Naša obljuba',
    saferSpaces: 'Varnejši prostori',
    safeIntro: 'Klub je tako dober, kot se v njem vsi počutijo varne. To so pravila, za katera stojimo vsako noč, na vsakem plesišču in v vsakem prostoru gradu.',
    safeOutro: 'Vedno se bomo učili in upamo, da se boste tudi vi. Če te karkoli — ali kdorkoli — moti, povej našemu osebju. Vzeli bomo to resno.',
    rule01Title: 'Spoštovanje & soglasje',
    rule01Text: 'Vprašaj, preden se dotakneš. Ne pomeni ne. Prostor, soglasje in meje niso pogajalske — za vse, vedno.',
    rule02Title: 'Preveri svoje predpostavke',
    rule02Text: 'Pusti predpostavke pred vrati. Vključujoči smo do vsakega ozadja, identitete in prepričanja — vključno s tem, kako razumeš svoje in tuje.',
    rule03Title: 'Zavedaj se svojega vpliva',
    rule03Text: 'Bodi pozoren na svoj prostor, hrup in energijo. Kako se obnašaš, oblikuje noč ljudi okoli tebe.',
    rule04Title: 'Spoštuj zasebnost',
    rule04Text: 'Kar se zgodi na plesišču, ostane na plesišču. Spoštuj, da je prisotnost vsakogar njegova lastna zadeva.',
    rule05Title: 'Spoštuj vrata',
    rule05Text: 'Naša politika na vratih uravnoveša varnost in svobodo za vse. Obstaja, da bi bil prostor odprt in prijazen — in jo dosledno izvajamo.',
    lineup: 'Program',
    upcomingNights: 'Prihajajoče Noči',
    viewAllRA: 'Vsi na Resident Advisor →',
    noNights: 'Trenutno ni razpisanih klubskih noči.',
    newLineups: 'Novi programi se avtomatsko sinhronizirajo.',
    tickets: 'Vstopnice →',
    privateHire: 'Zasebni najem',
    takeoverTitle: 'Prevzemite grad',
    takeoverP: 'Spremenite svoj dogodek v nepozabno noč v našem zgodovinskem prizorišču.',
    bookVenue: 'Rezerviraj prizorišče',
    retry: 'Poskusi znova',
    loadLineupError: 'Programa trenutno ne moremo naložiti.'
  },
  // ── Events page ──
  events: {
    pageTitle: 'Koledar Dogodkov',
    pageDesc: 'Pridružite se nam na razburljivih dogodkih v Kader Grad Kodeljevo — od žive glasbe do kulturnih večerov.',
    upcoming: 'Prihajajoči Dogodki',
    syncedFromRA: '',
    allEvents: 'Vsi Dogodki',
    filterPizzeria: 'Pizzeria',
    filterClub: 'Klub',
    filterLive: 'Živo',
    noUpcoming: 'Trenutno ni prihajajočih dogodkov{{filter}}.',
    newEventsSync: 'Novi dogodki se bodo sinhronizirali takoj, ko bodo objavljeni.',
    viewAll: 'Prikaži vse dogodke',
    pastEvents: 'Pretekli Dogodki',
    viewOnRA: 'Oglej si na Resident Advisor',
    featuredBy: 'Z nastopom: ',
    fallbackDesc: 'Vabljeni na večer v Kader Grad Kodeljevo.',
    ticketsTitle: 'Vstopnice & Rezervacije',
    buyHere: 'Kupite vstopnice kar tukaj na vsaki kartici dogodka — varno, s QR preverjanjem na vhodu.',
    alsoRA: 'Odkrijte dogodke in si oglejte celoten program na naši Resident Advisor strani.',
    raPage: 'Resident Advisor stran'
  },
  // ── Buyouts page ──
  buyouts: {
    pageTitle: 'Zasebni Najem & Buyout-i',
    pageDesc: 'Spremenite svoj poseben dogodek v nepozabno izkušnjo v našem zgodovinskem grajskem prizorišču.',
    venueOverview: 'Pregled Prizorišča',
    venueP: 'Naše grajsko prizorišče nudi edinstveno kombinacijo zgodovinskega čara in sodobne opreme za zasebni dogodek. S svojo impresivno arhitekturo in intimnim vzdušjem je popolno okolje za poroke, poslovne dogodke ali posebna praznovanja.',
    venueFeatures: 'Značilnosti Prizorišča',
    feat1: 'Zgodovinsko grajsko okolje s kamnitimi zidovi in obokanimi stropi',
    feat2: 'Zmogljivost za 100–300 gostov, odvisno od vrste dogodka',
    feat3: 'Na voljo profesionalne gostinske storitve',
    feat4: 'Parkirišče na lokaciji in dostopnost',
    feat5: 'Vključen zvočni sistem in razsvetljava',
    eventTypes: 'Vrste Dogodkov',
    weddings: 'Poroke',
    weddingsDesc: 'Elegantne slovesnosti in sprejemi v naših zgodovinskih dvoranah.',
    corporate: 'Poslovni Dogodki',
    corporateDesc: 'Profesionalna srečanja z edinstvenim zgodovinskim ozadjem.',
    privateParties: 'Zasebne Zabave',
    privatePartiesDesc: 'Intimna praznovanja s personalizirano storitvijo.',
    cultural: 'Kulturni Dogodki',
    culturalDesc: 'Umetniške razstave, koncerti in izobraževalni programi.',
    bookingProcess: 'Postopek Rezervacije',
    booking1: 'Oddajte povpraševanje s podrobnostmi in datumi',
    booking2: 'Prejmite potrditev razpoložljivosti prizorišča',
    booking3: 'Pogovor o možnostih prilagoditve in cenah',
    booking4: 'Podpis pogodbe in vplačilo varščine',
    booking5: 'Uživajte v svojem posebnem dogodku!',
    tieredPricing: 'Cenovni Paketi',
    basic: 'Osnovni Paket',
    popular: 'NAJPOPULARNEJŠI',
    premium: 'Premium Paket',
    luxury: 'Luksuzni Paket',
    upTo: 'Do {{n}} gostov',
    basicCatering: 'Osnovna gostinska ponudba',
    fullCatering: 'Celotna gostinska ponudba',
    luxuryCatering: 'Luksuzna gostinska ponudba',
    standardSound: 'Standardni zvočni sistem',
    proSound: 'Profesionalni zvočni sistem',
    fullSound: 'Celoten zvok & razsvetljava',
    basicDecor: 'Osnovna dekoracija',
    elegantDecor: 'Elegantna dekoracija',
    customDecor: 'Prilagojena dekoracija',
    specialistLighting: 'Specialistična razsvetljava',
    personalizedService: 'Personalizirana storitev',
    exclusiveAccess: 'Ekskluziven dostop',
    contactUs: 'Kontaktirajte Nas',
    requestQuote: 'Zahtevajte Ponudbo',
    inquiryReceived: 'Povpraševanje prejeto!',
    thankYou: 'Hvala, {{name}}. Naša ekipa vas bo kmalu kontaktirala glede vašega dogodka.',
    sendAnother: 'Pošlji novo povpraševanje',
    fullName: 'Polno Ime',
    email: 'Email Naslov',
    phone: 'Telefonska Številka',
    eventType: 'Vrsta Dogodka',
    selectEventType: 'Izberite vrsto dogodka',
    optWedding: 'Poroka',
    optCorporate: 'Poslovni Dogodek',
    optPrivate: 'Zasebna Zabava',
    optCultural: 'Kulturni Dogodek',
    optOther: 'Drugo',
    guests: 'Pričakovano Število Gostov',
    preferredDate: 'Želeni Datum',
    additionalInfo: 'Dodatne Informacije',
    submitting: 'Pošiljanje...',
    submit: 'Pošlji Povpraševanje',
    sending: 'Pošiljanje...',
    errName: 'Vnesite svoje polno ime.',
    errEmail: 'Vnesite veljaven email naslov.',
    errPhone: 'Vnesite veljavno telefonsko številko.',
    errEventType: 'Izberite vrsto dogodka.',
    errGuests: 'Vnesite število gostov med 1 in 500.',
    errDateRequired: 'Izberite želeni datum.',
    errDateFuture: 'Želeni datum mora biti v prihodnosti.',
    errFixFields: 'Prosimo, popravite označena polja.',
    errGeneric: 'Nekaj je šlo narobe. Prosimo, poskusite znova.',
    errNetwork: 'Napaka pri povezavi. Prosimo, poskusite znova.'
  }
}

const en: Dict = {
  nav: {
    home: 'Home',
    pizzeria: 'Pizzeria',
    club: 'Club',
    events: 'Events',
    buyouts: 'Private Hire',
    admin: 'Admin'
  },
  header: {
    orderNow: 'Order & pick up',
    bookTable: 'Book a table'
  },
  hero: {
    title: 'Grad Kodeljevo',
    tagline: 'Pizza bistro & dance bar at Kodeljevo castle',
    address: 'Ulica Carla Benza 20, 1000 Ljubljana',
    orders: 'Orders',
    menu: 'View Menu',
    events: 'Club Culture & Events'
  },
  home: {
    dayTitle: 'Pizza Bistro by day',
    dayP: 'By day, Grad Kodeljevo comes alive as a relaxed pizza bistro. We serve fresh hand-stretched pizza dough, top Italian ingredients (San Marzano pelati, Buffalo D.O.P mozzarella, Mortadella D.O.P, fresh panuozzo sandwiches) as well as stews and salads.',
    dayF1: 'Hand-stretched Neapolitan pizzas and Panuozzo sandwiches',
    dayF2: 'Personal pick-up option ("Order & pick up")',
    dayF3: 'Historic setting with an expansive outdoor garden',
    dayCta: 'Full Menu & Prices →',
    nightTitle: 'Dance Bar by night',
    nightP: 'On Friday and weekend nights, the castle spaces transform into an underground club with an exceptional sound experience. Klipsch La Scala sound and a carefully chosen music program create unforgettable nights.',
    nightF1: 'Audiophile Klipsch La Scala sound system',
    nightF2: 'Friday & Saturday parties (open until 05:00)',
    nightF3: 'Great selection of house cocktails, wines and craft beers',
    nightCta: 'Events Calendar →',
    upcomingTitle: 'Upcoming Events',
    noEvents: 'No upcoming events planned right now.',
    noEvents2: 'Follow our calendar or visit us on weekends.',
    retry: 'Retry',
    viewOnRA: 'View on RA →',
    featuredBy: 'Featuring: ',
    fallbackDesc: 'Join us for a night at Kader Grad Kodeljevo.',
    viewRA: 'More about the event (RA) →',
    visitLabel: 'Location & Opening Hours',
    visitTitle: 'Visit us at Grad Kodeljevo',
    visitP: 'We are located at Ulica Carla Benza 20 in Ljubljana. For takeaway food orders call {food}; for table reservations call {table}.',
    openMaps: 'Open Google Maps ↗',
    hoursTitle: 'Current Opening Hours (Google)',
    monWed: 'Monday – Wednesday',
    thu: 'Thursday',
    fri: 'Friday (Club night)',
    sat: 'Saturday',
    sun: 'Sunday'
  },
  footer: {
    tagline: 'Pizza bistro & dance bar at Kodeljevo castle. Pizzeria by day, club culture by night in a historic setting.',
    quickLinks: 'Quick Links',
    contacts: 'Contact & Orders',
    pickUp: 'Order & pick up:',
    tableRes: 'Table reservations:',
    hours: 'Opening Hours (Google)',
    kitchenNote: '* Kitchen open 12:00–22:00',
    rights: 'All rights reserved.',
    priceNote: 'Price list valid from 06.09.2024. Prices in € incl. VAT.'
  },
  // ── Pizzeria page ──
  pizzeria: {
    tagline: 'Pizza bistro & dance bar at Kodeljevo castle',
    locationLine: 'Ulica Carla Benza 20, 1000 Ljubljana • Kitchen open 12:00 – 22:00',
    pickUp: 'Order & pick up',
    tableRes: 'Book a table',
    digitalMenu: 'Digital Menu',
    printedMenu: 'Original Printed Menu (A3)',
    printedCaption: 'Showing the official price list at Grad Kodeljevo',
    openFullSize: 'Open full-size image ↗',
    zoomedAlt: 'Kader pizzeria menu (zoomed)',
    allergenNote: 'A list of allergens in food and drink is available from our bar staff.',
    hoursNote: 'Bar open 09:00 – 22:00 (later on weekends) • Kitchen open 12:00 – 22:00.',
    companyLine: 'Kader d.o.o. • Ulica Carla Benza 20, 1000 Ljubljana • SI45321361',
    // Category names (kept bilingual)
    catPizza: 'Pizzas',
    catPanuozzo: 'Panuozzo Sandwiches',
    catStews: 'Stews / Soups',
    catMains: 'Mains',
    catSalads: 'Salads',
    catSides: 'Sides',
    catDesserts: 'Desserts',
    catDrinks: 'Drinks & Cocktails',
    reviewsTitle: 'Guest Reviews (Google)',
    reviewsSubtitle: 'Authentic guest reviews and ratings from Google Business profile Kader Grad Kodeljevo',
    viewGoogle: 'Review us on Google Maps ↗',
    ratingLabel: 'Rated 4.8 / 5.0 based on 120+ Google reviews'
  },
  // ── Club page ──
  club: {
    location: 'Grad Kodeljevo · Ljubljana',
    heroTagline: 'Electronic music. Live acts. Everyone’s welcome.',
    theVenue: 'The Venue',
    venueTitle: 'A castle, minutes from Ljubljana’s centre',
    venueP1: 'Kader is a club set within a historic castle. We play',
    venueP1Accent: 'electronic music and host live acts',
    venueP2: 'Inclusive, LGBT-friendly, and for everyone. Come as you are; the night is open.',
    venueBasement: 'Basement club',
    venueFloor: 'Dance floor & bar',
    venueGarden: 'Summer garden',
    exploreSpaces: 'Explore the spaces',
    spacesTitle: 'Four worlds in one castle',
    space01Title: 'The Basement Club',
    space01Desc: 'Descend into the vaulted basement — an intimate, immersive room for electronics and heavy-hitting sets.',
    space02Title: 'The Floor & Cocktail Bar',
    space02Desc: 'A ground-level dance floor with a dedicated cocktail bar, engineered for music and conversation alike.',
    space03Title: 'The Summer Garden',
    space03Desc: 'An expansive outdoor garden that opens up in the warm months — for daytime hangs and balmy night sets.',
    space04Title: 'The Pizzeria',
    space04Desc: 'Our on-site pizzeria keeps the night fuelled with fire-baked pizzas from the castle kitchen.',
    theSound: 'The Sound',
    soundTitle: 'Custom, high-fidelity systems in both indoor rooms',
    soundP1: 'Both indoor rooms are powered by dedicated, custom-engineered audio rigs built for clarity and body — engineered to fill the castle’s stone vaults without a hint of distortion.',
    soundP2: 'The centrepiece is the <strong>Klipsch La Scala AL6</strong>: a fully horn-loaded, three-way loudspeaker chosen for its efficiency and punch in this historic space.',
    hideSpecs: 'Hide specs',
    viewSpecs: 'View technical specs',
    tapReveal: 'Tap to reveal the engineering behind the sound.',
    ourPromise: 'Our Promise',
    saferSpaces: 'Safer Spaces',
    safeIntro: 'A club is only as good as how safe everyone feels inside it. These are the ground rules we hold for every night, every dance floor, every room of the castle.',
    safeOutro: 'We’ll always be learning, and hope you will too. If anything — or anyone — makes you feel unsafe, tell our staff. We take it seriously.',
    rule01Title: 'Respect & consent',
    rule01Text: 'Ask before you touch. No means no. Space, consent and boundaries are non-negotiable — for everyone, every time.',
    rule02Title: 'Check your assumptions',
    rule02Text: 'Leave assumptions at the door. We’re inclusive of every background, identity, and belief — including how you read yours and other people’s.',
    rule03Title: 'Know your impact',
    rule03Text: 'Watch your space, your noise, and your energy. How you behave shapes the night for the people around you.',
    rule04Title: 'Honour privacy',
    rule04Text: 'What happens on the floor stays on the floor. Respect that everyone’s presence here is their own business.',
    rule05Title: 'Respect the door',
    rule05Text: 'Our door policy balances safety and freedom for all. It exists to keep the space open and welcoming — and we hold it firmly.',
    lineup: 'Lineup',
    upcomingNights: 'Upcoming Nights',
    viewAllRA: 'View all on Resident Advisor →',
    noNights: 'No club nights scheduled right now.',
    newLineups: 'New lineups sync here automatically.',
    tickets: 'Tickets →',
    privateHire: 'Private Hire',
    takeoverTitle: 'Take over the castle',
    takeoverP: 'Transform your occasion into an unforgettable night in our historic venue.',
    bookVenue: 'Book the venue',
    retry: 'Retry',
    loadLineupError: 'We couldn’t load the club lineup right now.'
  },
  // ── Events page ──
  events: {
    pageTitle: 'Events Calendar',
    pageDesc: 'Join us for exciting events at Kader Grad Kodeljevo — from live music to cultural evenings.',
    upcoming: 'Upcoming Events',
    syncedFromRA: '',
    allEvents: 'All Events',
    filterPizzeria: 'Pizzeria',
    filterClub: 'Club',
    filterLive: 'Live',
    noUpcoming: 'No upcoming events{{filter}}.',
    newEventsSync: 'New events will sync here as soon as they’re posted.',
    viewAll: 'View all events',
    pastEvents: 'Past Events',
    viewOnRA: 'View on Resident Advisor',
    featuredBy: 'Featuring: ',
    fallbackDesc: 'Join us for a night at Kader Grad Kodeljevo.',
    ticketsTitle: 'Tickets & Booking',
    buyHere: 'Buy tickets right here on each event card — secure, with QR check-in at the door.',
    alsoRA: 'Also discover events and browse the full lineup on our Resident Advisor page.',
    raPage: 'Resident Advisor page'
  },
  // ── Buyouts page ──
  buyouts: {
    pageTitle: 'Private Hire & Buyouts',
    pageDesc: 'Transform your special occasion into an unforgettable experience in our historic castle venue.',
    venueOverview: 'Venue Overview',
    venueP: 'Our castle venue offers a unique blend of historic charm and modern amenities for your private event. With its stunning architecture and intimate atmosphere, it’s the perfect setting for weddings, corporate events, or special celebrations.',
    venueFeatures: 'Venue Features',
    feat1: 'Historic castle setting with stone walls and vaulted ceilings',
    feat2: 'Capacity for 100–300 guests depending on event type',
    feat3: 'Professional catering services available',
    feat4: 'On-site parking and accessibility',
    feat5: 'Sound system and lighting equipment included',
    eventTypes: 'Event Types',
    weddings: 'Weddings',
    weddingsDesc: 'Elegant ceremonies and receptions in our historic castle halls.',
    corporate: 'Corporate Events',
    corporateDesc: 'Professional gatherings with unique historical backdrop.',
    privateParties: 'Private Parties',
    privatePartiesDesc: 'Intimate celebrations with personalized service.',
    cultural: 'Cultural Events',
    culturalDesc: 'Art exhibitions, concerts, and educational programs.',
    bookingProcess: 'Booking Process',
    booking1: 'Submit inquiry with event details and dates',
    booking2: 'Receive venue availability confirmation',
    booking3: 'Discuss customization options and pricing',
    booking4: 'Sign contract and secure deposit',
    booking5: 'Enjoy your special event!',
    tieredPricing: 'Tiered Pricing',
    basic: 'Basic Package',
    popular: 'MOST POPULAR',
    premium: 'Premium Package',
    luxury: 'Luxury Package',
    upTo: 'Up to {{n}} guests',
    basicCatering: 'Basic catering',
    fullCatering: 'Full catering service',
    luxuryCatering: 'Luxury catering',
    standardSound: 'Standard sound system',
    proSound: 'Professional sound system',
    fullSound: 'Full sound & lighting',
    basicDecor: 'Basic decoration',
    elegantDecor: 'Elegant decoration',
    customDecor: 'Custom decoration',
    specialistLighting: 'Specialist lighting',
    personalizedService: 'Personalized service',
    exclusiveAccess: 'Exclusive access',
    contactUs: 'Contact Us',
    requestQuote: 'Request a Quote',
    inquiryReceived: 'Inquiry received!',
    thankYou: 'Thank you, {{name}}. Our team will contact you shortly to discuss your event.',
    sendAnother: 'Send another inquiry',
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    eventType: 'Event Type',
    selectEventType: 'Select event type',
    optWedding: 'Wedding',
    optCorporate: 'Corporate Event',
    optPrivate: 'Private Party',
    optCultural: 'Cultural Event',
    optOther: 'Other',
    guests: 'Expected Number of Guests',
    preferredDate: 'Preferred Date',
    additionalInfo: 'Additional Information',
    submitting: 'Sending...',
    submit: 'Submit Inquiry',
    sending: 'Sending...',
    errName: 'Please enter your full name.',
    errEmail: 'Please enter a valid email address.',
    errPhone: 'Please enter a valid phone number.',
    errEventType: 'Please select an event type.',
    errGuests: 'Please enter a guest count between 1 and 500.',
    errDateRequired: 'Please choose a preferred date.',
    errDateFuture: 'The preferred date must be in the future.',
    errFixFields: 'Please fix the highlighted fields.',
    errGeneric: 'Something went wrong. Please try again.',
    errNetwork: 'Network error. Please try again.'
  }
}

const dictionaries: Record<Locale, Dict> = { sl, en }

const STORAGE_KEY = 'kader-lang'

function initialLocale(): Locale {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'sl' || saved === 'en') return saved
  }
  return 'sl'
}

export const locale = ref<Locale>(initialLocale())

export function useLocale() {
  const setLocale = (l: Locale) => {
    locale.value = l
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, l)
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = l
    }
  }

  function lookup(d: Dict, path: string[]): string | null {
    let node: string | Dict = d
    for (const key of path) {
      if (node && typeof node === 'object' && key in node) {
        node = (node as Dict)[key]
      } else {
        return null
      }
    }
    return typeof node === 'string' ? node : null
  }

  // t('nav.home') → translated string; falls back to the sl value, then the key.
  // Optional params: t('buyouts.upTo', { n: 100 })
  const t = (key: string, params?: Record<string, string | number>): string => {
    const path = key.split('.')
    const dict = dictionaries[locale.value]
    let found = lookup(dict, path)
    if (found === null) found = lookup(dictionaries.sl, path)
    let out = found ?? key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        out = out.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v))
      }
    }
    return out
  }

  return { locale, setLocale, t }
}