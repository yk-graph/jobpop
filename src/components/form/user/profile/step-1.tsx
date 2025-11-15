'use client'

import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { VisaType } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { Combobox, type ComboboxOption } from '@/components/ui/combobox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { COUNTRIES, COUNTRY_CODES, VISA_LABELS } from '@/constants'

export function InitialProfileStep1() {
  const { control, setValue, watch, trigger } = useFormContext()

  const currentYear = new Date().getFullYear()
  const minBirthYear = 1970
  const maxBirthYear = currentYear - 18 // 18歳以上

  // 国データをComboboxOptionに変換
  const countryOptions: ComboboxOption[] = COUNTRY_CODES.map((code) => ({
    value: code,
    label: `${COUNTRIES[code].flag} ${COUNTRIES[code].nameEn}`,
  }))

  const handleClickNext = async () => setValue('stepCount', 2)

  const name = watch('name')
  const countryCode = watch('countryCode')
  const birthYear = watch('birthYear')
  const visaType = watch('visaType')

  const isValidStep1 = useMemo(() => {
    return !!name && !!countryCode && !!birthYear && !!visaType
  }, [name, countryCode, birthYear, visaType])

  return (
    <div className="space-y-4">
      {/* Name */}
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Country Code */}
      <FormField
        control={control}
        name="countryCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Combobox
                value={field.value || ''}
                onValueChange={(value) => {
                  field.onChange(value)
                }}
                onBlur={() => {
                  field.onBlur()
                  trigger('countryCode')
                }}
                options={countryOptions}
                placeholder="Select your country"
                searchPlaceholder="Search countries..."
                emptyMessage="No country found."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Birth Year */}
      <FormField
        control={control}
        name="birthYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Birth Year</FormLabel>
            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString() || ''}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select birth year" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Array.from({ length: maxBirthYear - minBirthYear + 1 }, (_, i) => {
                  const year = maxBirthYear - i
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Visa Type */}
      <FormField
        control={control}
        name="visaType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Visa Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select visa type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.values(VisaType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {VISA_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex justify-end pt-4">
        <Button onClick={handleClickNext} variant="secondary" disabled={!isValidStep1}>
          Next Step
        </Button>
      </div>
    </div>
  )
}
