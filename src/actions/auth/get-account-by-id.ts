import { Account } from '@prisma/client'
import { ZodError } from 'zod'

import { prisma } from '@/lib/prisma'
import { ServerActionResult } from '@/types'

export async function getAccountById(userId: string): Promise<ServerActionResult<Account>> {
  try {
    const account = await prisma.account.findFirst({
      where: { userId },
    })

    if (!account) {
      throw new Error('Account not found')
    }

    return {
      success: true,
      message: 'Account found',
      data: account,
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.issues.map((issue) => issue.message).join(', '),
      }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}
