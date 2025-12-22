'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { resendVerification } from '@/actions'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { resendSchema, ResendSchemaType } from '@/lib/zod'

export function ResendForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<ResendSchemaType>({
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  })

  const onSubmit = (values: ResendSchemaType) => {
    startTransition(async () => {
      const result = await resendVerification(values.email)

      if (!result.success) {
        toast.error('Failed to send email', {
          description: result.message,
          richColors: true,
        })
        return
      }

      toast.success('Email sent!', {
        description: result.message,
        richColors: true,
      })

      form.reset()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="secondary" className="mt-2 w-full">
          {isPending ? <Spinner /> : 'Resend Verification Email'}
        </Button>
      </form>
    </Form>
  )
}
