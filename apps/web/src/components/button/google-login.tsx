'use client'

import { FaGoogle } from 'react-icons/fa'

import { IconButton } from '@/components/button'
import { authClient } from '@/lib/better-auth/client'

interface GoogleLoginProps {
  redirectTo?: string
}

export function GoogleLogin({ redirectTo }: GoogleLoginProps) {
  const signInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: redirectTo || '/',
    })
  }

  return (
    <IconButton variant="secondary" icon={FaGoogle} isPending={false} onClick={signInWithGoogle} className="w-full">
      Continue with Google
    </IconButton>
  )
}
