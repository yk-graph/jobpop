'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Company } from '@jobpop/database'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { updateCompany } from '@/actions'
import { Button } from '@jobpop/ui'
import { Form } from '@jobpop/ui'
import { Spinner } from '@jobpop/ui'
import { createCompanySchema, CreateCompanySchemaType } from '@/lib/zod'

import { CompanyFormContent } from './company-form-content'

interface UpdateCompanyFormProps {
  company: Company
}

export function UpdateCompanyForm({ company }: UpdateCompanyFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<CreateCompanySchemaType>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      companyName: company.name,
      companyDescription: company.description || '',
      companyLogo: company.logoUrl || '',
      companyWebsite: company.website || '',
      phoneNumber: company.phoneNumber,
      postalCode: company.postalCode,
      country: company.country,
      province: company.province,
      city: company.city,
      streetAddress: company.streetAddress,
      floor: company.floor || '',
      unit: company.unit || '',
    },
    mode: 'onBlur',
  })

  const onSubmit = (values: CreateCompanySchemaType) => {
    startTransition(async () => {
      const result = await updateCompany(company.id, values)

      if (!result.success) {
        toast.error('Failed to update company', {
          description: result.message,
          duration: 5000,
        })
        return
      }

      toast.success(result.message)
      router.push(`/employer/companies/${company.id}`)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CompanyFormContent form={form} showLogo={false} />

        <Button type="submit" variant="secondary" className="w-full" disabled={isPending}>
          {isPending ? <Spinner /> : 'Update Company'}
        </Button>
      </form>
    </Form>
  )
}
