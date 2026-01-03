'use server'

import { prisma } from '@/lib/prisma'
import { ServerActionResult, StoreWithEmployees } from '@/types'
import { handleError } from '@/utils'

export async function getStoresByCompanyId(companyId: string): Promise<ServerActionResult<StoreWithEmployees[]>> {
  try {
    const stores = await prisma.store.findMany({
      where: { companyId },
      include: {
        employees: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, message: 'Stores retrieved successfully', data: stores }
  } catch (error) {
    return handleError(error, 'getStoresByCompanyId')
  }
}

export async function getStoreById(storeId: string): Promise<ServerActionResult<StoreWithEmployees>> {
  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        employees: true,
      },
    })

    if (!store) {
      return { success: false, message: 'Store not found' }
    }

    return { success: true, message: 'Store retrieved successfully', data: store }
  } catch (error) {
    return handleError(error, 'getStoreById')
  }
}
