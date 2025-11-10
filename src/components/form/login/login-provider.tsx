'use client';

import { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Form } from '@/components/ui/form';
import { loginSchema, LoginSchemaType } from '@/lib/zod';

interface LoginProviderProps {
  children: ReactNode;
}

export function LoginProvider({ children }: LoginProviderProps) {
  const router = useRouter();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginSchemaType) {
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        console.log('❌ Login failed:', result.error);
        form.setError('email', { message: 'Login failed' });
      } else {
        console.log('✅ Login successful, redirecting...');
        router.push('/');
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      form.setError('email', { message: 'An error occurred' });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        {children}
      </form>
    </Form>
  );
}
