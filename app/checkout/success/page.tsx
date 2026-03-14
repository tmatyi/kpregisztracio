import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { SuccessPageClient } from './page-client'

interface SuccessPageProps {
  searchParams: {
    orderId?: string
  }
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const orderId = searchParams.orderId

  if (!orderId) {
    notFound()
  }

  const supabase = await createClient()
  
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      events (
        id,
        title,
        date,
        location
      )
    `)
    .eq('id', orderId)
    .single()

  if (!order) {
    notFound()
  }

  const { data: orderItems } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId)

  return <SuccessPageClient order={order} orderItems={orderItems || []} />
}
