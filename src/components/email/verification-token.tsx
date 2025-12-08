import * as React from 'react'

interface VerificationTokenProps {
  verificationUrl: string
}

export function VerificationToken({ verificationUrl }: VerificationTokenProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>Welcome, JobPop!</h1>

      <p>Please verify your email address to complete your registration.</p>

      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a
          href={verificationUrl}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '4px',
            display: 'inline-block',
          }}
        >
          Verify Email
        </a>
      </div>

      <p style={{ fontSize: '14px', color: '#666' }}>Or copy this link: {verificationUrl}</p>
    </div>
  )
}
