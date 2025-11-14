'use client'

import { useActionState } from 'react'

import { logout } from '@/actions'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export function Logout() {
  const [errorMessage, formAction, isPending] = useActionState(logout, null)

  return (
    <form action={formAction}>
      <Button variant="secondary" disabled={isPending} className="w-full">
        {isPending ? <Spinner /> : (errorMessage ?? 'Logout')}
      </Button>
    </form>
  )
}
