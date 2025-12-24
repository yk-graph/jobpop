'use server'

import { EmployeeRole } from '@prisma/client'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { CurrentEmployee, ServerActionResult } from '@/types'
import { handleError, handleRedirectError } from '@/utils'

export async function getCurrentRoleByUserId(userId: string): Promise<ServerActionResult<EmployeeRole>> {
  try {
    const employeeRole = await prisma.employee.findFirst({
      where: { userId },
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
    handleRedirectError(error, 'getCurrentRoleByUserId') // redirect() は NEXT_REDIRECT エラーをthrowするため、それを再throwする必要がある
    return handleError(error, 'getCurrentRoleByUserId')
  }
}

export async function getCurrentEmployee(userId: string): Promise<ServerActionResult<CurrentEmployee>> {
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
    handleRedirectError(error, 'getCurrentEmployee') // redirect() は NEXT_REDIRECT エラーをthrowするため、それを再throwする必要がある
    return handleError(error, 'getCurrentEmployee')
  }
}
