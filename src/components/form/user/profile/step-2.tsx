'use client'

import { useState, useMemo } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { Plus, Minus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Combobox, type ComboboxOption } from '@/components/ui/combobox'
import { DatePicker } from '@/components/ui/date-picker'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SECTOR_LABELS, BUSINESS_TYPES, JOB_TITLES } from '@/constants'

const EMPLOYMENT_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'FREELANCE', label: 'Freelance' },
] as const

export function InitialProfileStep2() {
  const { control, setValue, watch } = useFormContext()
  const [hasExperience, setHasExperience] = useState(false)

  // Positions用のFieldArray
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'positions',
  })

  const handleClickBack = () => setValue('stepCount', 1)
  const handleClickNext = () => setValue('stepCount', 3)

  // Sector選択用のオプション
  const sectorOptions: ComboboxOption[] = useMemo(() => {
    return Object.entries(SECTOR_LABELS).map(([key, label]) => ({
      value: key,
      label,
    }))
  }, [])

  const selectedSector = watch('experience.sector')
  const businessTypes = useMemo(() => {
    return selectedSector ? BUSINESS_TYPES[selectedSector as keyof typeof BUSINESS_TYPES] || [] : []
  }, [selectedSector])

  // BusinessType選択用のオプション
  const businessTypeOptions: ComboboxOption[] = useMemo(() => {
    return businessTypes.map((type) => ({
      value: type,
      label: type,
    }))
  }, [businessTypes])

  // Position追加
  const addPosition = () => {
    if (fields.length < 3) {
      append({
        jobTitle: '',
        period: '',
        description: '',
      })
    }
  }

  // Position削除
  const removePosition = (index: number) => {
    remove(index)
  }

  // Most Recent ExperienceのBusiness Typeに基づくJobTitle取得
  const experienceBusinessType = watch('experience.businessType')
  const getExperienceJobTitleOptions = (): ComboboxOption[] => {
    if (!experienceBusinessType) return []
    const jobTitles = JOB_TITLES[experienceBusinessType] || []
    return jobTitles.map((title) => ({
      value: title,
      label: title,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="text-lg font-bold text-center">Step 2: Work Experience</h1>
        <p className="text-sm text-center text-muted-foreground">
          Tell us about your most recent work experience (optional).
        </p>
      </div>

      {/* 経験有無のチェックボックス */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="has-experience"
          checked={hasExperience}
          onCheckedChange={(checked) => setHasExperience(!!checked)}
        />
        <label
          htmlFor="has-experience"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I have recent work experience to share
        </label>
      </div>

      {hasExperience && (
        <div className="space-y-6">
          <h3 className="text-md font-semibold">Most Recent Experience</h3>

          {/* Company */}
          <FormField
            control={control}
            name="experience.company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Employment Type */}
          <FormField
            control={control}
            name="experience.employmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* isLocal Checkbox */}
          <FormField
            control={control}
            name="experience.isLocal"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>This is a Canadian company</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Current Job Checkbox */}
          <FormField
            control={control}
            name="experience.isCurrent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I currently work here</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Start Date */}
          <FormField
            control={control}
            name="experience.startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    onDateChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                    placeholder="Select start date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Date (if not current) */}
          {!watch('experience.isCurrent') && (
            <FormField
              control={control}
              name="experience.endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value ? new Date(field.value) : undefined}
                      onDateChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                      placeholder="Select end date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Sector Selection */}
          <FormField
            control={control}
            name="experience.sector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry Sector</FormLabel>
                <FormControl>
                  <Combobox
                    value={field.value || ''}
                    onValueChange={field.onChange}
                    options={sectorOptions}
                    placeholder="Select industry sector"
                    searchPlaceholder="Search sectors..."
                    emptyMessage="No sector found."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Business Type Selection */}
          {selectedSector && (
            <FormField
              control={control}
              name="experience.businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <FormControl>
                    <Combobox
                      value={field.value || ''}
                      onValueChange={field.onChange}
                      options={businessTypeOptions}
                      placeholder="Select business type"
                      searchPlaceholder="Search business types..."
                      emptyMessage="No business type found."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Positions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold">Positions (Optional)</h4>
              {fields.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPosition}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              )}
            </div>

            {fields.map((field, index) => {
              const experienceJobTitleOptions = getExperienceJobTitleOptions()

              return (
                <div key={field.id} className="border p-4 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Position {index + 1}</h5>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePosition(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Job Title */}
                  <FormField
                    control={control}
                    name={`positions.${index}.jobTitle`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Combobox
                            value={field.value || ''}
                            onValueChange={field.onChange}
                            options={experienceJobTitleOptions}
                            placeholder={
                              experienceBusinessType ? 'Select job title' : 'Please select business type first'
                            }
                            searchPlaceholder="Search job titles..."
                            emptyMessage="No job title found."
                            disabled={!experienceBusinessType}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Period */}
                  <FormField
                    control={control}
                    name={`positions.${index}.period`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Period (months)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="120"
                            placeholder="e.g. 6"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description (Optional) */}
                  <FormField
                    control={control}
                    name={`positions.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Describe your responsibilities..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button onClick={handleClickBack} variant="outline">
          Back
        </Button>
        <Button onClick={handleClickNext} variant="secondary">
          Next Step
        </Button>
      </div>
    </div>
  )
}
