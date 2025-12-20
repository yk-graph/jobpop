import { VisaType, SoftSkill } from '@prisma/client'
import { z } from 'zod'

const emailValidation = z.email('email is invalid').min(1, 'email is required')

export const passwordValidation = z
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

export const resendSchema = z.object({
  email: emailValidation,
})

export const forgotPasswordSchema = z.object({
  email: emailValidation,
})

export const resetPasswordSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: z.string().min(1, 'confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'passwords do not match',
    path: ['confirmPassword'],
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
  experienceTypeIds: z
    .array(z.string().min(1, 'invalid experience type ID'))
    .max(10, 'experiences must be at most 10')
    .optional(),
  softSkills: z.array(z.enum(SoftSkill)).max(7, 'soft skills must be at most 7').optional(),
})

export const initialOwnerSchema = z.object({
  stepCount: z.number().min(1).max(2),
  companyName: z
    .string()
    .min(2, 'company name must be at least 2 characters long')
    .max(255, 'company name must be at most 255 characters long'),
  companyDescription: z.string().max(400, 'description must be at most 400 characters long').optional(),
  companyWebsite: z
    .url('invalid URL')
    .max(255, 'website URL must be at most 255 characters')
    .optional()
    .or(z.literal('')), // Tips: .url でURL形式をチェックするが、空文字も許可したいため .or(z.literal('')) を追加して双方の条件を満たすようにするテクニック
  employeeEmails: z.array(z.string().email('invalid email')).max(10, 'maximum 10 employees').optional(),
})

export type RegisterSchemaType = z.infer<typeof registerSchema>
export type LoginSchemaType = z.infer<typeof loginSchema>
export type ResendSchemaType = z.infer<typeof resendSchema>
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>
export type InitialProfileSchemaType = z.infer<typeof initialProfileSchema>
export type InitialOwnerSchemaType = z.infer<typeof initialOwnerSchema>
