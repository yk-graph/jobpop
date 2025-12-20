'use server'

import { EmployeeRole } from '@prisma/client'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { initialOwnerSchema, InitialOwnerSchemaType } from '@/lib/zod'
import { ServerActionResult } from '@/types'
import { handleError, handleRedirectError } from '@/utils'

export async function createInitialOwner(
  values: InitialOwnerSchemaType
): Promise<ServerActionResult<{ companyId: string }>> {
  try {
    // Validate input
    const validatedFields = initialOwnerSchema.safeParse(values)

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Invalid input data',
      }
    }

    const data = validatedFields.data

    // Get current user session
    const session = await auth()

    if (!session?.user?.id) {
      redirect('/employer/login')
    }

    const userId = session.user.id

    // Check if user already has a company
    const existingEmployee = await prisma.employee.findFirst({
      where: { userId },
    })

    if (existingEmployee) {
      return {
        success: false,
        message: 'You are already associated with a company',
      }
    }

    // Create company and employee in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Step 1: Create Company
      const company = await tx.company.create({
        data: {
          name: data.companyName,
          description: data.companyDescription || null,
          website: data.companyWebsite || null,
        },
      })

      // Step 2: Create Employee record for current user as OWNER
      await tx.employee.create({
        data: {
          userId: userId,
          companyId: company.id,
          storeId: null,
          role: EmployeeRole.OWNER,
        },
      })

      // Step 3: Link additional employees if provided
      if (data.employeeEmails && data.employeeEmails.length > 0) {
        // Find users by email
        const usersToLink = await tx.user.findMany({
          where: {
            email: {
              in: data.employeeEmails,
            },
          },
          select: {
            id: true,
            email: true,
          },
        })

        // Create employee records for found users
        if (usersToLink.length > 0) {
          await tx.employee.createMany({
            data: usersToLink.map((user) => ({
              userId: user.id,
              companyId: company.id,
              storeId: null,
              role: EmployeeRole.STAFF,
            })),
            skipDuplicates: true, // Skip if user is already an employee
          })
        }
      }

      return {
        companyId: company.id,
      }
    })

    return {
      success: true,
      message: 'Company created successfully!',
      data: result,
    }
  } catch (error) {
    handleRedirectError(error, 'createInitialOwner')
    return handleError(error, 'createInitialOwner')
  }
}
