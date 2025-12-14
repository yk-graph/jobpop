'use server'

import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { ServerActionResult } from '@/types'
import { hashPassword, verifyActivateToken } from '@/utils'

export async function resetPassword(
  token: string,
  email: string,
  newPassword: string
): Promise<ServerActionResult<null>> {
  try {
    // ステップ1: JWTの検証（改ざん・署名・有効期限チェック）
    const jwtResult = verifyActivateToken(token)
    if (!jwtResult.success) {
      return {
        success: false,
        message: jwtResult.error,
      }
    }

    // メールアドレスの一致確認
    if (jwtResult.email !== email) {
      return {
        success: false,
        message: 'Invalid token.',
      }
    }

    // ステップ2: ユーザーの存在確認
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return {
        success: false,
        message: 'User not found.',
      }
    }

    // ステップ3: DBのトークン検証（存在確認）
    const dbToken = await prisma.passwordResetToken.findUnique({
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
        message: 'Invalid or already used token. Please request a new password reset.',
      }
    }

    // ステップ4: DBの有効期限チェック
    if (dbToken.expires < new Date()) {
      // 期限切れトークンは削除
      await prisma.passwordResetToken.delete({
        where: {
          identifier_token: {
            identifier: email,
            token,
          },
        },
      })

      return {
        success: false,
        message: 'Token has expired. Please request a new password reset.',
      }
    }

    // ステップ5: パスワード更新とトークン削除（トランザクション）
    const hashedPassword = await hashPassword(newPassword)

    await prisma.$transaction([
      // パスワード更新
      prisma.user.update({
        where: { email },
        data: { hashedPassword },
      }),
      // トークン削除（1回のみ使用可能にする）
      prisma.passwordResetToken.delete({
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
      message: 'Password has been reset successfully. Please log in with your new password.',
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
