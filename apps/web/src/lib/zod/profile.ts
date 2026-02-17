import { VisaType, SoftSkill } from '@prisma/client'
import { z } from 'zod'

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

export type InitialProfileSchemaType = z.infer<typeof initialProfileSchema>
