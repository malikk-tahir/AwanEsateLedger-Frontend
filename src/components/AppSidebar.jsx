"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "@/store/authSlice";
import axios from "axios";
import { toast } from "sonner";
import api from "@/lib/api-client";
import {useQueryClient} from "@tanstack/react-query";

import {
  Building2,
  ChevronDown,
  FileText,
  HardHat,
  Home,
  FolderKanban,
  Users,
  LogOut,
  User,
  Wallet,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logged out locally");
    } finally {
      dispatch(logoutAction());
      router.push("/login");
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-white">
        <Link href="/dashboard" className="flex items-center justify-center">
          <Image
            src="/awanestatelogo.png"
            alt="Awan Estate Logo"
            width={100}
            height={32}
            priority
            className="h-20 sm:h-40 w-auto object-contain"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="mt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                  <Link href="/dashboard">
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/dashboard/personaltransactions")}
                >
                  <Link href="/dashboard/personaltransactions">
                    <Wallet className="w-4 h-4" />
                    <span>Personal Transactions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <HardHat className="w-4 h-4" />
                      <span>Construction Projects</span>
                      <ChevronDown className="ml-auto w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === "/dashboard/construction/projects"}
                        >
                          <Link href="/dashboard/construction/projects">
                            <FolderKanban className="w-4 h-4" />
                            <span>Projects</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === "/dashboard/construction/workers"}
                        >
                          <Link href="/dashboard/construction/workers">
                            <Users className="w-4 h-4" />
                            <span>Workers</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/dashboard/properties")}
                >
                  <Link href="/dashboard/properties">
                    <Building2 className="w-4 h-4" />
                    <span>Properties</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/dashboard/society")}
                >
                  <Link href="/dashboard/society">
                    <FileText className="w-4 h-4" />
                    <span>Society Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-slate-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-secondary-orange/10 border border-secondary-orange/30 flex items-center justify-center text-secondary-orange font-bold text-xs shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-white truncate">
                    {userData?.name || "Admin User"}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {userData?.email || "admin@awanestate.com"}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;