export default function InitialsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center max-w-4/5 sm:max-w-sm min-h-svh w-full py-20">{children}</div>
    </div>
  )
}
