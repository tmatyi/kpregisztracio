import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CheckoutPageClient } from './page-client'

export default async function CheckoutPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  return <CheckoutPageClient user={user} />
}
