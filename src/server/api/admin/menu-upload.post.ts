// POST /api/admin/menu-upload — upload a new pizzeria menu image (admin only)
// Self-authorizes (session + admin role), saves the file to the 'menu_images'
// Supabase Storage bucket via the service-role client, returns the public URL.

import { createError } from '#imports'

const BUCKET = 'menu_images'
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp'])
const EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }

export default defineEventHandler(async (event) => {
  // --- Authorization: valid session + admin role ---
  const supabase = createServerSupabaseClient(event)
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated.' })
  }
  const { data: role } = await supabase
    .from('users_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!role || role.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required.' })
  }

  // --- Parse multipart file ---
  const formData = await readMultipartFormData(event).catch(() => null)
  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded.' })
  }

  const file = formData.find((f) => f.name === 'file' && f.data && f.data.length > 0)
  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded.' })
  }

  const mime = file.type || ''
  if (!ALLOWED.has(mime)) {
    throw createError({ statusCode: 422, statusMessage: 'File must be a JPEG, PNG or WebP image.' })
  }
  if (file.data.length > MAX_BYTES) {
    throw createError({ statusCode: 422, statusMessage: 'File must be under 10 MB.' })
  }

  // --- Upload via service role ---
  const admin = getAdminSupabase()
  const ext = EXT[mime]
  const name = `menu-${Date.now()}.${ext}`
  const { data, error } = await admin.storage
    .from(BUCKET)
    .upload(name, file.data, { contentType: mime, upsert: true })

  if (error) {
    console.error('[api] menu upload failed:', error.message)
    throw createError({ statusCode: 500, statusMessage: 'Upload failed. Please try again.' })
  }

  const publicUrl = admin.storage.from(BUCKET).getPublicUrl(data.path).data.publicUrl
  return { ok: true, url: publicUrl }
})