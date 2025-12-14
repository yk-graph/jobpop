'use server'

import { Prisma } from '@prisma/client'

import { TOKEN_EXPIRES_IN } from '@/constants'
import { prisma } from '@/lib/prisma'
import { ServerActionResult } from '@/types'
import { generateActivateToken } from '@/utils'

async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  try {
    await fetch(`${process.env.APP_URL}/api/send/password-reset`, {
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
    console.error('Failed to send password reset email:', error)
  }
}

export async function requestPasswordReset(email: string): Promise<ServerActionResult<null>> {
  try {
    // ユーザーの存在確認
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return {
        success: false,
        message: 'User not found. Please register first.',
      }
    }

    // メール未認証の場合
    if (!user.emailVerified) {
      return {
        success: false,
        message: 'Email is not verified. Please verify your email first.',
      }
    }

    // 新しいトークンを生成
    const token = generateActivateToken(email)

    // トランザクション: 既存トークン削除 + 新規トークン作成
    await prisma.$transaction(async (tx) => {
      // 既存のパスワードリセットトークンを削除（もしあれば）
      await tx.passwordResetToken.deleteMany({
        where: {
          identifier: email,
        },
      })

      // 新しいトークンを作成
      await tx.passwordResetToken.create({
        data: {
          identifier: email,
          token,
          expires: new Date(Date.now() + TOKEN_EXPIRES_IN),
        },
      })
    })

    // メール送信（トランザクション外）
    await sendPasswordResetEmail(email, token)

    return {
      success: true,
      message: 'Password reset email has been sent. Please check your inbox.',
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
