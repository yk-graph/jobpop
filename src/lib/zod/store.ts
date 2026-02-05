import { z } from 'zod'

import {
  addressFields,
  descriptionField,
  phoneNumberOptionalField,
  storeNameField,
  urlOptionalField,
} from './fields'

// 店舗スキーマ

/** 店舗作成スキーマ */
export const createStoreSchema = z.object({
  storeName: storeNameField,
  storeDescription: descriptionField,
  storeWebsite: urlOptionalField,
  phoneNumber: phoneNumberOptionalField,
  ...addressFields,
})

export type CreateStoreSchemaType = z.infer<typeof createStoreSchema>

/** 店舗更新スキーマ */
export const updateStoreSchema = z.object({
  storeName: storeNameField.optional(),
  storeDescription: descriptionField,
  storeWebsite: urlOptionalField,
  phoneNumber: phoneNumberOptionalField,
  postalCode: addressFields.postalCode.optional(),
  country: addressFields.country.optional(),
  province: addressFields.province.optional(),
  city: addressFields.city.optional(),
  streetAddress: addressFields.streetAddress.optional(),
  floor: addressFields.floor,
  unit: addressFields.unit,
})

export type UpdateStoreSchemaType = z.infer<typeof updateStoreSchema>
