"use client"

import * as React from "react"
import {
  History,
  PlusIcon,
  Menu,
  Calendar,
  User,
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"
import Image from "next/image"

const navItems = [
  {
    title: "Home",
    url: "/",
    icon: Calendar,
    isActive: true,
  },
  {
    title: "Interview",
    url: "/interview",
    icon: User,
  },
  {
    title: "History",
    url: "/history",
    icon: History,
  },
]

export default function MobileNavigation() {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  
  if (!isMobile) return null
  
  return (
    <div className="fixed top-0 left-0 z-50 w-full bg-transparent p-4 md:hidden">
      <div className="flex items-center justify-between">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] bg-blue-dark p-0 border-r-0">
            <div className="flex flex-col h-full text-white">
              <div className="p-4 border-b border-white/10">
                <Link href="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
                  <Image
                    src="/logo.png"
                    alt="logo"
                    width={40}
                    height={24}
                    className="h-8 w-8"
                  />
                  <span className="text-base font-bold">Virtual Interview</span>
                </Link>
              </div>
              
              <div className="p-4">
                <Link
                  href="/"
                  className="flex items-center w-full text-white p-3  bg-[#5B879E]  hover:bg-[#4A7A8F] transition-colors rounded-full mt-10 mb-8"
                  onClick={() => setOpen(false)}
                >
                  <PlusIcon className="size-5" />
                  <span className="text-base font-bold ml-2">Start Interview</span>
                </Link>
                
                <nav className="space-y-2 mt-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.url}
                      className={`flex items-center w-full p-3 rounded-full transition-all duration-200 ${
                        item.isActive ? 'bg-white/15 ' : ''
                      } hover:bg-white/20 group`}
                      onClick={() => setOpen(false)}
                    >
                      {item.icon && <item.icon className="size-5 group-hover:text-slate-800 transition-colors" />}
                      <span className="text-base font-medium ml-3 group-hover:text-slate-800 transition-colors">{item.title}</span>
                    </Link>
                  ))}
                </nav>
              </div>
              
              <div className="mt-auto p-4 border-t border-white/10">
                <div className="flex items-center">
                  
                  {/*TODO:replace by user data*/}
                  <div className="ml-3">
                    <p className="text-sm font-medium">name</p>
                    <p className="text-xs text-white/70">name@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}