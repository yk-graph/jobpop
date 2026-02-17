'use server'

import { User } from '@jobpop/database'

import { prisma } from '@/lib/prisma'
import { ServerActionResult } from '@/types'
import { handleError } from '@/utils'

export async function getUserById(id: string): Promise<ServerActionResult<User>> {
  try {
    const user = await prisma.user.findFirst({
      where: { id },
    })

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      }
    }

    return {
      success: true,
      message: 'User found',
      data: user,
    }
  } catch (error) {
    return handleError(error, 'getUserById')
  }
}
