'use client'

import * as React from 'react'

import { Input } from './input'
import { cn } from '../utils'

interface PhoneInputProps extends Omit<React.ComponentProps<'input'>, 'onChange' | 'value'> {
  value?: string
  onChange?: (value: string) => void
}

// +1を除いた10桁の数字をフォーマット: +1 (XXX) XXX-XXXX
function formatPhoneDisplay(digits: string): string {
  const cleaned = digits.replace(/\D/g, '').slice(0, 10)
  if (cleaned.length === 0) return '+1 '
  if (cleaned.length <= 3) return `+1 (${cleaned}`
  if (cleaned.length <= 6) return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
  return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
}

// フォーマットされた表示から数字のみを抽出（+1を除く）
function extractDigits(formatted: string): string {
  // +1を除去してから数字のみ抽出
  const withoutPrefix = formatted.replace(/^\+1\s*/, '')
  return withoutPrefix.replace(/\D/g, '').slice(0, 10)
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = '', onChange, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    // +1プレフィックスを除いた数字部分を取得
    const digitsOnly = value.startsWith('+1') ? value.slice(2) : value.replace(/\D/g, '')
    const hasDigits = digitsOnly.length > 0

    // 表示値: フォーカス中または数字がある場合は+1プレフィックス付き、それ以外は空
    const displayValue = isFocused || hasDigits ? formatPhoneDisplay(digitsOnly) : ''

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value

      // +1プレフィックスが削除されないようにする
      if (!input.startsWith('+1')) {
        if (onChange) onChange('')
        return
      }

      const digits = extractDigits(input)

      // +1プレフィックス付きの完全な値をonChangeに渡す
      if (onChange) {
        onChange(digits.length > 0 ? `+1${digits}` : '')
      }
    }

    // フォーカス時にカーソルを末尾に移動
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      // 次のティックでカーソル位置を設定（値が更新された後）
      setTimeout(() => {
        const len = e.target.value.length
        e.target.setSelectionRange(len, len)
      }, 0)
    }

    const handleBlur = () => {
      setIsFocused(false)
    }

    return (
      <Input
        ref={ref}
        type="tel"
        className={cn(className)}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="+1 (604) 123-4567"
        {...props}
      />
    )
  }
)
PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }
