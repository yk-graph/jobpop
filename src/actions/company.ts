// 'use server'

// import { Company, EmployeeRole } from '@prisma/client'
// import { redirect } from 'next/navigation'

// import { auth } from '@/lib/auth'
// import { prisma } from '@/lib/prisma'
// import { initialOwnerSchema, InitialOwnerSchemaType } from '@/lib/zod'
// import { ServerActionResult } from '@/types'
// import { handleError, handleRedirectError } from '@/utils'

// export async function getCurrentCompany(userId: string): Promise<ServerActionResult<Company>> {
//   try {
//     // ユーザーの従業員レコードから会社情報を取得
//     const employee = await prisma.employee.findFirst({
//       where: { userId },
//       include: {
//         company: true,
//       },
//     })

//     if (!employee) {
//       return {
//         success: false,
//         message: 'You are not associated with any company',
//       }
//     }

//     if (!employee.company) {
//       return {
//         success: false,
//         message: 'Company not found',
//       }
//     }

//     return {
//       success: true,
//       message: 'Company retrieved successfully',
//       data: employee.company,
//     }
//   } catch (error) {
//     handleRedirectError(error, 'getCurrentCompany')
//     return handleError(error, 'getCurrentCompany')
//   }
// }

// export async function createInitialCompany(
//   values: InitialOwnerSchemaType
// ): Promise<ServerActionResult<{ companyId: string }>> {
//   try {
//     const validatedFields = initialOwnerSchema.safeParse(values)

//     if (!validatedFields.success) {
//       return {
//         success: false,
//         message: 'Invalid input data',
//       }
//     }

//     const data = validatedFields.data

//     const session = await auth()

//     if (!session?.user?.id) {
//       redirect('/employer/login')
//     }

//     const userId = session.user.id

//     const existingEmployee = await prisma.employee.findFirst({
//       where: { userId },
//     })

//     if (existingEmployee) {
//       return {
//         success: false,
//         message: 'You are already associated with a company',
//       }
//     }

//     const result = await prisma.$transaction(async (tx) => {
//       // Step 1: Create Company
//       const company = await tx.company.create({
//         data: {
//           id: data.companyName.replace(/\s+/g, '_').trim().toLowerCase(), // company id を会社名から生成
//           name: data.companyName,
//           description: data.companyDescription || null,
//           website: data.companyWebsite || null,
//           phoneNumber: data.phoneNumber,
//           postalCode: data.postalCode,
//           country: data.country,
//           province: data.province,
//           city: data.city,
//           streetAddress: data.streetAddress,
//           floor: data.floor || null,
//           unit: data.unit || null,
//         },
//       })

//       // Step 2: Create User Name update
//       await tx.user.update({
//         where: { id: userId },
//         data: {
//           name: data.userName,
//         },
//       })

//       // Step 3: Create Employee record for current user as OWNER
//       await tx.employee.create({
//         data: {
//           id: `${company.id}_${userId}`, // StoreId_UserId を組み合わせた一意識別子
//           userId: userId,
//           companyId: company.id,
//           storeId: null,
//           role: EmployeeRole.OWNER,
//         },
//       })

//       return {
//         companyId: company.id,
//       }
//     })

//     return {
//       success: true,
//       message: 'Company created successfully!',
//       data: result,
//     }
//   } catch (error) {
//     handleRedirectError(error, 'createInitialCompany')
//     return handleError(error, 'createInitialCompany')
//   }
// }
