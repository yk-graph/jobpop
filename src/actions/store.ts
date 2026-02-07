'use server'

import { Store } from '@prisma/client'
import { headers } from 'next/headers'

import { auth } from '@/lib/better-auth/auth'
import { prisma } from '@/lib/prisma'
import { createStoreSchema, CreateStoreSchemaType, updateStoreSchema, UpdateStoreSchemaType } from '@/lib/zod'
import { ServerActionResult, StoreWithEmployees } from '@/types'
import { handleError, handleRedirectError } from '@/utils'

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

export async function createStore(
  companyId: string,
  values: CreateStoreSchemaType
): Promise<ServerActionResult<{ storeId: string }>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return { success: false, message: 'Unauthorized - Please log in' }
    }

    const validatedFields = createStoreSchema.safeParse(values)

    if (!validatedFields.success) {
      return { success: false, message: 'Invalid input data' }
    }

    const data = validatedFields.data

    // ユーザーがこの会社に所属しているか確認
    const employee = await prisma.employee.findFirst({
      where: {
        userId: session.user.id,
        companyId: companyId,
      },
    })

    if (!employee) {
      return { success: false, message: 'You are not authorized to create stores for this company' }
    }

    const store = await prisma.store.create({
      data: {
        companyId: companyId,
        name: data.storeName,
        description: data.storeDescription || null,
        thumbnailUrl: data.storeThumbnail || null,
        lat: data.lat || 0,
        lng: data.lng || 0,
        postalCode: data.postalCode,
        country: data.country,
        province: data.province,
        city: data.city,
        streetAddress: data.streetAddress,
        floor: data.floor || null,
        unit: data.unit || null,
        phoneNumber: data.phoneNumber || null,
      },
    })

    return {
      success: true,
      message: 'Store created successfully!',
      data: { storeId: store.id },
    }
  } catch (error) {
    handleRedirectError(error, 'createStore')
    return handleError(error, 'createStore')
  }
}

export async function updateStore(
  storeId: string,
  values: UpdateStoreSchemaType
): Promise<ServerActionResult<Store>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return { success: false, message: 'Unauthorized - Please log in' }
    }

    const validatedFields = updateStoreSchema.safeParse(values)

    if (!validatedFields.success) {
      return { success: false, message: 'Invalid input data' }
    }

    const data = validatedFields.data

    // 店舗を取得して権限チェック
    const existingStore = await prisma.store.findUnique({
      where: { id: storeId },
    })

    if (!existingStore) {
      return { success: false, message: 'Store not found' }
    }

    // ユーザーがこの会社に所属しているか確認
    const employee = await prisma.employee.findFirst({
      where: {
        userId: session.user.id,
        companyId: existingStore.companyId,
      },
    })

    if (!employee) {
      return { success: false, message: 'You are not authorized to update this store' }
    }

    const store = await prisma.store.update({
      where: { id: storeId },
      data: {
        name: data.storeName,
        description: data.storeDescription || null,
        thumbnailUrl: data.storeThumbnail || null,
        lat: data.lat ?? existingStore.lat,
        lng: data.lng ?? existingStore.lng,
        postalCode: data.postalCode ?? existingStore.postalCode,
        country: data.country ?? existingStore.country,
        province: data.province ?? existingStore.province,
        city: data.city ?? existingStore.city,
        streetAddress: data.streetAddress ?? existingStore.streetAddress,
        floor: data.floor || null,
        unit: data.unit || null,
        phoneNumber: data.phoneNumber || null,
      },
    })

    return {
      success: true,
      message: 'Store updated successfully!',
      data: store,
    }
  } catch (error) {
    handleRedirectError(error, 'updateStore')
    return handleError(error, 'updateStore')
  }
}
