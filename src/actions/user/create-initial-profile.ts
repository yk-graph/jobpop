'use server'

import { ZodError } from 'zod'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { initialProfileSchema, InitialProfileSchemaType } from '@/lib/zod'
import { ServerActionResult } from '@/types'

export async function createInitialProfile(
  data: InitialProfileSchemaType
): Promise<ServerActionResult<{ userId: string }>> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error('Authentication required')
    }
    const userId = session.user.id

    const validatedData = initialProfileSchema.parse(data)
    const { name, countryCode, birthYear, visaType, experienceTypeIds, softSkills } = validatedData

    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    })

    if (existingProfile) {
      throw new Error('Profile already exists')
    }

    // Tips: $transaction を使うことで複数のDB操作を一つのトランザクションとしてまとめて処理する
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { name },
      })

      await tx.profile.create({
        data: {
          userId,
          countryCode,
          birthYear,
          visaType,
        },
      })

      if (experienceTypeIds && experienceTypeIds.length > 0) {
        await tx.userExperience.createMany({
          data: experienceTypeIds.map((experienceTypeId) => ({
            userId,
            experienceTypeId,
          })),
        })
      }

      if (softSkills && softSkills.length > 0) {
        await tx.userSoftSkill.createMany({
          data: softSkills.map((skill) => ({
            userId,
            skill,
          })),
        })
      }
    })

    return {
      success: true,
      message: 'Profile created successfully!',
      data: { userId: session.user.id },
    }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.issues.map((issue) => issue.message).join(', '),
      }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create profile',
    }
  }
}
