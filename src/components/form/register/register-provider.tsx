'use client'

import { ReactNode, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { register } from '@/actions'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { registerSchema, RegisterSchemaType } from '@/lib/zod'

interface RegisterProviderProps {
  children: ReactNode
}

export function RegisterProvider({ children }: RegisterProviderProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  })

  const onSubmit = (values: RegisterSchemaType) => {
    startTransition(async () => {
      const result = await register(values)

      if (!result.success) {
        toast.error('Registration Failed', {
          description: result.message,
          richColors: true,
        })
        return
      }

      toast.success('Welcome!', {
        description: result.message,
        richColors: true,
      })

      router.push('/')
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        {children}
        <Button type="submit" variant="secondary" className="w-full mt-2">
          {isPending ? <Spinner /> : 'Create Account'}
        </Button>
      </form>
    </Form>
  )
}
