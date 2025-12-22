'use client'

import { useActionState } from 'react'
import { FaGoogle } from 'react-icons/fa'

import { googleLogin } from '@/actions'
import { IconButton } from '@/components/button'
import { UserType } from '@/types'

export function GoogleLogin({ type }: { type: UserType }) {
  const [errorMessage, formAction, isPending] = useActionState(async () => {
    return await googleLogin(type)
  }, null)

  return (
    <form action={formAction}>
      <IconButton variant="secondary" icon={FaGoogle} isPending={isPending} className="w-full">
        {errorMessage ?? 'Continue with Google'}
      </IconButton>
    </form>
  )
}
