'use server'

import { signIn } from '@/lib/auth'
import { UserType } from '@/types'
import { AuthError } from 'next-auth'

export async function googleLogin(type: UserType) {
  try {
    await signIn('google', { redirectTo: type === 'seeker' ? '/' : '/employer/dashboard' })
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

export async function facebookLogin() {
  try {
    await signIn('facebook', { redirectTo: '/' })
  } catch (error: unknown) {
    if (error instanceof Error) {
      // NEXT_REDIRECTは正常なリダイレクト指示なので再投げ
      if (error.message === 'NEXT_REDIRECT') {
        throw error
      } else {
        console.error('🚨 Facebook login error:', error)
        return 'An unexpected error occurred'
      }
    }

    if (error instanceof AuthError) {
      console.error('🚨 Facebook login AuthError:', error.message)
      return error.message
    }
  }
}
