'use client'

import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { login } from '@/actions'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { loginSchema, LoginSchemaType } from '@/lib/zod'
import { UserType } from '@/types'

export function LoginForm({ type }: { type: UserType }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: LoginSchemaType) => {
    startTransition(async () => {
      const result = await login(values)

      if (!result.success) {
        toast.error('Login Failed', {
          description: result.message,
          richColors: true,
        })
        return
      }

      toast.success('Welcome back!', {
        description: result.message,
        richColors: true,
      })

      if (type === 'employer') {
        router.push('/employer/dashboard')
        return
      }

      if (type === 'seeker') {
        router.push('/')
        return
      }
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="secondary" className="w-full mt-2">
          {isPending ? <Spinner /> : 'Sign In'}
        </Button>
      </form>
    </Form>
  )
}
