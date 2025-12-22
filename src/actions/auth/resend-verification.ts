'use server'

import { Prisma } from '@prisma/client'

import { TOKEN_EXPIRES_IN } from '@/constants'
import { prisma } from '@/lib/prisma'
import { ServerActionResult } from '@/types'
import { generateActivateToken } from '@/utils'

async function sendVerificationEmail(email: string, token: string): Promise<void> {
  try {
    await fetch(`${process.env.APP_URL}/api/send/verification`, {
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

export async function resendVerification(email: string): Promise<ServerActionResult<null>> {
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

    // 既にメール認証済みかチェック
    if (user.emailVerified) {
      return {
        success: false,
        message: 'Email is already verified. Please log in.',
      }
    }

    // 新しいトークンを生成
    const token = generateActivateToken(email)

    // トランザクション: 既存トークン削除 + 新規トークン作成
    await prisma.$transaction(async (tx) => {
      // 既存のトークンを削除（もしあれば）
      await tx.verificationToken.deleteMany({
        where: {
          identifier: email,
        },
      })

      // 新しいトークンを作成
      await tx.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires: new Date(Date.now() + TOKEN_EXPIRES_IN),
        },
      })
    })

    // メール送信（トランザクション外）
    await sendVerificationEmail(email, token)

    return {
      success: true,
      message: 'Verification email has been sent. Please check your inbox.',
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
