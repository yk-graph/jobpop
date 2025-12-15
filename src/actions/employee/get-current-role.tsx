'use server'

import { EmployeeRole, Prisma } from '@prisma/client'
import { redirect } from 'next/navigation'
import { ZodError } from 'zod'

import { getCachedSession } from '@/actions'
import { prisma } from '@/lib/prisma'
import { ServerActionResult } from '@/types'

export async function getCurrentRole(): Promise<ServerActionResult<EmployeeRole>> {
  'use cache'
  try {
    const session = await getCachedSession()

    if (!session?.user?.id) {
      redirect('/employer/login')
    }

    const employeeRole = await prisma.employee.findFirst({
      where: { userId: session.user.id },
      select: {
        role: true,
      },
    })

    if (!employeeRole) {
      redirect('/employer/initialize') // 初期設定ページへリダイレクト -> OWNERとして Company, Store 情報を登録 or 既存 Company, Store に紐付けするページに遷移
    }

    return {
      success: true,
      message: 'Current employee role fetched successfully',
      data: employeeRole.role,
    }
  } catch (error) {
    // redirect() は NEXT_REDIRECT エラーをthrowするため、それを再throwする必要がある
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }

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
