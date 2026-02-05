import { MenuButton } from '@/components/button'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-svh w-full flex justify-center items-center p-6">
      <MenuButton />
      {children}
    </div>
  )
}
