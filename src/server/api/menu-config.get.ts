// GET /api/menu-config — public menu configuration (currently the pizzeria menu image)
// Falls back to the built-in default menu image if no setting is stored yet.

import { defineEventHandler } from 'h3'
import { getAdminSupabase } from '../utils/supabase'
import { handleCachedJsonRequest } from '../utils/cache'

const DEFAULT_MENU_IMAGE = '/kader/menu.jpg'

interface MenuConfig {
  menuImage: string
  updatedAt: string | null
}

const defaultMenuConfig: MenuConfig = {
  menuImage: DEFAULT_MENU_IMAGE,
  updatedAt: null
}

export default defineEventHandler(async (event) => {
  return handleCachedJsonRequest(event, {
    key: 'menu-config',
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
          if (typeof v.menuImage === 'string' && v.menuImage) {
            menuImage = v.menuImage
            updatedAt = data.updated_at
          }
        }
      } catch (err) {
        console.error('[api] menu-config database query error:', (err as Error).message)
      }

      return <MenuConfig>{ menuImage, updatedAt }
    },
    fallback: defaultMenuConfig
  })
})