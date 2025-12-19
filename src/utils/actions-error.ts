import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

import { ServerActionResult } from '@/types'

// 共通エラーハンドラー
export function handleError(error: unknown, fnName: string): ServerActionResult<never> {
  if (error instanceof ZodError) {
    console.log(`🚨 ZodError in ${fnName}`)
    return {
      success: false,
      message: error.issues.map((issue) => issue.message).join(', '),
    }
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log(`🚨 PrismaClientKnownRequestError in ${fnName}`)
    return {
      success: false,
      message: `code ${error.code}: Database error occurred`,
    }
  }

  console.log(`🚨 Unknown Error in ${fnName}`)
  return {
    success: false,
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  }
}

// redirect エラーのチェックと再throw | redirect() は NEXT_REDIRECT エラーをthrowするため、それを再throwする必要がある
export function handleRedirectError(error: unknown, fnName: string): void {
  if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
    console.log(`🚨 Redirecting Error in ${fnName}`)
    throw error
  }
}
