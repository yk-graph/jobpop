'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { requestPasswordReset } from '@/actions'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { forgotPasswordSchema, ForgotPasswordSchemaType } from '@/lib/zod'

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  })

  const onSubmit = (values: ForgotPasswordSchemaType) => {
    startTransition(async () => {
      const result = await requestPasswordReset(values.email)

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
          {isPending ? <Spinner /> : 'Send Reset Link'}
        </Button>
      </form>
    </Form>
  )
}
