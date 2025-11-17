import { Profile } from '@prisma/client'
import { ZodError } from 'zod'

import { prisma } from '@/lib/prisma'
import { ServerActionResult } from '@/types'

export async function getProfileByUserId(userId: string): Promise<ServerActionResult<Profile>> {
  try {
    const profile = await prisma.profile.findFirst({
      where: { userId },
    })

    if (!profile) {
      return {
        success: false,
        message: 'Profile not found',
      }
    }

    return {
      success: true,
      message: 'Profile found',
      data: profile,
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
