'use client'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { X, Plus } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export function InitialOwnerStep2() {
  const { control, setValue, watch } = useFormContext()
  const [emailInput, setEmailInput] = useState('')
  const [emailError, setEmailError] = useState('')

  const employeeEmails: string[] = watch('employeeEmails') || []

  const handleClickBack = () => setValue('stepCount', 1)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleAddEmail = () => {
    setEmailError('')

    if (!emailInput.trim()) {
      setEmailError('Email address is required')
      return
    }

    if (!validateEmail(emailInput)) {
      setEmailError('Invalid email address')
      return
    }

    if (employeeEmails.includes(emailInput)) {
      setEmailError('This email has already been added')
      return
    }

    if (employeeEmails.length >= 10) {
      setEmailError('Maximum 10 employees allowed')
      return
    }

    setValue('employeeEmails', [...employeeEmails, emailInput])
    setEmailInput('')
  }

  const handleRemoveEmail = (email: string) => {
    setValue(
      'employeeEmails',
      employeeEmails.filter((e) => e !== email)
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddEmail()
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="text-lg font-bold text-center">Step 2: Link Employees</h1>
        <p className="text-sm text-center text-muted-foreground">
          Invite employees to your company (optional, max 10).
        </p>
      </div>

      {/* Information Card */}
      <div className="border rounded-lg p-4 bg-muted/50">
        <h3 className="text-sm font-semibold mb-2">How it works:</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Enter email addresses of existing users you want to link to your company</li>
          <li>They will be automatically added as employees when you submit</li>
          <li>You can skip this step and add employees later</li>
        </ul>
      </div>

      {/* Selected Employees */}
      {employeeEmails.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Added Employees ({employeeEmails.length}/10)</h3>
          <div className="flex flex-wrap gap-2">
            {employeeEmails.map((email) => (
              <Badge
                key={email}
                variant="secondary"
                className="flex items-center gap-2 cursor-pointer hover:bg-secondary/80"
                onClick={() => handleRemoveEmail(email)}
              >
                {email}
                <X className="h-3 w-3" />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Add Employee Email */}
      <FormField
        control={control}
        name="employeeEmails"
        render={() => (
          <FormItem>
            <FormLabel>Employee Email Address</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input
                  placeholder="employee@example.com"
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value)
                    setEmailError('')
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={employeeEmails.length >= 10}
                />
              </FormControl>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddEmail}
                disabled={employeeEmails.length >= 10 || !emailInput.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {emailError && <p className="text-sm text-destructive">{emailError}</p>}
            <FormDescription>
              {employeeEmails.length >= 10
                ? "You've reached the maximum of 10 employees"
                : 'Press Enter or click + to add email'}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Summary */}
      <div className="border rounded-lg p-4 bg-muted/50 space-y-2">
        <h3 className="text-sm font-semibold">Summary</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>
            <span className="font-medium">Company:</span> {watch('companyName') || 'Not set'}
          </p>
          <p>
            <span className="font-medium">Employees to link:</span> {employeeEmails.length}
          </p>
        </div>
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
