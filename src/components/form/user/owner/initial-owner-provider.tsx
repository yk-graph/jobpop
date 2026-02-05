'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { ReactNode, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

// import { createInitialCompany } from '@/actions/company'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { initialOwnerSchema, InitialOwnerSchemaType } from '@/lib/zod'

interface InitialOwnerProviderProps {
  children: ReactNode
}

export function InitialOwnerProvider({ children }: InitialOwnerProviderProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<InitialOwnerSchemaType>({
    resolver: zodResolver(initialOwnerSchema),
    defaultValues: {
      userName: '',
      companyName: '',
      companyDescription: undefined,
      companyWebsite: undefined,
      phoneNumber: '',
      postalCode: '',
      country: 'Canada',
      province: '',
      city: '',
      streetAddress: '',
      floor: undefined,
      unit: undefined,
    },
    mode: 'onBlur',
  })

  const onSubmit = (values: InitialOwnerSchemaType) => {
    // startTransition(async () => {
    //   const result = await createInitialCompany(values)
    //   if (!result.success) {
    //     toast.error('Company Setup Failed', {
    //       description: result.message,
    //       richColors: true,
    //     })
    //     return
    //   }
    //   toast.success('Welcome to JobPop!', {
    //     description: result.message,
    //     richColors: true,
    //   })
    //   router.push('/employer/dashboard')
    // })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {children}
        <Button type="submit" variant="secondary" className="w-full" disabled={isPending}>
          {isPending ? <Spinner /> : 'Create Company'}
        </Button>
      </form>
    </Form>
  )
}
