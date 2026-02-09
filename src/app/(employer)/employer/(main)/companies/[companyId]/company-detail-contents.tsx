'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Company, EmployeeRole } from '@prisma/client'
import { Building2, Globe, MapPin, Phone } from 'lucide-react'
import { Element } from 'react-scroll'

import { CardHeader } from '@/components/card'
import { InfoDescription, InfoItem, InfoWrapper, ScrollNav } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { isAdminOrAbove } from '@/utils'

const navItems = [
  { label: 'Detail', to: 'detail' },
  { label: 'Stores', to: 'stores' },
  { label: 'Employees', to: 'employees' },
]

interface CompanyDetailContentsProps {
  company: Company
  role: EmployeeRole | null
}

export function CompanyDetailContents({ company, role }: CompanyDetailContentsProps) {
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
    <>
      <ScrollNav items={navItems} />

      {/* Detail Section */}
      <Element name="detail">
        <Card className="border-none">
          <CardHeader
            title={company.name}
            description={`Company ID: ${company.id}`}
            icon={Building2}
            titleSize="2xl"
            copyValue={company.id}
            action={
              role && isAdminOrAbove(role) ? (
                <Button size={'sm'} asChild>
                  <Link href={`/employer/companies/${company.id}/edit`}>Edit</Link>
                </Button>
              ) : null
            }
          />
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="relative w-full md:w-64 aspect-video overflow-hidden rounded-lg md:aspect-square">
                {company.logoUrl ? (
                  <Image src={company.logoUrl} alt={company.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Building2 className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Description & Contact */}
              <div className="flex-1 space-y-4">
                {company.description && (
                  <div className="space-y-1">
                    <h3 className="font-semibold">Description</h3>
                    <p className="text-sm text-muted-foreground">{company.description}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="font-semibold">Contact Information</h3>
                  <div className="grid gap-2">
                    <InfoItem icon={Phone} label="Phone" value={company.phoneNumber} />
                    <InfoItem icon={MapPin} label="Address" value={fullAddress} />
                    {company.website && <InfoItem icon={Globe} label="Website" value={company.website} />}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Address Details */}
            <div className="space-y-4">
              <h3 className="font-semibold">Address Details</h3>
              <InfoWrapper>
                <InfoDescription label="Street Address" value={company.streetAddress} />
                <InfoDescription label="Floor" value={company.floor} />
                <InfoDescription label="Unit" value={company.unit} />
                <InfoDescription label="City" value={company.city} />
                <InfoDescription label="Province" value={company.province} />
                <InfoDescription label="Postal Code" value={company.postalCode} />
                <InfoDescription label="Country" value={company.country} />
              </InfoWrapper>
            </div>

            <Separator />

            {/* Timestamps */}
            <InfoWrapper responsive={false}>
              <InfoDescription label="Created" value={new Date(company.createdAt).toLocaleDateString()} />
              <InfoDescription label="Last Updated" value={new Date(company.updatedAt).toLocaleDateString()} />
            </InfoWrapper>
          </CardContent>
        </Card>
      </Element>

      {/* Stores Section */}
      <Element name="stores">
        <Card className="border-none">
          <CardHeader title="Stores" titleSize="lg" />
          <CardContent>
            <p className="text-muted-foreground">No stores registered yet.</p>
          </CardContent>
        </Card>
      </Element>

      {/* Employees Section */}
      <Element name="employees">
        <Card className="border-none">
          <CardHeader title="Employees" titleSize="lg" />
          <CardContent>
            <p className="text-muted-foreground">No employees assigned yet.</p>
          </CardContent>
        </Card>
      </Element>
    </>
  )
}
