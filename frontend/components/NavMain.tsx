"use client"

import Link from "next/link"
import { type LucideIcon } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="sr-only">Main Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              className={`transition-all duration-200 ${
                item.isActive ? 'bg-white text-[#121F54]' : 'text-white hover:bg-white hover:text-[#121F54]'
              } rounded-lg`}
              isActive={item.isActive}
              tooltip={item.title}
            >
              <Link
                href={item.url}
                className="flex items-center w-full p-2 rounded-lg"
              >
                {item.icon && (
                  <item.icon className="md:size-5 size-6" />
                )}
                <span className="text-base font-medium ml-2">
                  {item.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}