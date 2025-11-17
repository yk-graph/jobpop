'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import type { IndustryType } from '@prisma/client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { INDUSTRIES, INDUSTRY_EXPERIENCES, INDUSTRY_ICONS, INDUSTRY_LABELS } from '@/constants'
import { getExperienceById } from '@/utils'

export function InitialProfileStep2() {
  const { control, setValue, watch } = useFormContext()
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(null)

  const experienceTypeIds: string[] = watch('experienceTypeIds') || []

  const handleClickBack = () => setValue('stepCount', 1)
  const handleClickNext = () => setValue('stepCount', 3)

  const handleIndustryClick = (industry: IndustryType) => {
    setSelectedIndustry(selectedIndustry === industry ? null : industry)
  }

  const handleExperienceToggle = (experienceId: string, checked: boolean) => {
    const currentIds = experienceTypeIds || []

    if (checked) {
      // 最大10個まで
      if (currentIds.length < 10) {
        setValue('experienceTypeIds', [...currentIds, experienceId])
      }
    } else {
      setValue(
        'experienceTypeIds',
        currentIds.filter((id) => id !== experienceId)
      )
    }
  }

  const handleRemoveExperience = (experienceId: string) => {
    const currentIds = experienceTypeIds || []
    setValue(
      'experienceTypeIds',
      currentIds.filter((id) => id !== experienceId)
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="text-lg font-bold text-center">Step 2: Work Experience</h1>
        <p className="text-sm text-center text-muted-foreground">Select your work experiences (up to 10).</p>
      </div>

      {/* Selected Experiences as Badges */}
      {experienceTypeIds.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Your Selected Experiences ({experienceTypeIds.length}/10)</h3>
          <div className="flex flex-wrap gap-2">
            {experienceTypeIds.map((id) => {
              const experience = getExperienceById(id)
              if (!experience) return null

              return (
                <Badge
                  key={id}
                  variant="secondary"
                  className="flex items-center gap-2 cursor-pointer hover:bg-secondary/80"
                  onClick={() => handleRemoveExperience(id)}
                >
                  {experience.title}
                  <X className="h-3 w-3" />
                </Badge>
              )
            })}
          </div>
        </div>
      )}

      {/* Industry Selection */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold">Select Industry</h3>
        <div className="grid grid-cols-3 gap-3">
          {INDUSTRIES.map((industry) => {
            const Icon = INDUSTRY_ICONS[industry]
            const isSelected = selectedIndustry === industry

            return (
              <Button
                key={industry}
                variant={isSelected ? 'secondary' : 'background'}
                onClick={() => handleIndustryClick(industry)}
                className="h-auto py-2 flex flex-col gap-0.5 text-wrap"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs leading-tight">{INDUSTRY_LABELS[industry]}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Experience Selection */}
      {selectedIndustry && (
        <div className="space-y-4">
          <h3 className="text-md font-semibold">{INDUSTRY_LABELS[selectedIndustry]} Experiences</h3>

          <FormField
            control={control}
            name="experienceTypeIds"
            render={() => (
              <FormItem>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {INDUSTRY_EXPERIENCES[selectedIndustry].map((experience) => (
                    <FormField
                      key={experience.id}
                      control={control}
                      name="experienceTypeIds"
                      render={() => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 border rounded-lg p-3">
                          <FormControl>
                            <Checkbox
                              checked={experienceTypeIds.includes(experience.id)}
                              onCheckedChange={(checked) => handleExperienceToggle(experience.id, !!checked)}
                              disabled={!experienceTypeIds.includes(experience.id) && experienceTypeIds.length >= 10}
                            />
                          </FormControl>
                          <div className="flex-1">
                            <FormLabel className="font-medium text-sm cursor-pointer">{experience.title}</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {experienceTypeIds.length >= 10 && (
            <p className="text-sm text-muted-foreground">
              You&apos;ve reached the maximum of 10 experiences. Remove some to select others.
            </p>
          )}
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
