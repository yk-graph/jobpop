'use server'

import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

import { TOKEN_EXPIRES_IN } from '@/constants'
import { prisma } from '@/lib/prisma'
import { registerSchema, RegisterSchemaType } from '@/lib/zod'
import { ServerActionResult } from '@/types'
import { generateActivateToken, hashPassword } from '@/utils'

async function sendVerificationEmail(email: string, token: string): Promise<void> {
  try {
    await fetch(`${process.env.API_URL}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        token,
      }),
    })
  } catch (error) {
    console.error('Failed to send verification email:', error)
  }
}

export async function register(data: RegisterSchemaType): Promise<ServerActionResult<{ userId: string }>> {
  try {
    // Tips: parse -> エラーが発生した場合にZodErrorがthrowされる
    // Tips: safeParse -> successプロパティとdataプロパティを持つオブジェクトを返す
    const validatedData = registerSchema.parse(data)

    const { email, password } = validatedData

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    // 既にユーザーが存在する場合
    if (existingUser) {
      // メール検証済みの場合 -> エラーメッセージ返却
      return {
        success: false,
        message: 'User with this email already exists.',
      }
    }

    // ユーザーが存在しない場合
    const hashedPassword = await hashPassword(password)
    const token = generateActivateToken(email)

    // Tips: トランザクションを使ったPrismaの処理 -> トランザクション内でユーザー、検証トークンを作成
    const user = await prisma.$transaction(async (tx) => {
      // ユーザー作成
      const newUser = await tx.user.create({
        data: {
          email,
          hashedPassword,
        },
      })
      console.log('✅️ token:', token.length)

      // 検証トークン作成
      await tx.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires: new Date(Date.now() + TOKEN_EXPIRES_IN),
        },
      })

      return newUser
    })

    // メール送信（トランザクション外）
    await sendVerificationEmail(email, token)

    return {
      success: true,
      message: 'Please verify your email address to complete the registration.',
      data: { userId: user.id },
    }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.issues.map((issue) => issue.message).join(', '),
      }
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        success: false,
        message: 'Database error occurred',
      }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}
