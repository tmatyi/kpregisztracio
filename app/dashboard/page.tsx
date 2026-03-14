import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from './page-client'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's orders with event details
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      event_id,
      email,
      total_amount,
      type,
      status,
      qr_token,
      created_at,
      events (
        id,
        title,
        date,
        location
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
  }

  return <DashboardClient orders={orders || []} userEmail={user.email || ''} />
}
