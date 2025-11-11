'use client';

import { ReactNode, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { loginSchema, LoginSchemaType } from '@/lib/zod';

interface LoginProviderProps {
  children: ReactNode;
}

export function LoginProvider({ children }: LoginProviderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginSchemaType) {
    startTransition(async () => {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!result.ok) {
        toast.error('Login Failed', {
          description: 'Please check your email and password and try again.',
        });
        return;
      }

      toast.success('Welcome back!', {
        description: 'You have been successfully signed in.',
      });

      router.push(result.url || '/');
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        {children}
        <Button type="submit" variant="secondary" className="w-full mt-2">
          {isPending ? <Spinner /> : 'Sign In'}
        </Button>
      </form>
    </Form>
  );
}
