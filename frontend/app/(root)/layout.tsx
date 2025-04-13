"use client"

import { AppSidebar } from "@/components/AppSidebar"
import MobileNavigation from "@/components/MobileNavigation";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashLayout({ children }: { children: React.ReactNode }) {
  return (
    
    <main className="flex min-h-full  app-background bg-[url('/home-bg.png')] bg-cover bg-no-repeat bg-center">
    <SidebarProvider>
      <MobileNavigation />
      <AppSidebar />
      <SidebarInset>
        
        {children}
      </SidebarInset>
    </SidebarProvider>
    </main>
    
  )
}

