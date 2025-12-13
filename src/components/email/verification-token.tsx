import { Body, Button, Container, Head, Html, Link, Preview, Section, Text } from '@react-email/components'
import * as React from 'react'

interface VerificationTokenProps {
  verificationUrl: string
}

export const VerificationToken = ({ verificationUrl }: VerificationTokenProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address to complete registration</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Logo Section */}
        <Text style={logo}>JobPop</Text>

        <Text style={greeting}>
          <strong>Welcome to JobPop!</strong>
        </Text>

        {/* Main Content Section */}
        <Section style={section}>
          <Text style={sectionText}>
            Please verify your email address to complete your registration and start exploring job opportunities.
          </Text>

          <Button style={button} href={verificationUrl}>
            Verify Email Address
          </Button>
        </Section>

        {/* Footer Links */}
        <Text style={footerLinks}>
          <Link style={footerLink}>Need help?</Link>
          {' ・ '}
          <Link style={footerLink}>Contact support</Link>
        </Text>

        {/* Additional Info */}
        <Text style={additionalInfo}>
          If the button above doesn&apos;t work, copy and paste this link:
          <br />
          <Link href={verificationUrl} style={urlLink}>
            {verificationUrl}
          </Link>
        </Text>

        <Text style={securityNote}>This verification link will expire in 24 hours for security purposes.</Text>

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
  backgroundColor: '#28a745',
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

const additionalInfo = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.5',
  textAlign: 'center' as const,
  margin: '20px 0',
}

const urlLink = {
  color: '#0366d6',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
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
