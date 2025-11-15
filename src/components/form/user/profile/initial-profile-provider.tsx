'use client'

import { ReactNode, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { login } from '@/actions'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { initialProfileSchema, InitialProfileSchemaType } from '@/lib/zod'

interface InitialProfileProviderProps {
  children: ReactNode
}

export function InitialProfileProvider({ children }: InitialProfileProviderProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<InitialProfileSchemaType>({
    resolver: zodResolver(initialProfileSchema),
    defaultValues: {
      stepCount: 2,
      name: '',
      countryCode: '',
      birthYear: new Date().getFullYear() - 20,
      visaType: 'VISITOR',
      bio: '',
      linkedin: '',
      instagram: '',
      whatsapp: '',
    },
    mode: 'onBlur',
  })

  const onSubmit = (values: InitialProfileSchemaType) => {
    // startTransition(async () => {
    //   const result = await login(values)
    //   if (!result.success) {
    //     toast.error('Login Failed', {
    //       description: result.message,
    //       richColors: true,
    //     })
    //     return
    //   }
    //   toast.success('Welcome back!', {
    //     description: result.message,
    //     richColors: true,
    //   })
    //   router.push('/')
    // })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {children}
        {/* <Button type="submit" variant="secondary" className="w-full mt-2">
          {isPending ? <Spinner /> : 'Sign In'}
        </Button> */}
      </form>
    </Form>
  )
}
