'use server'

import { AuthError } from 'next-auth'
import { ZodError } from 'zod'

import { signIn } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { registerSchema, RegisterSchemaType } from '@/lib/zod'
import { ServerActionResult } from '@/types'
import { hashPassword } from '@/utils'

export async function register(data: RegisterSchemaType): Promise<ServerActionResult<{ userId: string }>> {
  try {
    // Tips: parse -> エラーが発生した場合にZodErrorがthrowされる
    // Tips: safeParse -> successプロパティとdataプロパティを持つオブジェクトを返す
    const validatedData = registerSchema.parse(data)

    const { email, password } = validatedData

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      // メール未検証の場合、トークン再送
      if (!existingUser.emailVerified) {
        // 既存トークン削除
        await prisma.verificationToken.deleteMany({
          where: { identifier: email },
        })

        // 新規トークン作成
        const token = generateVerificationToken()
        await prisma.verificationToken.create({
          data: {
            identifier: email,
            token,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        })

        // メール再送
        await sendVerificationEmail(email, token)

        return {
          success: false,
          message: 'Email not verified. Verification email resent.',
        }
      }

      return {
        success: false,
        message: 'User with this email already exists.',
      }
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    })

    // 登録後に自動ログイン
    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    })

    return {
      success: true,
      message: 'Account Created and Signed In!',
      data: { userId: user.id },
    }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.issues.map((issue) => issue.message).join(', '),
      }
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            success: false,
            message: 'Registration successful but auto-login failed. Please sign in manually.',
          }
        default:
          return {
            success: false,
            message: 'Registration successful but authentication error occurred',
          }
      }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}
