// GET /api/menu-config — public menu configuration (currently the pizzeria menu image)
// Falls back to the built-in default menu image if no setting is stored yet.

import { createError } from '#imports'

const DEFAULT_MENU_IMAGE = '/kader/menu.jpg'

interface MenuConfig {
  menuImage: string
  updatedAt: string | null
}

export default defineEventHandler(async () => {
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
    // Non-fatal — fall back to default so the public menu always renders.
    console.error('[api] menu-config fallback to default:', (err as Error).message)
  }

  return <MenuConfig>{ menuImage, updatedAt }
})