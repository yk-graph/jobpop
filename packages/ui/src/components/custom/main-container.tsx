import { ReactNode } from 'react'

export function MainContainer({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-6">{children}</div>
}
