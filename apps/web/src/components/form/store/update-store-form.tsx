'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Store } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { updateStore } from '@/actions'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { createStoreSchema, CreateStoreSchemaType } from '@/lib/zod'

import { StoreFormContent } from './store-form-content'

interface UpdateStoreFormProps {
  store: Store
}

export function UpdateStoreForm({ store }: UpdateStoreFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<CreateStoreSchemaType>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      storeName: store.name,
      storeDescription: store.description || '',
      storeThumbnail: store.thumbnailUrl || '',
      storeWebsite: '',
      phoneNumber: store.phoneNumber || '',
      postalCode: store.postalCode,
      country: store.country,
      province: store.province,
      city: store.city,
      streetAddress: store.streetAddress,
      floor: store.floor || '',
      unit: store.unit || '',
      lat: store.lat,
      lng: store.lng,
    },
    mode: 'onBlur',
  })

  const onSubmit = (values: CreateStoreSchemaType) => {
    startTransition(async () => {
      const result = await updateStore(store.id, values)

      if (!result.success) {
        toast.error('Failed to update store', {
          description: result.message,
          duration: 5000,
        })
        return
      }

      toast.success(result.message)
      router.push(`/employer/companies/${store.companyId}/stores/${store.id}`)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <StoreFormContent form={form} />

        <Button type="submit" variant="secondary" className="w-full" disabled={isPending}>
          {isPending ? <Spinner /> : 'Update Store'}
        </Button>
      </form>
    </Form>
  )
}
