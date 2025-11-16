import { VisaType, IndustryType, EmploymentType } from '@prisma/client'
import { z } from 'zod'

const emailValidation = z.email('email is invalid').min(1, 'email is required')

const passwordValidation = z
  .string()
  .min(8, 'password must be at least 8 characters long')
  .max(20, 'password must be at most 20 characters long')
  .regex(/(?=.*[a-z])/, 'password must contain at least one lowercase letter')
  .regex(/(?=.*[A-Z])/, 'password must contain at least one uppercase letter')
  .regex(/(?=.*[0-9])/, 'password must contain at least one number')

export const registerSchema = z
  .object({
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: z.string().min(1, 'confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'passwords do not match',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
})

export const initialProfileSchema = z.object({
  stepCount: z.number().min(1).max(3),
  name: z
    .string()
    .min(4, 'name must be at least 4 characters long')
    .max(100, 'name must be at most 100 characters long'),
  countryCode: z.string().min(2, 'country code is required'),
  birthYear: z
    .number('birth year must be a number')
    .min(1900, 'birth year must be at least 1900')
    .max(new Date().getFullYear(), `birth year cannot be in the future`),
  visaType: z.enum(VisaType).describe('visa type is required'),
  bio: z.string().max(400, 'bio must be at most 400 characters long').optional(),
  linkedin: z.string().max(100, 'linkedin profile must be at most 100 characters long').optional(),
  instagram: z.string().max(100, 'instagram handle must be at most 100 characters long').optional(),
  whatsapp: z.string().max(100, 'whatsapp contact must be at most 100 characters long').optional(),
  // User's experiences - 0個以上10個以下の経験（MstExperienceTypeのIDを参照）
  experienceTypeIds: z.array(z.string().min(1, 'invalid experience type ID'))
    .min(0, 'experiences must be at least 0')
    .max(10, 'experiences must be at most 10')
    .optional(),
})

export type RegisterSchemaType = z.infer<typeof registerSchema>
export type LoginSchemaType = z.infer<typeof loginSchema>
export type InitialProfileSchemaType = z.infer<typeof initialProfileSchema>
