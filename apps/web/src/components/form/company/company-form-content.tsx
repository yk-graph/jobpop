'use client'

import { Search, X } from 'lucide-react'
import { useTransition } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { getAddressFromPostalCode } from '@/actions'
import {
  Button,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PhoneInput,
  Spinner,
  Textarea,
} from '@jobpop/ui'
import { ImageUploadButton } from '@/components/button'
import { CreateCompanySchemaType } from '@/lib/zod'

interface CompanyFormContentProps {
  form: UseFormReturn<CreateCompanySchemaType>
  showLogo?: boolean
}

export function CompanyFormContent({ form, showLogo = true }: CompanyFormContentProps) {
  const [isSearching, startSearchTransition] = useTransition()

  const handleSearchAddress = () => {
    const postalCode = form.getValues('postalCode')

    form.clearErrors('postalCode')

    startSearchTransition(async () => {
      const result = await getAddressFromPostalCode({ postalCode }, 'CA')

      if (!result.success || !result.data) {
        form.setError('postalCode', {
          type: 'manual',
          message: result.message || 'Could not find address',
        })
        return
      }

      form.setValue('country', result.data.country)
      form.setValue('province', result.data.provinceShort)
      form.setValue('city', result.data.city)
      form.setValue('streetAddress', result.data.streetAddress)
      form.clearErrors('postalCode')
    })
  }

  const handleResetAddress = () => {
    form.setValue('postalCode', '')
    form.setValue('country', '')
    form.setValue('province', '')
    form.setValue('city', '')
    form.setValue('streetAddress', '')
    form.setValue('floor', '')
    form.setValue('unit', '')
    form.clearErrors('postalCode')
  }

  return (
    <>
      {/* Company Name */}
      <FormField
        control={form.control}
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
        control={form.control}
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

      {/* Company Logo */}
      {showLogo && (
        <FormField
          control={form.control}
          name="companyLogo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Logo</FormLabel>
              <FormControl>
                <ImageUploadButton
                  dir="company/logos"
                  visibility="public"
                  size="md"
                  aspect="square"
                  rounded="lg"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>Optional: Upload your company logo (max 5MB)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Company Website */}
      <FormField
        control={form.control}
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

      {/* Phone Number */}
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number *</FormLabel>
            <FormControl>
              <PhoneInput {...field} />
            </FormControl>
            <FormDescription>Enter a phone number valid for use in Canada</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address Section */}
      <div className="space-y-4 pt-4 border-t">
        <h2 className="text-base font-semibold">Company Address</h2>

        {/* Postal Code with Search */}
        <FormField
          control={form.control}
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
                  disabled={isSearching}
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                >
                  {isSearching ? <Spinner className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={handleResetAddress}
                  disabled={isSearching}
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <FormDescription>Enter postal code and click search to auto-fill address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Country */}
        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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

        {/* Floor & Unit - Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="floor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Floor</FormLabel>
                <FormControl>
                  <Input placeholder="B1, Ground Floor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input placeholder="Shop 205" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  )
}
