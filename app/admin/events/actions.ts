'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/admin'
import { eventFormSchema } from '@/lib/validations/event'
import { revalidatePath } from 'next/cache'

export async function createEvent(formData: FormData) {
  await requireAdmin()
  
  const data = {
    title: formData.get('title') as string,
    date: formData.get('date') as string,
    location: formData.get('location') as string,
    is_active: formData.get('is_active') === 'true',
  }

  const validated = eventFormSchema.parse(data)
  
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('events')
    .insert([validated])

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/events')
  return { success: true }
}

export async function updateEvent(id: string, formData: FormData) {
  await requireAdmin()
  
  const data = {
    title: formData.get('title') as string,
    date: formData.get('date') as string,
    location: formData.get('location') as string,
    is_active: formData.get('is_active') === 'true',
  }

  const validated = eventFormSchema.parse(data)
  
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('events')
    .update(validated)
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/events')
  return { success: true }
}

export async function deleteEvent(id: string) {
  await requireAdmin()
  
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/events')
  return { success: true }
}

export async function toggleEventStatus(id: string, isActive: boolean) {
  await requireAdmin()
  
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('events')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/events')
  return { success: true }
}
