"use client"

import { AppSidebar } from "@/components/AppSidebar"
import MobileNavigation from "@/components/MobileNavigation";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
    <main className="flex h-screen min-h-screen overflow-hidden   sm:bg-cover sm:bg-center sm:bg-no-repeat">
    <SidebarProvider>
      <MobileNavigation />
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
    </main>
    </div>
  )
}

