import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ScannerClient } from './page-client'

export default async function ScannerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user has staff or admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'staff' && profile.role !== 'admin')) {
    redirect('/dashboard')
  }

  return <ScannerClient userName={user.email || 'Staff'} />
}
