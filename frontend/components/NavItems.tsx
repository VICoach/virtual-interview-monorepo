import { Calendar, History, User, LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";


export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon; 
  isActive?: boolean;
};

export function useNavItems() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
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
  ];

  return navItems;
}