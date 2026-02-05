// 'use server'

// import { Profile } from '@prisma/client'
// import { redirect } from 'next/navigation'

// import { auth } from '@/lib/auth'
// import { prisma } from '@/lib/prisma'
// import { initialProfileSchema, InitialProfileSchemaType } from '@/lib/zod'
// import { ServerActionResult } from '@/types'
// import { handleError, handleRedirectError } from '@/utils'

// export async function getProfileByUserId(userId: string): Promise<ServerActionResult<Profile>> {
//   try {
//     const profile = await prisma.profile.findFirst({
//       where: { userId },
//     })

//     if (!profile) {
//       return {
//         success: false,
//         message: 'Profile not found',
//       }
//     }

//     return {
//       success: true,
//       message: 'Profile found',
//       data: profile,
//     }
//   } catch (error) {
//     return handleError(error, 'getProfileByUserId')
//   }
// }

// export async function createInitialProfile(
//   data: InitialProfileSchemaType
// ): Promise<ServerActionResult<{ userId: string }>> {
//   try {
//     const session = await auth()

//     if (!session?.user?.id) {
//       redirect('/login')
//     }

//     const userId = session.user.id

//     const validatedData = initialProfileSchema.parse(data)
//     const { name, countryCode, birthYear, visaType, experienceTypeIds, softSkills } = validatedData

//     const existingProfile = await prisma.profile.findUnique({
//       where: { userId },
//     })

//     if (existingProfile) {
//       return {
//         success: false,
//         message: 'Profile already exists',
//       }
//     }

//     // Tips: $transaction を使うことで複数のDB操作を一つのトランザクションとしてまとめて処理する
//     await prisma.$transaction(async (tx) => {
//       await tx.user.update({
//         where: { id: userId },
//         data: { name },
//       })

//       await tx.profile.create({
//         data: {
//           userId,
//           countryCode,
//           birthYear,
//           visaType,
//         },
//       })

//       if (experienceTypeIds && experienceTypeIds.length > 0) {
//         await tx.userExperience.createMany({
//           data: experienceTypeIds.map((experienceTypeId) => ({
//             userId,
//             experienceTypeId,
//           })),
//         })
//       }

//       if (softSkills && softSkills.length > 0) {
//         await tx.userSoftSkill.createMany({
//           data: softSkills.map((skill) => ({
//             userId,
//             skill,
//           })),
//         })
//       }
//     })

//     return {
//       success: true,
//       message: 'Profile created successfully!',
//       data: { userId },
//     }
//   } catch (error) {
//     handleRedirectError(error, 'createInitialProfile')
//     return handleError(error, 'createInitialProfile')
//   }
// }
