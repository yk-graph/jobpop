'use server'

import { AuthError } from 'next-auth'
import { signIn } from '@/lib/auth'

export async function googleLogin() {
  try {
    await signIn('google', { redirectTo: '/' })
  } catch (error: unknown) {
    if (error instanceof Error) {
      // NEXT_REDIRECTは正常なリダイレクト指示なので再投げ
      if (error.message === 'NEXT_REDIRECT') {
        throw error
      } else {
        console.error('🚨 Google login error:', error)
        return 'An unexpected error occurred'
      }
    }

    if (error instanceof AuthError) {
      console.error('🚨 Google login AuthError:', error.message)
      return error.message
    }
  }
}
