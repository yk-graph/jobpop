'use client'

import { useFormContext } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function InitialProfileStep2() {
  const { control, setValue } = useFormContext()

  const handleClickNext = () => {
    setValue('stepCount', 2)
  }

  return (
    <>
      <h1>Step 2</h1>

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

      <Button onClick={handleClickNext}>Next</Button>
    </>
  )
}
