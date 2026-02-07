import type { Metadata } from 'next'
import { Geist_Mono, Montserrat } from 'next/font/google'
import '../globals.css'

import { FullScreenContainer } from '@/components/containers'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/providers'

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'JobPop | Find Your Job, Pop Your Life',
  description: 'Connecting Job Seekers with Their Dream Careers',
}

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange>
          <Toaster />
          <FullScreenContainer>{children}</FullScreenContainer>
        </ThemeProvider>
      </body>
    </html>
  )
}
