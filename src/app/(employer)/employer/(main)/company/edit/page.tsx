import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Building2 } from 'lucide-react'

import { getCurrentCompany } from '@/actions/company'
import { CardHeader } from '@/components/card'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { auth } from '@/lib/auth'

export default async function CompanyEditPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/employer/login')
  }

  const result = await getCurrentCompany(session.user.id)

  if (!result.success || !result.data) {
    redirect('/employer/initialize')
  }

  const company = result.data

  return (
    <div className="container max-w-full space-y-6">
      <PageHeader
        title="Edit Company"
        description="Update your company information"
        action={
          <Button variant="outline" asChild>
            <Link href="/employer/company">Cancel</Link>
          </Button>
        }
      />

      <form>
        <div className="space-y-6">
          <Card className="border-none">
            <CardHeader title="Basic Information" icon={Building2} titleSize="xl" />
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input id="name" name="name" defaultValue={company.name} placeholder="Enter company name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    defaultValue={company.phoneNumber}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  defaultValue={company.website || ''}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={company.description || ''}
                  placeholder="Enter company description"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none">
            <CardHeader title="Address Information" titleSize="xl" />
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    defaultValue={company.postalCode}
                    placeholder="Enter postal code"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" defaultValue={company.country} placeholder="Enter country" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <Input id="province" name="province" defaultValue={company.province} placeholder="Enter province" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" defaultValue={company.city} placeholder="Enter city" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  name="streetAddress"
                  defaultValue={company.streetAddress}
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    name="floor"
                    defaultValue={company.floor || ''}
                    placeholder="e.g., 2F, Ground Floor"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input id="unit" name="unit" defaultValue={company.unit || ''} placeholder="e.g., Unit 205" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/employer/company">Cancel</Link>
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </div>
      </form>
    </div>
  )
}
