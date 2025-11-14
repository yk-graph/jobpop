'use server'

import { AuthError } from 'next-auth'
import { signOut } from '@/lib/auth'

export async function logout() {
  try {
    await signOut({ redirectTo: '/login' })
  } catch (error: unknown) {
    if (error instanceof Error) {
      // NEXT_REDIRECTは正常なリダイレクト指示なので再投げ
      if (error.message === 'NEXT_REDIRECT') {
        throw error
      } else {
        console.error('🚨 Logout error:', error)
        return 'Try again'
      }
    }

    if (error instanceof AuthError) {
      console.error('🚨 Logout AuthError:', error.message)
      return 'Try again'
    }
  }
}
