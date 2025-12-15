'use server'

import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

import { prisma } from '@/lib/prisma'
import { CurrentEmployee, ServerActionResult } from '@/types'
import { redirect } from 'next/navigation'

export async function getCurrentEmployee(userId: string): Promise<ServerActionResult<CurrentEmployee>> {
  'use cache'
  try {
    const employee = await prisma.employee.findFirst({
      where: { userId },
      include: {
        user: true,
        company: true,
        store: true,
      },
    })

    if (!employee) {
      redirect('/employer/login')
    }

    return {
      success: true,
      message: 'Current employee fetched successfully',
      data: employee,
    }
  } catch (error) {
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
}
