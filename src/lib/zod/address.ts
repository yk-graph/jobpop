import { z } from 'zod'

import { postalCodeStrictField } from './fields'

// 郵便番号スキーマ（APIバリデーション用）

/** 郵便番号APIリクエスト用スキーマ（カナダ形式の厳格なバリデーション） */
export const postalCodeSchema = z.object({
  postalCode: postalCodeStrictField,
})

export type PostalCodeSchemaType = z.infer<typeof postalCodeSchema>
