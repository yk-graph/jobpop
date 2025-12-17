import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

import { ServerActionResult } from '@/types'

// 共通エラーハンドラー
export function handleError(error: unknown): ServerActionResult<never> {
  if (error instanceof ZodError) {
    return {
      success: false,
      message: error.issues.map((issue) => issue.message).join(', '),
    }
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return {
      success: false,
      message: `code ${error.code}: Database error occurred`,
    }
  }

  return {
    success: false,
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  }
}

// redirect エラーのチェックと再throw | redirect() は NEXT_REDIRECT エラーをthrowするため、それを再throwする必要がある
export function handleRedirectError(error: unknown): void {
  if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
    throw error
  }
}
