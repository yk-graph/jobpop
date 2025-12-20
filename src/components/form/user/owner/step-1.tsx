'use client'

import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function InitialOwnerStep1() {
  const { control, setValue, watch } = useFormContext()

  const handleClickNext = async () => setValue('stepCount', 2)

  const companyName = watch('companyName')

  const isValidStep1 = useMemo(() => {
    return !!companyName && companyName.length >= 2
  }, [companyName])

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="text-lg font-bold text-center">Step 1: Company Information</h1>
        <p className="text-sm text-center text-muted-foreground">Please provide your company details.</p>
      </div>

      {/* Company Section */}
      <div className="space-y-4">
        {/* Company Name */}
        <FormField
          control={control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., JobPop Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Company Description */}
        <FormField
          control={control}
          name="companyDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about your company..." className="resize-none" rows={4} {...field} />
              </FormControl>
              <FormDescription>Optional: Brief description of your company (max 400 characters)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Company Website */}
        <FormField
          control={control}
          name="companyWebsite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Website</FormLabel>
              <FormControl>
                <Input placeholder="https://www.example.com" type="url" {...field} />
              </FormControl>
              <FormDescription>Optional: Your company&apos;s website URL</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleClickNext} variant="secondary" disabled={!isValidStep1} type="button">
          Next Step
        </Button>
      </div>
    </div>
  )
}
