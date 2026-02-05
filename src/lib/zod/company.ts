import { z } from 'zod'

export const initialOwnerSchema = z.object({
  userName: z
    .string()
    .min(4, 'name must be at least 4 characters long')
    .max(100, 'name must be at most 100 characters long'),
  companyName: z
    .string()
    .min(2, 'company name must be at least 2 characters long')
    .max(255, 'company name must be at most 255 characters long')
    .regex(
      /^[A-Za-z0-9\s&\-.,]+$/,
      'company name must contain only English letters, numbers, and symbols (&, -, ., ,)'
    ),
  companyDescription: z.string().max(400, 'description must be at most 400 characters long').optional(),
  companyWebsite: z
    .url('invalid URL')
    .max(255, 'website URL must be at most 255 characters')
    .optional()
    .or(z.literal('')), // Tips: .url でURL形式をチェックするが、空文字も許可したいため .or(z.literal('')) を追加して双方の条件を満たすようにするテクニック
  phoneNumber: z.string().min(1, 'phone number is required').max(50, 'phone number must be at most 50 characters'),
  postalCode: z.string().min(1, 'postal code is required').max(20, 'postal code must be at most 20 characters'),
  country: z.string().min(1, 'country is required').max(100, 'country must be at most 100 characters'),
  province: z.string().min(1, 'province is required').max(100, 'province must be at most 100 characters'),
  city: z.string().min(1, 'city is required').max(100, 'city must be at most 100 characters'),
  streetAddress: z
    .string()
    .min(1, 'street address is required')
    .max(255, 'street address must be at most 255 characters'),
  floor: z.string().max(50, 'floor must be at most 50 characters').optional(),
  unit: z.string().max(50, 'unit must be at most 50 characters').optional(),
})

export type InitialOwnerSchemaType = z.infer<typeof initialOwnerSchema>
