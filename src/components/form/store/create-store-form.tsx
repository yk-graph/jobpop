'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { createStore } from '@/actions'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { createStoreSchema, CreateStoreSchemaType } from '@/lib/zod'

import { StoreFormContent } from './store-form-content'

interface CreateStoreFormProps {
  companyId: string
}

export function CreateStoreForm({ companyId }: CreateStoreFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<CreateStoreSchemaType>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      storeName: '',
      storeDescription: '',
      storeThumbnail: '',
      storeWebsite: '',
      phoneNumber: '',
      postalCode: '',
      country: 'Canada',
      province: '',
      city: '',
      streetAddress: '',
      floor: '',
      unit: '',
      lat: undefined,
      lng: undefined,
    },
    mode: 'onBlur',
  })

  const onSubmit = (values: CreateStoreSchemaType) => {
    startTransition(async () => {
      const result = await createStore(companyId, values)

      if (!result.success) {
        toast.error('Failed to create store', {
          description: result.message,
          duration: 5000,
        })
        return
      }

      toast.success('Store created successfully!')
      router.push(`/employer/companies/${companyId}/stores/${result.data.storeId}`)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <StoreFormContent form={form} />

        <Button type="submit" variant="secondary" className="w-full" disabled={isPending}>
          {isPending ? <Spinner /> : 'Create Store'}
        </Button>
      </form>
    </Form>
  )
}
