import { z } from 'zod'

export const individualChildSchema = z.object({
  holder_name: z.string().min(2, 'Name must be at least 2 characters'),
  holder_age: z.number().min(1).max(17, 'Age must be between 1 and 17'),
  parent_name: z.string().min(2, 'Parent name must be at least 2 characters'),
  holder_phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  holder_address: z.string().min(5, 'Address must be at least 5 characters'),
  email: z.string().email('Invalid email address'),
})

export const individualAdultSchema = z.object({
  holder_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  holder_phone: z.string().min(10, 'Phone number must be at least 10 digits'),
})

export const groupChildSchema = z.object({
  holder_name: z.string().min(2, 'Name must be at least 2 characters'),
  holder_age: z.number().min(1).max(17, 'Age must be between 1 and 17'),
})

export const groupAdultSchema = z.object({
  holder_name: z.string().min(2, 'Name must be at least 2 characters'),
})

export const checkoutFormSchema = z.object({
  event_id: z.string().uuid('Invalid event ID'),
  email: z.string().email('Invalid email address'),
  tickets: z.array(
    z.discriminatedUnion('type', [
      z.object({
        type: z.literal('individual_child'),
        data: individualChildSchema,
      }),
      z.object({
        type: z.literal('individual_adult'),
        data: individualAdultSchema,
      }),
      z.object({
        type: z.literal('group_child'),
        data: groupChildSchema,
      }),
      z.object({
        type: z.literal('group_adult'),
        data: groupAdultSchema,
      }),
    ])
  ).min(1, 'At least one ticket is required'),
})

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>
export type IndividualChildData = z.infer<typeof individualChildSchema>
export type IndividualAdultData = z.infer<typeof individualAdultSchema>
export type GroupChildData = z.infer<typeof groupChildSchema>
export type GroupAdultData = z.infer<typeof groupAdultSchema>
