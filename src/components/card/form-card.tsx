import { FormEvent, ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface FormCardProps {
  title?: string
  description?: string
  className?: string
  headerClassName?: string
  contentClassName?: string
  footerClassName?: string
  children: ReactNode
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
  submitButtonText?: string
  cancelButtonText?: string
  onCancel?: () => void
  isLoading?: boolean
  disabled?: boolean
  submitButtonClassName?: string
  cancelButtonClassName?: string
  showCancelButton?: boolean
  footerContent?: ReactNode
}

export function FormCard({
  title,
  description,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  children,
  onSubmit,
  submitButtonText = 'Submit',
  cancelButtonText = 'Cancel',
  onCancel,
  isLoading = false,
  disabled = false,
  submitButtonClassName,
  cancelButtonClassName,
  showCancelButton = false,
  footerContent,
}: FormCardProps) {
  return (
    <Card className={cn('w-full max-w-md', className)}>
      <form onSubmit={onSubmit}>
        {(title || description) && (
          <CardHeader className={headerClassName}>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}

        <CardContent className={cn('space-y-4', contentClassName)}>{children}</CardContent>

        <CardFooter className={cn('flex gap-2', footerClassName)}>
          {footerContent || (
            <>
              {showCancelButton && onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={disabled || isLoading}
                  className={cancelButtonClassName}
                >
                  {cancelButtonText}
                </Button>
              )}
              <Button type="submit" disabled={disabled || isLoading} className={cn('flex-1', submitButtonClassName)}>
                {isLoading ? 'Loading...' : submitButtonText}
              </Button>
            </>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}

export default FormCard
