import { z } from 'zod'

// 認証フィールド
export const emailField = z
  .string()
  .min(1, 'email is required')
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'invalid email format')

export const passwordField = z
  .string()
  .min(1, 'password is required')
  .min(8, 'password must be at least 8 characters')

// 名前フィールド
export const firstNameField = z
  .string()
  .min(1, 'first name is required')
  .max(50, 'first name must be at most 50 characters')

export const lastNameField = z
  .string()
  .min(1, 'last name is required')
  .max(50, 'last name must be at most 50 characters')

export const userNameField = z
  .string()
  .min(4, 'name must be at least 4 characters')
  .max(100, 'name must be at most 100 characters')

export const companyNameField = z
  .string()
  .min(2, 'company name must be at least 2 characters')
  .max(255, 'company name must be at most 255 characters')
  .regex(
    /^[A-Za-z0-9\s&\-.,]+$/,
    'company name must contain only English letters, numbers, and symbols (&, -, ., ,)'
  )

export const storeNameField = z
  .string()
  .min(2, 'store name must be at least 2 characters')
  .max(255, 'store name must be at most 255 characters')

// 連絡先フィールド
export const phoneNumberField = z
  .string()
  .min(1, 'phone number is required')
  .max(50, 'phone number must be at most 50 characters')

export const phoneNumberOptionalField = z
  .string()
  .max(50, 'phone number must be at most 50 characters')
  .optional()
  .or(z.literal(''))

// URLフィールド
const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/

/** 必須URLフィールド */
export const urlField = z
  .string()
  .regex(urlRegex, 'invalid URL')
  .max(255, 'URL must be at most 255 characters')

/** 任意URLフィールド（空文字許可） */
export const urlOptionalField = z
  .string()
  .max(255, 'URL must be at most 255 characters')
  .refine((val) => val === '' || urlRegex.test(val), 'invalid URL')
  .optional()
  .or(z.literal(''))

// 説明フィールド
export const descriptionField = z
  .string()
  .max(400, 'description must be at most 400 characters')
  .optional()
  .or(z.literal(''))

export const descriptionLongField = z
  .string()
  .max(1000, 'description must be at most 1000 characters')
  .optional()
  .or(z.literal(''))

// 住所フィールド

/** 郵便番号（フォーム入力用・柔軟なバリデーション） */
export const postalCodeField = z
  .string()
  .min(1, 'postal code is required')
  .max(20, 'postal code must be at most 20 characters')

/** 郵便番号（カナダ形式の厳格なバリデーション） */
export const postalCodeStrictField = z
  .string()
  .min(1, 'postal code is required')
  .transform((val) => val.replace(/\s+/g, '').toUpperCase())
  .refine((val) => val.length === 6, {
    message: 'postal code must be 6 characters',
  })
  .refine((val) => /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(val), {
    message: 'invalid postal code format (e.g., V6B4Y8)',
  })

export const countryField = z
  .string()
  .min(1, 'country is required')
  .max(100, 'country must be at most 100 characters')

export const provinceField = z
  .string()
  .min(1, 'province is required')
  .max(100, 'province must be at most 100 characters')

export const cityField = z
  .string()
  .min(1, 'city is required')
  .max(100, 'city must be at most 100 characters')

export const streetAddressField = z
  .string()
  .min(1, 'street address is required')
  .max(255, 'street address must be at most 255 characters')

export const floorField = z
  .string()
  .max(50, 'floor must be at most 50 characters')
  .optional()
  .or(z.literal(''))

export const unitField = z
  .string()
  .max(50, 'unit must be at most 50 characters')
  .optional()
  .or(z.literal(''))

// 複合スキーマ（再利用可能なオブジェクト形状）

/** 住所フィールド一式 - z.object().merge() やスプレッド構文で使用 */
export const addressFields = {
  postalCode: postalCodeField,
  country: countryField,
  province: provinceField,
  city: cityField,
  streetAddress: streetAddressField,
  floor: floorField,
  unit: unitField,
}

/** 住所スキーマ（z.objectとして） */
export const addressSchema = z.object(addressFields)

export type AddressSchemaType = z.infer<typeof addressSchema>
