"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Bell, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated, userData, loading } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if (loading) return;

  //   if (!isAuthenticated) {
  //     router.replace("/login");
  //     return;
  //   }

  // }, [isAuthenticated, userData, loading, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-slate-300 text-slate-100">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-slate-700/60 bg-dark px-4 sm:px-6 backdrop-blur-md shadow-md">
            <div className="flex items-center gap-3 min-w-0">
              <SidebarTrigger className="text-slate-200 hover:text-white hover:bg-slate-800/80 border border-slate-700/50" />
              <div className="h-4 w-px bg-slate-700/80 hidden sm:block" />
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white truncate">
                Management Console
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8 sm:h-9 sm:w-9 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-700/50 rounded-lg"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-orange animate-pulse" />
              </Button>

              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-700/60">
                <div className="w-8 h-8 rounded-lg bg-secondary-orange/10 border border-secondary-orange/30 flex items-center justify-center text-secondary-orange font-bold text-xs shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-none">
                    {userData?.name || "Admin User"}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {userData?.role || "Agency Manager"}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 p-4 sm:p-6 overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}