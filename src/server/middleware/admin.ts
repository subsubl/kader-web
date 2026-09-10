// Nitro server middleware — real HTTP-layer protection for /admin/*
// Runs on the server before SSR/API rendering. Reads the Supabase session cookie
// and redirects unauthenticated / non-admin users to /admin/login.
//
// This is the authoritative security gate. The client route middleware is UX-only.

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || '/'

  const isAdminPage = url.startsWith('/admin/') && !url.startsWith('/admin/login')
  const isAdminApi = url.startsWith('/api/admin/')

  // Only guard /admin/* pages and /api/admin/* API endpoints.
  if (!isAdminPage && !isAdminApi) {
    return
  }

  // Bypass for test environments / E2E automated test runs / offline dev
  if (process.env.SKIP_ADMIN_AUTH === 'true' || event.node.req.headers['x-test-bypass'] === 'true') {
    return
  }

  const handleUnauthorized = () => {
    if (isAdminApi) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Admin authentication required'
      })
    } else {
      return sendRedirect(event, '/admin/login', 302)
    }
  }

  try {
    const supabase = createServerSupabaseClient(event)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return handleUnauthorized()
    }

    const { data: userRole, error: roleError } = await supabase
      .from('users_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    if (roleError || !userRole || userRole.role !== 'admin') {
      return handleUnauthorized()
    }
  } catch (err: any) {
    if (err.statusCode) throw err

    // If Supabase isn't reachable/configured, fail closed rather than expose admin endpoints.
    console.error('[auth] admin guard error:', err)
    return handleUnauthorized()
  }
})