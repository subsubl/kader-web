import { defineEventHandler } from 'h3'
import path from 'node:path'
import { handleCachedJsonRequest } from '../utils/cache'
import { readJson } from '../utils/fileStore'
import { resolveApiLocale } from '../utils/locale'

const CONFIG_FILE = path.resolve(process.cwd(), '.data/site_images.json')

const GALLERY_TRANSLATIONS: Record<string, { sl: string; en: string }> = {
  '/images/instagram/ig_img_7.jpg': {
    sl: '🍕 Neapeljska Pica z Izbrano Rukolo',
    en: '🍕 Neapolitan Pizza with Fresh Rocket'
  },
  '/images/instagram/ig_img_13.jpg': {
    sl: '🥪 Panuozzo z Mortadelo & Burrato',
    en: '🥪 Panuozzo with Mortadella & Burrata'
  },
  '/images/instagram/ig_img_5.jpg': {
    sl: '🎉 Poletna Zabava na Terasi',
    en: '🎉 Summer Party on the Castle Terrace'
  },
  '/images/instagram/ig_img_3.jpg': {
    sl: '🎸 Koncert v Živo pod Grajskimi Drevesi',
    en: '🎸 Live Concert under Castle Trees'
  },
  '/pizzeria-bg.jpg': {
    sl: '🍷 Neapeljski Pica Bistro Ambient',
    en: '🍷 Neapolitan Pizza Bistro Ambiance'
  },
  '/buyout-bg.jpg': {
    sl: '🏰 Grajski Vrt Kodeljevo',
    en: '🏰 Grad Kodeljevo Castle Garden'
  }
}

export const defaultSiteImages = {
  home_hero_bg: '/hero-bg.jpg',
  home_basement_bg: '/images/instagram/ig_img_3.jpg',
  home_second_floor_bg: '/images/instagram/ig_img_7.jpg',
  home_terrace_bg: '/images/instagram/ig_img_5.jpg',
  
  pizzeria_hero_bg: '/images/instagram/ig_img_7.jpg',
  pizzeria_showcase_1: '/images/instagram/ig_img_7.jpg',
  pizzeria_showcase_2: '/images/instagram/ig_img_13.jpg',

  club_hero_bg: '/images/club-red-hero.jpg',
  club_floor1_bg: '/images/instagram/ig_img_3.jpg',
  club_floor2_bg: '/images/instagram/ig_img_5.jpg',
  club_sound_system: '/images/instagram/ig_img_6.jpg',

  buyouts_hero_bg: '/images/instagram/ig_img_5.jpg',
  buyouts_booking_bg: '/images/instagram/ig_img_3.jpg',

  gallery_items: [
    { src: '/images/instagram/ig_img_7.jpg', label: '🍕 Neapeljska Pica z Izbrano Rukolo' },
    { src: '/images/instagram/ig_img_13.jpg', label: '🥪 Panuozzo z Mortadelo & Burrato' },
    { src: '/images/instagram/ig_img_5.jpg', label: '🎉 Poletna Zabava na Terasi' },
    { src: '/images/instagram/ig_img_3.jpg', label: '🎸 Koncert v Živo pod Grajskimi Drevesi' },
    { src: '/pizzeria-bg.jpg', label: '🍷 Neapeljski Pica Bistro Ambient' },
    { src: '/buyout-bg.jpg', label: '🏰 Grajski Vrt Kodeljevo' }
  ]
}

function getLocalizedGallery(locale: 'sl' | 'en', items: Array<{ src: string; label: string }>) {
  return items.map((item) => {
    const trans = GALLERY_TRANSLATIONS[item.src]
    return {
      src: item.src,
      label: trans ? trans[locale] : item.label
    }
  })
}

export default defineEventHandler(async (event) => {
  const locale = resolveApiLocale(event)

  const localizedDefault = {
    ...defaultSiteImages,
    gallery_items: getLocalizedGallery(locale, defaultSiteImages.gallery_items)
  }

  return handleCachedJsonRequest(event, {
    key: `site-images:${locale}`,
    maxAge: 3600,
    staleWhileRevalidate: 86400,
    fetcher: async () => {
      const data = await readJson<Record<string, any>>(CONFIG_FILE, {})
      const merged = { ...defaultSiteImages, ...data }
      return {
        ...merged,
        gallery_items: getLocalizedGallery(locale, merged.gallery_items || defaultSiteImages.gallery_items)
      }
    },
    fallback: localizedDefault
  })
})
