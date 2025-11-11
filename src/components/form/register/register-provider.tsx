'use client';

import { ReactNode, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { register } from '@/actions';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { registerSchema, RegisterSchemaType } from '@/lib/zod';

interface RegisterProviderProps {
  children: ReactNode;
}

export function RegisterProvider({ children }: RegisterProviderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });

  async function onSubmit(values: RegisterSchemaType) {
    startTransition(async () => {
      const registerResult = await register(values);

      if (!registerResult.success) {
        toast.error('Registration Failed', {
          description: registerResult.message,
        });
        return;
      }

      const signInResult = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!signInResult.ok) {
        toast.error('Login Failed', {
          description: 'Please try signing in manually with your new account.',
        });
        return;
      }

      toast.success('Account Created!', {
        description: 'Account has been created and Signed in.',
      });
      router.push(signInResult.url || '/');
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        {children}
        <Button type="submit" variant="secondary" className="w-full mt-2">
          {isPending ? <Spinner /> : 'Create Account'}
        </Button>
      </form>
    </Form>
  );
}
