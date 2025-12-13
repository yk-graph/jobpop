import { ResendForm } from './resend-form'

export default function ResendVerificationPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center py-12">
      <h1 className="mb-6 text-2xl font-bold">Resend Verification Email</h1>
      <p className="mb-6 text-center text-gray-600">
        Enter your email address and we&apos;ll send you a new verification link.
      </p>
      <ResendForm />
    </div>
  )
}
