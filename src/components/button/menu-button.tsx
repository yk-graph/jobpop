'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { ChartNoAxesGantt, LogIn, LogOut, Settings, User, X } from 'lucide-react'
import Link from 'next/link'

import { logout } from '@/actions/auth/logout'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function MenuButton() {
  const { data: session } = useSession()

  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => setIsOpen(!isOpen)

  const handleMenuItemClick = async (action: string) => {
    console.log('Menu action:', action)
    setIsOpen(false)
  }

  const handleLogout = async () => await logout()

  return (
    <>
      <button
        onClick={handleToggle}
        className="fixed top-4 right-4 z-50 h-12 w-12 rounded-full bg-secondary flex items-center justify-center cursor-pointer"
      >
        {isOpen ? <X className="text-primary" /> : <ChartNoAxesGantt className="text-primary" />}
      </button>

      <div
        className={cn(
          'fixed top-4 right-4 z-30 h-12 w-12 rounded-full bg-secondary transition-all duration-700 ease-in-out',
          isOpen ? 'scale-[100]' : 'scale-100'
        )}
      />

      <div
        className={cn(
          'fixed inset-0 z-40 flex flex-col items-center justify-center transition-all duration-300 ease-in-out',
          isOpen ? 'opacity-100 pointer-events-auto delay-500' : 'opacity-0 pointer-events-none delay-0'
        )}
      >
        <div className="text-center space-y-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Menu</h2>

          <nav className="space-y-4">
            <Button
              variant="ghost"
              onClick={() => handleMenuItemClick('profile')}
              className="flex items-center gap-4 text-base group"
            >
              <User className="group-hover:scale-110 transition-transform" />
              Profile
            </Button>

            <Button
              variant="ghost"
              onClick={() => handleMenuItemClick('settings')}
              className="flex items-center gap-4 text-base group"
            >
              <Settings className="group-hover:scale-110 transition-transform" />
              Settings
            </Button>

            {!session ? (
              <Link href="/login" className="flex">
                <Button variant="ghost" className="flex items-center gap-4 text-base group">
                  <LogIn className="group-hover:scale-110 transition-transform" />
                  Login
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-4 text-base group">
                <LogOut className="group-hover:scale-110 transition-transform" />
                Logout
              </Button>
            )}
          </nav>
        </div>
      </div>
    </>
  )
}
