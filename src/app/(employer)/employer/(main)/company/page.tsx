import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Building2, Link2, MapPin, Phone } from 'lucide-react'

import { getCurrentCompany } from '@/actions/company'
import { CardHeader } from '@/components/card'
import { InfoDescription, InfoItem, InfoWrapper, PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { auth } from '@/lib/auth'

export default async function CompanyPage() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('You must be logged in to view this page.')
  }

  const result = await getCurrentCompany(session.user.id)

  if (!result.success || !result.data) {
    redirect('/employer/initialize')
  }

  const company = result.data

  const fullAddress = [
    company.streetAddress,
    company.floor && `Floor: ${company.floor}`,
    company.unit && `Unit: ${company.unit}`,
    company.city,
    company.province,
    company.postalCode,
    company.country,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="container max-w-full space-y-6">
      <PageHeader
        title="Company Information"
        description="View and manage your company details"
        action={
          <Button variant="outline" asChild>
            <Link href="/employer/company/edit">Edit Company</Link>
          </Button>
        }
      />

      <Card className="border-none">
        <CardHeader
          title={company.name}
          description={`Company ID: ${company.id}`}
          icon={Building2}
          titleSize="2xl"
          copyValue={company.id}
        />
        <CardContent className="space-y-6">
          {company.description && (
            <div className="space-y-1">
              <h3 className="font-semibold">Description</h3>
              <p className="text-sm text-muted-foreground">{company.description}</p>
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Contact Information</h3>

            <div className="grid gap-3">
              <InfoItem icon={Phone} label="Phone" value={company.phoneNumber} copyValue={company.phoneNumber} />

              <InfoItem
                icon={Link2}
                label="Website"
                value={
                  company.website ? (
                    <Link
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline"
                    >
                      {company.website}
                    </Link>
                  ) : (
                    <p className="text-sm text-muted-foreground">-</p>
                  )
                }
              />

              <InfoItem icon={MapPin} label="Address" value={fullAddress} copyValue={fullAddress} />
            </div>
          </div>

          <Separator />

          <InfoWrapper responsive={false}>
            <InfoDescription label="Created" value={new Date(company.createdAt).toLocaleDateString()} />
            <InfoDescription label="Last Updated" value={new Date(company.updatedAt).toLocaleDateString()} />
          </InfoWrapper>
        </CardContent>
      </Card>

      <Card className="border-none">
        <CardHeader title="Address Details" titleSize="lg" />
        <CardContent>
          <InfoWrapper>
            <InfoDescription label="Street Address" value={company.streetAddress} />
            <InfoDescription label="Floor" value={company.floor} />
            <InfoDescription label="Unit" value={company.unit} />
            <InfoDescription label="City" value={company.city} />
            <InfoDescription label="Province" value={company.province} />
            <InfoDescription label="Postal Code" value={company.postalCode} />
            <InfoDescription label="Country" value={company.country} />
          </InfoWrapper>
        </CardContent>
      </Card>
    </div>
  )
}
