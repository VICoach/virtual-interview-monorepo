"use client"

import * as React from "react"
import Link from "next/link"
import { LogOut, User as UserIcon } from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="relative w-full bg-[#5B879E] hover:bg-[#4A7A8F] transition-colors rounded-lg cursor-pointer"
            >
              <div className="flex items-center w-full text-white group">
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
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 border-none shadow-lg bg-white dark:bg-gray-800"
          >
            <DropdownMenuItem asChild className="hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700">
              <Link href="/profile" className="flex items-center px-3 py-2 text-sm">
                <UserIcon className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="font-medium">Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
            <DropdownMenuItem asChild className="hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20">
              <Link href="/logout" className="flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="font-medium">Logout</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}