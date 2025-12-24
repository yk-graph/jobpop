'use client'

import { useTransition } from 'react'
import { useFormContext } from 'react-hook-form'
import { Search, X } from 'lucide-react'

import { getAddressFromPostalCode } from '@/actions'
import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function InitialOwnerForm() {
  const { control, setValue, watch, setError, clearErrors } = useFormContext()
  const [isPending, startTransition] = useTransition()

  const handleSearchAddress = () => {
    const postalCode = watch('postalCode')

    clearErrors('postalCode')

    startTransition(async () => {
      const result = await getAddressFromPostalCode({ postalCode }, 'CA')

      if (!result.success || !result.data) {
        setError('postalCode', {
          type: 'manual',
          message: result.message || 'Could not find address',
        })
        return
      }

      // フォームに住所を自動入力
      setValue('country', result.data.country)
      setValue('province', result.data.provinceShort)
      setValue('city', result.data.city)
      setValue('streetAddress', result.data.streetAddress)
      clearErrors('postalCode')
    })
  }

  const handleResetAddress = () => {
    setValue('postalCode', '')
    setValue('country', '')
    setValue('province', '')
    setValue('city', '')
    setValue('streetAddress', '')
    setValue('floor', '')
    setValue('unit', '')
    clearErrors('postalCode')
  }

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="text-lg font-bold text-center">Company Information</h1>
        <p className="text-sm text-center text-muted-foreground">Please provide your company details.</p>
      </div>

      {/* Company Section */}
      <div className="space-y-4">
        <FormField
          control={control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number *</FormLabel>
              <FormControl>
                <Input placeholder="+1 (604) 123-4567" type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 pt-4 border-t">
          <FormField
            control={control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code *</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="V6B 4Y8" {...field} />
                  </FormControl>
                  <Button
                    onClick={handleSearchAddress}
                    disabled={isPending}
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 shrink-0"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleResetAddress}
                    disabled={isPending}
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Country */}
          <FormField
            control={control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country *</FormLabel>
                <FormControl>
                  <Input placeholder="Canada" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Province */}
          <FormField
            control={control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province *</FormLabel>
                <FormControl>
                  <Input placeholder="BC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City */}
          <FormField
            control={control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City *</FormLabel>
                <FormControl>
                  <Input placeholder="Vancouver" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Street Address */}
          <FormField
            control={control}
            name="streetAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address *</FormLabel>
                <FormControl>
                  <Input placeholder="4800 Kingsway" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Floor */}
          <FormField
            control={control}
            name="floor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Floor</FormLabel>
                <FormControl>
                  <Input placeholder="B1, Ground Floor, etc." {...field} />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Unit */}
          <FormField
            control={control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input placeholder="Shop 205" {...field} />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
