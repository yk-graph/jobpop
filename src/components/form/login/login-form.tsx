'use client';

import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function LoginForm() {
  const { control, formState } = useFormContext();

  const isDisabled = !formState.isValid || !formState.isDirty || formState.isSubmitting;
  console.log(formState.errors);

  return (
    <>
      <FormField
        control={control}
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
        control={control}
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

      <Button type="submit" variant="secondary" disabled={isDisabled} className="w-full mt-2">
        {formState.isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
    </>
  );
}
