import { Resend } from 'resend'
import { render } from '@react-email/render'

import { PasswordReset } from '@/components/email/password-reset'

const resend = new Resend(process.env.RESEND_API_KEY as string)

export async function POST(req: Request): Promise<Response> {
  try {
    const { email, token } = await req.json()

    if (!email || !token) {
      return new Response(JSON.stringify({ error: 'Email and token are required' }), { status: 400 })
    }

    // パスワードリセット用のURLを生成
    const resetUrl = `${process.env.APP_URL}/employer/reset-password?token=${token}`
    const emailHtml = await render(PasswordReset({ resetUrl }))

    const { data, error } = await resend.emails.send({
      from: 'JobPop <onboarding@resend.dev>',
      to: [email],
      subject: 'Reset your password',
      html: emailHtml,
    })

    if (error) {
      return new Response(JSON.stringify({ error }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, data }))
  } catch (error) {
    console.error('Password reset email sending error:', error)
    return new Response(JSON.stringify({ error: 'Failed to send password reset email' }), { status: 500 })
  }
}
