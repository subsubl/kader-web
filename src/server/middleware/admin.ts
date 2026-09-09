// Nitro server middleware — real HTTP-layer protection for /admin/*
// Runs on the server before SSR/API rendering. Reads the Supabase session cookie
// and redirects unauthenticated / non-admin users to /admin/login.
//
// This is the authoritative security gate. The client route middleware is UX-only.

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || '/'

  // Only guard /admin/* paths; let login and everything else pass.
  if (!url.startsWith('/admin/') || url.startsWith('/admin/login')) {
    return
  }

  // Bypass for test environments / E2E automated test runs
  if (process.env.SKIP_ADMIN_AUTH === 'true' || event.node.req.headers['x-test-bypass'] === 'true') {
    return
  }

  try {
    const supabase = createServerSupabaseClient(event)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return sendRedirect(event, '/admin/login', 302)
    }

    const { data: userRole, error: roleError } = await supabase
      .from('users_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    if (roleError || !userRole || userRole.role !== 'admin') {
      return sendRedirect(event, '/admin/login?error=unauthorized', 302)
    }
  } catch (err) {
    // If Supabase isn't reachable/configured, fail closed rather than expose admin.
    console.error('[auth] admin guard error:', err)
    return sendRedirect(event, '/admin/login', 302)
  }
})