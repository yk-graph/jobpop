'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { ReactNode, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Briefcase, Users } from 'lucide-react'

import { createInitialOwner } from '@/actions'
import { StepBar } from '@/components/form'
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
      stepCount: 1,
      companyName: '',
      companyDescription: '',
      companyWebsite: '',
      employeeEmails: [],
    },
    mode: 'onBlur',
  })

  const onSubmit = (values: InitialOwnerSchemaType) => {
    startTransition(async () => {
      const result = await createInitialOwner(values)
      if (!result.success) {
        toast.error('Company Setup Failed', {
          description: result.message,
          richColors: true,
        })
        return
      }
      toast.success('Welcome to JobPop!', {
        description: result.message,
        richColors: true,
      })
      router.push('/employer/dashboard')
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <StepBar
          currentStep={form.watch('stepCount')}
          steps={[
            { id: 1, icon: Briefcase },
            { id: 2, icon: Users },
          ]}
        />
        {children}
        {form.watch('stepCount') === 2 && (
          <Button type="submit" variant="secondary" className="w-full mt-6" disabled={isPending}>
            {isPending ? <Spinner /> : 'Start JobPop'}
          </Button>
        )}
      </form>
    </Form>
  )
}
