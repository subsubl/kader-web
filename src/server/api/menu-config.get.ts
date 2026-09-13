// GET /api/menu-config — public menu configuration (image, title, notes, and currency)
// Localized cache key: menu-config:${locale} to prevent cross-language cache pollution.

import { defineEventHandler } from 'h3'
import { getAdminSupabase } from '../utils/supabase'
import { handleCachedJsonRequest } from '../utils/cache'
import { resolveApiLocale, apiMessages } from '../utils/locale'

const DEFAULT_MENU_IMAGE = '/kader/menu.jpg'

export interface LocalizedMenuConfig {
  menuImage: string
  updatedAt: string | null
  locale: string
  title: string
  currency: string
  vatNote: string
  kitchenHoursNote: string
  allergensNote: string
}

export default defineEventHandler(async (event) => {
  const locale = resolveApiLocale(event)
  const dict = apiMessages[locale].menuConfig

  return handleCachedJsonRequest(event, {
    key: `menu-config:${locale}`,
    maxAge: 3600,
    staleWhileRevalidate: 86400,
    fetcher: async () => {
      let menuImage = DEFAULT_MENU_IMAGE
      let updatedAt: string | null = null

      try {
        const supabase = getAdminSupabase()
        const { data, error } = await supabase
          .from('site_settings')
          .select('value, updated_at')
          .eq('key', 'pizzeria_menu')
          .maybeSingle()

        if (!error && data?.value && typeof data.value === 'object' && 'menuImage' in data.value) {
          const v = data.value as Record<string, unknown>
          const localizedImageKey = `menuImage_${locale}`
          if (typeof v[localizedImageKey] === 'string' && v[localizedImageKey]) {
            menuImage = v[localizedImageKey] as string
          } else if (typeof v.menuImage === 'string' && v.menuImage) {
            menuImage = v.menuImage
          }
          updatedAt = data.updated_at
        }
      } catch (err) {
        console.error('[api] menu-config database query error:', (err as Error).message)
      }

      return <LocalizedMenuConfig>{
        menuImage,
        updatedAt,
        locale,
        title: dict.title,
        currency: 'EUR',
        vatNote: dict.vatNote,
        kitchenHoursNote: dict.kitchenHoursNote,
        allergensNote: dict.allergensNote
      }
    },
    fallback: <LocalizedMenuConfig>{
      menuImage: DEFAULT_MENU_IMAGE,
      updatedAt: null,
      locale,
      title: dict.title,
      currency: 'EUR',
      vatNote: dict.vatNote,
      kitchenHoursNote: dict.kitchenHoursNote,
      allergensNote: dict.allergensNote
    }
  })
})