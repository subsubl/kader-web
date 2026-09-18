import { ref, onMounted } from 'vue'

export interface SiteImagesConfig {
  home_hero_bg: string
  home_basement_bg: string
  home_second_floor_bg: string
  home_terrace_bg: string

  pizzeria_hero_bg: string
  pizzeria_showcase_1: string
  pizzeria_showcase_2: string

  club_hero_bg: string
  club_floor1_bg: string
  club_floor2_bg: string
  club_sound_system: string

  buyouts_hero_bg: string
  buyouts_booking_bg: string

  gallery_items: Array<{ src: string; label: string }>
}

const defaultImages: SiteImagesConfig = {
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

const siteImagesState = ref<SiteImagesConfig>({ ...defaultImages })
const isLoaded = ref(false)

export function useSiteImages() {
  const loadSiteImages = async () => { isLoaded.value = true }

  const getOptImg = (src: string, width = 800, quality = 80, format = 'webp') => {
    if (!src) return ''
    return assetUrl(src)
  }

  if (!isLoaded.value && typeof window !== 'undefined') {
    loadSiteImages()
  }

  return {
    siteImages: siteImagesState,
    loadSiteImages,
    getOptImg
  }
}
