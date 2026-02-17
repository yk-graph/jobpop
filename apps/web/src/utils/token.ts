import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import { TOKEN_EXPIRES_IN } from '@/constants'

export function generateActivateToken(email: string): string {
  // ランダムトークンを生成
  const randomToken = crypto.randomBytes(32).toString('hex')

  // トークンとメールアドレスを署名して有効期限付きで返す
  return jwt.sign(
    {
      token: randomToken,
      email,
    },
    process.env.AUTH_SECRET!,
    { expiresIn: TOKEN_EXPIRES_IN }
  )
}

export type TokenResult = { success: true; email: string } | { success: false; error: string }

export function verifyActivateToken(token: string): TokenResult {
  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET!) as { email: string; token: string }
    return { success: true, email: decoded.email }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { success: false, error: 'Token has expired' }
    } else if (error instanceof jwt.JsonWebTokenError) {
      return { success: false, error: 'Invalid token' }
    } else {
      return { success: false, error: 'Token verification failed' }
    }
  }
}
