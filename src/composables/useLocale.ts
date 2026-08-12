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
  const t = (key: string): string | null => {
    const path = key.split('.')
    const dict = dictionaries[locale.value]
    const found = lookup(dict, path)
    if (found !== null) return found
    const slFallback = lookup(dictionaries.sl, path)
    return slFallback
  }

  return { locale, setLocale, t }
}