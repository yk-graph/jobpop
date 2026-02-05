import type { Metadata } from 'next'
import { Montserrat, Geist_Mono } from 'next/font/google'
import '../globals.css'

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
      <body className={`${montserrat.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
