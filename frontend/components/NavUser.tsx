"use client"

import Link from "next/link"
import { LogOut } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="relative w-full bg-[#5B879E] hover:bg-[#4A7A8F] transition-colors rounded-lg"
          tooltip="Log out"
        >
          <Link href="/logout" className="flex items-center w-full text-white group">
            <Avatar className="h-8 w-8 rounded-lg border border-white/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg bg-white/10 text-white">
                {user.name.split(' ').map(name => name[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="grid flex-1 text-left text-sm leading-tight ml-2">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs text-white/80">{user.email}</span>
            </div>
            
            <LogOut className="ml-auto size-4 group-hover:text-slate-800 transition-colors" />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}