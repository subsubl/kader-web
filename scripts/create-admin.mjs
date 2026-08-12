import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.NUXT_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey || supabaseUrl.includes('placeholder')) {
  console.error('❌ Error: Valid NUXT_PUBLIC_SUPABASE_URL and NUXT_SUPABASE_SERVICE_KEY must be set in your .env file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  const email = process.argv[2] || 'subsubl@gmail.com'
  const password = process.argv[3] || 'Vpzgn10p.'

  console.log(`⏳ Creating/updating admin user: ${email}...`)

  // 1. Create or get user in Supabase Auth
  let userId = null

  const { data: createData, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (createError) {
    if (createError.message.includes('already registered') || createError.status === 422) {
      console.log('ℹ️ User already registered in Auth. Finding existing user...')
      const { data: usersData, error: listError } = await supabase.auth.admin.listUsers()
      if (listError) {
        console.error('❌ Failed to list users:', listError.message)
        process.exit(1)
      }
      const existingUser = usersData.users.find(u => u.email === email)
      if (existingUser) {
        userId = existingUser.id
        // Update password for existing user
        await supabase.auth.admin.updateUserById(userId, { password })
        console.log('✅ Password updated for existing user.')
      } else {
        console.error('❌ User exists but could not be retrieved.')
        process.exit(1)
      }
    } else {
      console.error('❌ Error creating user:', createError.message)
      process.exit(1)
    }
  } else {
    userId = createData.user.id
    console.log('✅ User created successfully in Supabase Auth.')
  }

  // 2. Assign admin role in users_roles table
  const { data: existingRole } = await supabase
    .from('users_roles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (existingRole) {
    if (existingRole.role !== 'admin') {
      const { error: updateRoleErr } = await supabase
        .from('users_roles')
        .update({ role: 'admin' })
        .eq('user_id', userId)

      if (updateRoleErr) {
        console.error('❌ Error updating user role:', updateRoleErr.message)
      } else {
        console.log('✅ User role updated to admin in users_roles table.')
      }
    } else {
      console.log('✅ User already has admin role in users_roles table.')
    }
  } else {
    const { error: insertRoleErr } = await supabase
      .from('users_roles')
      .insert([{ user_id: userId, role: 'admin' }])

    if (insertRoleErr) {
      console.error('❌ Error inserting admin role into users_roles:', insertRoleErr.message)
    } else {
      console.log('✅ User assigned admin role in users_roles table.')
    }
  }

  console.log(`\n🎉 Success! You can now sign in at /admin/login with:`)
  console.log(`   Email: ${email}`)
  console.log(`   Password: ${password}`)
}

createAdminUser()
