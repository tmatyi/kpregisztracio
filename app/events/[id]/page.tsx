import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EventDetailClient } from './page-client'

interface EventPageProps {
  params: {
    id: string
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const supabase = await createClient()
  
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!event) {
    notFound()
  }

  const { data: { user } } = await supabase.auth.getUser()

  return <EventDetailClient event={event} isLoggedIn={!!user} />
}
