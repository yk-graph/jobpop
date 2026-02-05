import { z } from 'zod'

import { addressFields, companyNameField, descriptionField, phoneNumberField, urlOptionalField } from './fields'

/** 会社作成スキーマ */
export const createCompanySchema = z.object({
  companyName: companyNameField,
  companyDescription: descriptionField,
  companyWebsite: urlOptionalField,
  phoneNumber: phoneNumberField,
  ...addressFields,
})

export type CreateCompanySchemaType = z.infer<typeof createCompanySchema>

/** 会社更新スキーマ */
export const updateCompanySchema = z.object({
  companyName: companyNameField.optional(),
  companyDescription: descriptionField,
  companyWebsite: urlOptionalField,
  phoneNumber: phoneNumberField.optional(),
  ...Object.fromEntries(Object.entries(addressFields).map(([key, schema]) => [key, schema.optional()])),
})

export type UpdateCompanySchemaType = z.infer<typeof updateCompanySchema>
