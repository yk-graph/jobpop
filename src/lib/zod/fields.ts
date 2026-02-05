import * as z from 'zod'

// 共通フィールドバリデーション
export const emailField = z.email('email is invalid').min(1, 'email is required')

export const passwordField = z
  .string()
  .min(1, 'パスワードを入力してください')
  .min(8, 'パスワードは8文字以上で入力してください')
