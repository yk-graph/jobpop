import { Resend } from 'resend'

import { VerificationToken } from '@/components/email'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request): Promise<Response> {
  try {
    const { email, token } = await req.json()

    if (!email || !token) {
      return new Response(JSON.stringify({ error: 'Email and token are required' }), { status: 400 })
    }

    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}&email=${email}`

    const { data, error } = await resend.emails.send({
      from: 'JobPop <onboarding@resend.dev>',
      to: [email],
      subject: 'Verify your email address',
      react: VerificationToken({
        verificationUrl,
      }),
    })

    if (error) {
      return new Response(JSON.stringify({ error }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, data }))
  } catch (error) {
    console.error('Email sending error:', error)
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 })
  }
}
