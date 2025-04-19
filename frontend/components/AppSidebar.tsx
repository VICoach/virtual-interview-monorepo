"use client"

import * as React from "react"
import {
  History, 
  PlusIcon,
  User,
  Calendar
} from "lucide-react"
import { NavMain } from "@/components/NavMain"
import { NavUser } from "@/components/NavUser"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"


const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  }}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname() 


  const navMain = [
    {
      title: "Home",
      url: "/",
      icon: Calendar,
      isActive: pathname === "/",
    },
    {
      title: "Interview",
      url: "/interview",
      icon: User,
      isActive: pathname.startsWith("/interview"),
    },
    {
      title: "History",
      url: "/history",
      icon: History,
      isActive: pathname.startsWith("/history"),
    },
  ]
  return (
    <Sidebar collapsible="icon" className="bg-brand" {...props}>
      <SidebarHeader className="hidden md:block">
        <SidebarMenu>
          <SidebarMenuItem 
            className="flex items-center justify-between w-full group-data-[state=collapsed]:flex-col group-data-[state=collapsed]:items-center group-data-[state=collapsed]:gap-y-4"
          >
            <SidebarMenuButton 
              size="lg" 
              asChild
              className="hover:bg-white/5 transition-colors rounded-xl"
            >
              <Link 
                href="/" 
                className="flex items-center space-x-2 p-4 group-data-[state=collapsed]:p-2"
              >
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={50}
                  height={30}
                  className="h-8 w-8 transition-all duration-300 group-data-[state=collapsed]:h-6 group-data-[state=collapsed]:w-6"
                />
                <span className="text-base font-bold hidden lg:block text-white group-data-[state=collapsed]:hidden">
                  Virtual Interview
                </span>
              </Link>
            </SidebarMenuButton>
            <SidebarTrigger className="ml-auto group-data-[state=collapsed]:ml-0 group-data-[state=collapsed]:static " />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="mt-14 p-2">
          <SidebarMenuItem key="plus">
            <SidebarMenuButton 
              asChild 
              className="hover:bg-white bg-[#5B879E] rounded-full mb-8 mt-10"
              tooltip="Start new interview"
            >
              <Link href="/interview" className="flex items-center w-full text-white py-6 px-4">
                <PlusIcon className="size-5" />
                <span className="text-base font-bold ml-2">Start Interview</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter >
        <NavUser user={data.user} />
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}