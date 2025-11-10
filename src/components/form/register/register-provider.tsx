'use client';

import { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';
import { registerSchema, RegisterSchemaType } from '@/lib/zod';

interface RegisterProviderProps {
  children: ReactNode;
}

export function RegisterProvider({ children }: RegisterProviderProps) {
  const router = useRouter();

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: RegisterSchemaType) {
    try {
      // ここで実際の登録APIを呼び出す
      // 仮実装として、登録成功後に自動ログイン
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        form.setError('email', { message: error.message || 'Registration failed' });
        return;
      }

      // 登録成功後、自動ログイン
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        console.log('❌ Auto login failed:', result.error);
        // 登録は成功したが自動ログインに失敗した場合、ログインページにリダイレクト
        router.push('/login');
      } else {
        console.log('✅ Registration and auto login successful, redirecting...');
        router.push('/');
      }
    } catch (error) {
      console.error('💥 Registration error:', error);
      form.setError('email', { message: 'An error occurred during registration' });
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
