import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

interface VerificationEmailProps {
  verificationUrl: string
  userName: string
}

export const VerificationEmail = ({ verificationUrl, userName }: VerificationEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className="bg-white text-[#24292e] font-sans">
        <Preview>Verify your email for JobPop</Preview>
        <Container className="max-w-[480px] mx-auto pt-5 pb-12">
          <Img src="https://jobpop.ca/images/jobpop-icon.png" width="32" height="32" alt="JobPop" />

          <Text className="text-[24px] leading-tight">
            <strong>{userName}</strong>, please verify your email address.
          </Text>

          <Section className="p-6 border border-solid border-[#dedede] rounded-[5px] text-center">
            <Text className="mb-2 mt-0 text-left">
              Hey <strong>{userName}</strong>!
            </Text>
            <Text className="mb-2 mt-0 text-left">
              Welcome to JobPop. Thank you for signing up. Please confirm your email address by clicking the button
              below.
            </Text>

            <Button
              className="text-sm bg-[#28a745] text-white leading-normal rounded-lg py-3 px-6"
              href={verificationUrl}
            >
              Verify your email
            </Button>
          </Section>

          <Text className="text-center">
            <Link href="https://jobpop.ca" className="text-[#0366d6] text-[12px]">
              Visit JobPop
            </Link>{' '}
            ・{' '}
            <Link href="mailto:support@jobpop.ca" className="text-[#0366d6] text-[12px]">
              Contact support
            </Link>
          </Text>

          <Text className="text-[#6a737d] text-xs leading-6 text-center mt-[60px] mb-4">
            If you did not create an account, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)
