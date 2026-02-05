'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { ReactNode, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Briefcase, Globe, User } from 'lucide-react'

// import { createInitialProfile } from '@/actions'
import { StepBar } from '@/components/form'
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
      stepCount: 1,
      name: '',
      countryCode: '',
      birthYear: new Date().getFullYear() - 20,
      visaType: 'VISITOR',
      experienceTypeIds: [],
      softSkills: [],
    },
    mode: 'onBlur',
  })

  const onSubmit = (values: InitialProfileSchemaType) => {
    // startTransition(async () => {
    //   const result = await createInitialProfile(values)
    //   if (!result.success) {
    //     toast.error('Profile Creation Failed', {
    //       description: result.message,
    //       richColors: true,
    //     })
    //     return
    //   }
    //   toast.success('Welcome to JobPop!', {
    //     description: result.message,
    //     richColors: true,
    //   })
    //   router.push('/')
    // })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <StepBar
          currentStep={form.watch('stepCount')}
          steps={[
            { id: 1, icon: User },
            { id: 2, icon: Briefcase },
            { id: 3, icon: Globe },
          ]}
        />
        {children}
        {form.watch('stepCount') === 3 && (
          <Button type="submit" variant="secondary" className="w-full mt-6" disabled={isPending}>
            {isPending ? <Spinner /> : 'Start JobPop'}
          </Button>
        )}
      </form>
    </Form>
  )
}
