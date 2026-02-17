import { ReactNode } from 'react'

export function FullScreenContainer({ children }: { children: ReactNode }) {
  return <div className="min-h-svh w-full flex justify-center items-center py-10 sm:py-20">{children}</div>
}
