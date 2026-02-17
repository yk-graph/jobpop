'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { createCompany } from '@/actions'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { createCompanySchema, CreateCompanySchemaType } from '@/lib/zod'

import { CompanyFormContent } from './company-form-content'

export function CreateCompanyForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<CreateCompanySchemaType>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      companyName: '',
      companyDescription: '',
      companyLogo: '',
      companyWebsite: '',
      phoneNumber: '',
      postalCode: '',
      country: 'Canada',
      province: '',
      city: '',
      streetAddress: '',
      floor: '',
      unit: '',
    },
    mode: 'onBlur',
  })

  const onSubmit = (values: CreateCompanySchemaType) => {
    startTransition(async () => {
      const result = await createCompany(values)

      if (!result.success) {
        toast.error('Failed to create company', {
          description: result.message,
          duration: 5000,
        })
        return
      }

      toast.success(result.message)
      router.push(`/employer/companies/${result.data.companyId}`)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CompanyFormContent form={form} />

        {/* Submit Button */}
        <Button type="submit" variant="secondary" className="w-full" disabled={isPending}>
          {isPending ? <Spinner /> : 'Create Company'}
        </Button>
      </form>
    </Form>
  )
}
