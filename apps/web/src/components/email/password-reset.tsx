import { Body, Button, Container, Head, Html, Link, Preview, Section, Text } from '@react-email/components'
import * as React from 'react'

interface PasswordResetProps {
  resetUrl: string
}

export const PasswordReset = ({ resetUrl }: PasswordResetProps) => (
  <Html>
    <Head />
    <Preview>Reset your password</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Logo Section */}
        <Text style={logo}>JobPop</Text>

        <Text style={greeting}>
          <strong>Password Reset Request</strong>
        </Text>

        {/* Main Content Section */}
        <Section style={section}>
          <Text style={sectionText}>
            We received a request to reset your password. Click the button below to create a new password.
          </Text>

          <Button style={button} href={resetUrl}>
            Reset Password
          </Button>

          <Text style={sectionText}>
            If you didn&apos;t request a password reset, you can safely ignore this email.
          </Text>
        </Section>

        {/* Footer Links */}
        <Text style={footerLinks}>
          <Link style={footerLink}>Need help?</Link>
          {' ・ '}
          <Link style={footerLink}>Contact support</Link>
        </Text>

        <Text style={securityNote}>This password reset link will expire in 24 hours for security purposes.</Text>

        {/* Company Footer */}
        <Text style={companyFooter}>JobPop, Inc. ・ Building the future of job discovery</Text>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#ffffff',
  color: '#24292e',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  maxWidth: '480px',
  margin: '0 auto',
  paddingTop: '20px',
  paddingBottom: '48px',
  paddingLeft: '0',
  paddingRight: '0',
}

const logo = {
  color: '#007bff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  textAlign: 'left' as const,
}

const greeting = {
  fontSize: '24px',
  lineHeight: '1.25',
  margin: '0 0 20px 0',
  color: '#24292e',
}

const section = {
  padding: '24px',
  border: '1px solid #dedede',
  borderRadius: '5px',
  textAlign: 'center' as const,
  margin: '20px 0',
}

const sectionText = {
  margin: '0 0 20px 0',
  textAlign: 'left' as const,
  color: '#24292e',
  fontSize: '16px',
  lineHeight: '1.5',
}

const button = {
  fontSize: '14px',
  backgroundColor: '#dc3545',
  color: '#ffffff',
  lineHeight: 'normal',
  borderRadius: '8px',
  padding: '12px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
}

const footerLinks = {
  textAlign: 'center' as const,
  margin: '20px 0',
}

const footerLink = {
  color: '#0366d6',
  fontSize: '12px',
  textDecoration: 'underline',
}

const securityNote = {
  color: '#6a737d',
  fontSize: '12px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  margin: '20px 0',
}

const companyFooter = {
  color: '#6a737d',
  fontSize: '12px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  marginTop: '60px',
  marginBottom: '16px',
}
