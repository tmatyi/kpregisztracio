import { z } from 'zod'

export const eventFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  is_active: z.boolean().default(true),
})

export type EventFormData = z.infer<typeof eventFormSchema>
