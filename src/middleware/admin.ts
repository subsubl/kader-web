// Nuxt route middleware (UX guard) — protects /admin/* navigation on the client.
// NOTE: the authoritative security gate is src/server/middleware/admin.ts (Nitro),
// which runs server-side before SSR. This only improves the in-app redirect UX.

export default defineNuxtRouteMiddleware(async (to) => {
  // Only run client-side (the $supabase plugin is client-only)
  if (process.client !== true) {
    return
  }

  const path = to.path
  if (!path.startsWith('/admin/') || path.startsWith('/admin/login')) {
    return
  }

  try {
    const { $supabase } = useNuxtApp()
    if (!$supabase) {
      return navigateTo('/admin/login')
    }
    const { data: { user } } = await $supabase.auth.getUser()
    if (!user) {
      return navigateTo('/admin/login')
    }
    const { data: userRole } = await $supabase
      .from('users_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()
    if (!userRole || userRole.role !== 'admin') {
      return navigateTo('/admin/login?error=unauthorized')
    }
  } catch {
    return navigateTo('/admin/login')
  }
})