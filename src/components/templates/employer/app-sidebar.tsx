'use client'

import Image from 'next/image'
import Link from 'next/link'
import { EmployeeRole, User } from '@prisma/client'
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
      url: '/employer/stores',
      icon: Store,
      isMenuTrigger: false,
    },
    {
      name: 'Members',
      url: '/employer/members',
      icon: Users,
      isMenuTrigger: false,
    },
    {
      name: 'Jobs',
      url: '/employer/jobs',
      icon: Briefcase,
      isMenuTrigger: false,
    },
    {
      name: 'Applicants',
      url: '/employer/applicants',
      icon: FileText,
      isMenuTrigger: false,
    },
    {
      name: 'Messages',
      url: '/employer/messages',
      icon: Mail,
      isMenuTrigger: false,
    },
    {
      name: 'Analytics',
      url: '/employer/analytics',
      icon: BarChart3,
      isMenuTrigger: false,
    },
  ],
  secondaryItems: [
    {
      title: 'Company',
      url: '/employer/company',
      icon: Building2,
    },
    {
      title: 'Support',
      url: '/employer/support',
      icon: LifeBuoy,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User
  role: EmployeeRole
}

export function AppSidebar({ user, role, ...props }: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/employer/dashboard">
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
