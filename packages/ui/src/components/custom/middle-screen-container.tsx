import { ReactNode } from 'react'

export function MiddleScreenContainer({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-y-8 items-center max-w-4/5 sm:max-w-md w-full">{children}</div>
}
