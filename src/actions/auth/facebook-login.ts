'use server'

import { AuthError } from 'next-auth'

import { signIn } from '@/lib/auth'

export async function facebookLogin() {
  try {
    await signIn('facebook', { redirectTo: '/' })
  } catch (error) {
    if (error instanceof AuthError) {
      return error.message
    }
    throw error
  }
}
