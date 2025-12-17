'use server'

import { EmployeeRole } from '@prisma/client'
import { redirect } from 'next/navigation'

import { getCachedSession } from '@/actions'
import { prisma } from '@/lib/prisma'
import { CurrentEmployee, ServerActionResult } from '@/types'
import { handleError, handleRedirectError } from '@/utils'

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
    handleRedirectError(error) // redirect() は NEXT_REDIRECT エラーをthrowするため、それを再throwする必要がある
    return handleError(error)
  }
}

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
    handleRedirectError(error) // redirect() は NEXT_REDIRECT エラーをthrowするため、それを再throwする必要がある
    return handleError(error)
  }
}
