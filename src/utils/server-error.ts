import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

// 共通エラーハンドラー
export function handleServerError(error: unknown, fnName: string): string {
  if (error instanceof ZodError) {
    console.error(`🚨 ZodError in ${fnName}`)
    return error.issues.map((issue) => issue.message).join(', ')
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`🚨 PrismaClientKnownRequestError in ${fnName}`)
    return `code ${error.code}: Database error occurred`
  }

  console.error(`🚨 Unknown Error in ${fnName}`)
  return error instanceof Error ? error.message : 'An unknown error occurred'
}
