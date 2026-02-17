import { User } from 'lucide-react'

import { CardHeader, ThumbnailWithNameCard } from '@/components/card'
import { Card, CardContent } from '@jobpop/ui'
import { getEmployeesByCompanyId } from '@/services'

interface MembersSectionProps {
  companyId: string
}

export default async function MembersSection({ companyId }: MembersSectionProps) {
  const employees = await getEmployeesByCompanyId(companyId)

  if (!employees || employees.length === 0) {
    return <p className="text-muted-foreground">No employees assigned yet.</p>
  }

  return (
    <section id="members">
      <Card className="border-none">
        <CardHeader title="Members" titleSize="lg" description={`Total Members: ${employees.length}`} />
        <CardContent>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {employees.map((employee) => (
              <ThumbnailWithNameCard
                key={employee.id}
                name={employee.user.name}
                thumbnailUrl={employee.user.image}
                size="sm"
                aspect="square"
                rounded="full"
                fallbackIcon={User}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
