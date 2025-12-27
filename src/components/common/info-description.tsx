interface InfoDescriptionProps {
  label: string
  value?: string | null
}

export function InfoDescription({ label, value }: InfoDescriptionProps) {
  return (
    <div>
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm">{value || '-'}</dd>
    </div>
  )
}
