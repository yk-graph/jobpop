'use server'

import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { ServerActionResult } from '@/types'
import { verifyActivateToken } from '@/utils'

export async function activateAccount(token: string): Promise<ServerActionResult<null>> {
  try {
    // ステップ1: JWTの検証（改ざん・署名・有効期限チェック）
    const jwtResult = verifyActivateToken(token)
    if (!jwtResult.success) {
      return {
        success: false,
        message: jwtResult.error,
      }
    }

    const email = jwtResult.email

    // ステップ2: ユーザーの存在確認 + 認証済みチェック（最優先）
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return {
        success: false,
        message: 'User not found. Please register for an account.',
      }
    }

    // 既に認証済みの場合は即座に終了（トークンチェック不要）
    if (user.emailVerified) {
      return {
        success: false,
        message: 'This account is already verified. Please log in.',
      }
    }

    // ステップ3: DBのトークン検証（存在確認）
    const dbToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token: token,
        },
      },
    })

    if (!dbToken) {
      return {
        success: false,
        message: 'Invalid token. Please request a new verification email.',
      }
    }

    // ステップ4: DBの有効期限チェック
    if (dbToken.expires < new Date()) {
      // 期限切れトークンは削除
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: email,
            token,
          },
        },
      })

      return {
        success: false,
        message: 'Token has expired. Please request a new verification email.',
      }
    }

    // ステップ5: メール認証完了とトークン削除（トランザクション）
    await prisma.$transaction([
      // メール認証完了
      prisma.user.update({
        where: { email },
        data: { emailVerified: new Date() },
      }),
      // トークン削除（1回のみ使用可能にする）
      prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: email,
            token: token,
          },
        },
      }),
    ])

    return {
      success: true,
      message: 'Email verification completed successfully',
      data: null,
    }
  } catch (error: unknown) {
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
