'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { EmployeeRole } from '@jobpop/database'
import { BarChart3, Briefcase, Building2, FileText, LifeBuoy, Mail, Store, Users } from 'lucide-react'

import { NavPrimary, NavSecondary, NavUser } from '@/components/templates/employer'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { SessionUser } from '@/types'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: SessionUser
  role: EmployeeRole
}

export function AppSidebar({ user, role, ...props }: AppSidebarProps) {
  const params = useParams()

  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
      isMenuTrigger: false,
    },
    primaryItems: [
      {
        name: 'Stores',
        url: 'stores',
        icon: Store,
        isMenuTrigger: false,
      },
      {
        name: 'Members',
        url: 'members',
        icon: Users,
        isMenuTrigger: false,
      },
      {
        name: 'Jobs',
        url: 'jobs',
        icon: Briefcase,
        isMenuTrigger: false,
      },
      {
        name: 'Applicants',
        url: 'applicants',
        icon: FileText,
        isMenuTrigger: false,
      },
      {
        name: 'Messages',
        url: 'messages',
        icon: Mail,
        isMenuTrigger: false,
      },
      {
        name: 'Analytics',
        url: 'analytics',
        icon: BarChart3,
        isMenuTrigger: false,
      },
    ],
    secondaryItems: [
      {
        title: 'Company',
        url: `/employer/companies/${params.companyId}`,
        icon: Building2,
      },
      {
        title: 'Support',
        url: 'support',
        icon: LifeBuoy,
      },
    ],
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={`/employer/companies/${params.companyId}/dashboard`}>
                <Image
                  height={80}
                  width={80}
                  src="/images/jobpop-icon.png"
                  alt="Inc Logo"
                  className="h-8 w-8 rounded-md"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-medium">Job Pop</span>
                  <span className="text-xs">for Employer</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary items={data.primaryItems} />
        <NavSecondary items={data.secondaryItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} role={role} />
      </SidebarFooter>
    </Sidebar>
  )
}
