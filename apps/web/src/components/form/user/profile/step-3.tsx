'use client'

import { useFormContext } from 'react-hook-form'
import { X } from 'lucide-react'
import type { SoftSkill } from '@prisma/client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { SOFT_SKILLS } from '@/constants'
import { getSoftSkillById } from '@/utils'

export function InitialProfileStep3() {
  const { control, setValue, watch } = useFormContext()

  const softSkills: SoftSkill[] = watch('softSkills')

  const handleClickBack = () => setValue('stepCount', 2)

  const handleSoftSkillToggle = (skillId: SoftSkill, checked: boolean) => {
    const currentSkills = softSkills

    if (checked) {
      // 最大7個まで
      if (currentSkills.length < 7) {
        setValue('softSkills', [...currentSkills, skillId])
      }
    } else {
      setValue(
        'softSkills',
        currentSkills.filter((skill) => skill !== skillId)
      )
    }
  }

  const handleRemoveSoftSkill = (skillId: SoftSkill) => {
    const currentSkills = softSkills
    setValue(
      'softSkills',
      currentSkills.filter((skill) => skill !== skillId)
    )
  }

  const isSkillSelected = (skillId: SoftSkill) => softSkills.includes(skillId)

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="text-lg font-bold text-center">Step 3: Soft Skills</h1>
        <p className="text-sm text-center text-muted-foreground">Select your soft skills.</p>
      </div>

      {/* Selected Soft Skills as Badges */}
      {softSkills.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Your Selected Skills ({softSkills.length}/7)</h3>
          <div className="flex flex-wrap gap-2">
            {softSkills.map((skillId) => {
              const softSkillData = getSoftSkillById(skillId)
              if (!softSkillData) return null

              return (
                <Badge
                  key={skillId}
                  variant="secondary"
                  className="flex items-center gap-2 cursor-pointer hover:bg-secondary/80"
                  onClick={() => handleRemoveSoftSkill(skillId)}
                >
                  {softSkillData.title}
                  <X className="h-3 w-3" />
                </Badge>
              )
            })}
          </div>
        </div>
      )}

      {/* Soft Skills Selection */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold">Available Soft Skills</h3>

        <FormField
          control={control}
          name="softSkills"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-1 gap-4">
                {SOFT_SKILLS.map((skill) => (
                  <Label key={skill.id} className="border rounded-lg p-4 cursor-pointer hover:bg-accent/50">
                    <div className="flex flex-row items-start space-x-3">
                      <Checkbox
                        checked={isSkillSelected(skill.id)}
                        onCheckedChange={(checked) => handleSoftSkillToggle(skill.id, !!checked)}
                        disabled={!isSkillSelected(skill.id) && softSkills.length >= 7}
                        className="mt-0.5 pointer-events-none"
                      />
                      <div className="flex-1 space-y-1">
                        <FormLabel className="font-medium text-sm cursor-pointer">{skill.title}</FormLabel>
                        <p className="text-xs text-muted-foreground">{skill.description}</p>
                      </div>
                    </div>
                  </Label>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {softSkills.length >= 7 && (
          <p className="text-sm text-muted-foreground">
            You&apos;ve reached the maximum of 7 soft skills. Remove some to select others.
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-start">
        <Button onClick={handleClickBack} variant="outline" type="button">
          Back
        </Button>
      </div>
    </div>
  )
}
