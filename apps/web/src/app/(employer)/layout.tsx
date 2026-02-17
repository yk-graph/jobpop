import type { Metadata } from 'next'
import { Montserrat, Geist_Mono } from 'next/font/google'
import '../globals.css'

import { Toaster } from '@jobpop/ui'
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
  title: 'JobPop for Employers',
  description: 'Find the perfect candidates for your job openings with JobPop Employer Portal.',
}

export default function EmployerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
