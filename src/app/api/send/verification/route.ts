import { Resend } from 'resend'
import { render } from '@react-email/render'

import { VerificationToken } from '@/components/email/verification-token'

const resend = new Resend(process.env.RESEND_API_KEY as string)

export async function POST(req: Request): Promise<Response> {
  try {
    const { email, token } = await req.json()

    if (!email || !token) {
      return new Response(JSON.stringify({ error: 'Email and token are required' }), { status: 400 })
    }

    // メール認証用のURLを生成
    const verificationUrl = `${process.env.APP_URL}/employer/activate?token=${token}`
    const emailHtml = await render(VerificationToken({ verificationUrl }))

    const { data, error } = await resend.emails.send({
      from: 'JobPop <onboarding@resend.dev>',
      to: [email],
      subject: 'Verify your email address',
      html: emailHtml,
    })

    if (error) {
      return new Response(JSON.stringify({ error }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, data }))
  } catch (error) {
    console.error('Verification email sending error:', error)
    return new Response(JSON.stringify({ error: 'Failed to send verification email' }), { status: 500 })
  }
}
