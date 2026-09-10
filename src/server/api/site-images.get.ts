import { defineEventHandler } from 'h3'
import fs from 'node:fs'
import path from 'node:path'

const CONFIG_FILE = path.resolve(process.cwd(), '.data/site_images.json')

export const defaultSiteImages = {
  home_hero_bg: '/hero-bg.jpg',
  home_basement_bg: '/images/instagram/ig_img_3.jpg',
  home_second_floor_bg: '/images/instagram/ig_img_7.jpg',
  home_terrace_bg: '/images/instagram/ig_img_5.jpg',
  
  pizzeria_hero_bg: '/images/instagram/ig_img_7.jpg',
  pizzeria_showcase_1: '/images/instagram/ig_img_7.jpg',
  pizzeria_showcase_2: '/images/instagram/ig_img_13.jpg',

  club_hero_bg: '/images/instagram/ig_img_10.jpg',
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

export default defineEventHandler(async () => {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'))
      return { ...defaultSiteImages, ...data }
    } catch (e) {
      console.error('[site-images] Error parsing config:', e)
    }
  }
  return defaultSiteImages
})
