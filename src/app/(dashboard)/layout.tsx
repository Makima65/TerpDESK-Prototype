"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Calendar,
  Users,
  Building,
  Globe,
  CreditCard,
  Settings,
  Bell,
  Menu,
} from "lucide-react";
import { RequestsProvider } from "@/context/RequestsContext";
import { ClientsProvider } from "@/context/ClientsContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ClientsProvider>
      <RequestsProvider>
        <div className="flex h-screen overflow-hidden bg-[#F9F8F4] font-sans text-slate-900">
          {/* Sidebar */}
          <aside className="hidden md:flex w-64 flex-col bg-[#0B3B32] text-white shrink-0">
            <div className="flex flex-col p-6">
              <div className="flex items-center gap-3 mb-1">
                <Image
                  src="/terpdesk-mark.png"
                  alt="terpDESK Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-lg object-contain"
                  priority
                />
                <span className="text-white font-semibold text-[22px]">terpDESK</span>
              </div>
              <span className="text-[13px] text-[#8BA49E]">North Fictional Interpreting</span>
              <span className="mt-6 text-[15px] font-medium text-white">Agency workspace</span>
            </div>

            <nav className="flex-1 space-y-1.5 px-4 py-2">
              <Link href="/dashboard" className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'bg-white/10 text-white' : 'text-[#8BA49E] hover:bg-white/5 hover:text-white'}`}>
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/requests" className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${pathname.startsWith('/requests') ? 'bg-white/10 text-white' : 'text-[#8BA49E] hover:bg-white/5 hover:text-white'}`}>
                <LayoutGrid className="h-4 w-4" />
                Requests & assignments
              </Link>
              <Link href="/calendar" className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${pathname.startsWith('/calendar') ? 'bg-white/10 text-white' : 'text-[#8BA49E] hover:bg-white/5 hover:text-white'}`}>
                <Calendar className="h-4 w-4" />
                Calendar
              </Link>
              <Link href="/interpreters" className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${pathname.startsWith('/interpreters') ? 'bg-white/10 text-white' : 'text-[#8BA49E] hover:bg-white/5 hover:text-white'}`}>
                <Users className="h-4 w-4" />
                Interpreters
              </Link>
              <Link href="/clients" className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${pathname.startsWith('/clients') ? 'bg-white/10 text-white' : 'text-[#8BA49E] hover:bg-white/5 hover:text-white'}`}>
                <Building className="h-4 w-4" />
                Clients
              </Link>
              <Link href="/website-requests" className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${pathname.startsWith('/website-requests') ? 'bg-white/10 text-white' : 'text-[#8BA49E] hover:bg-white/5 hover:text-white'}`}>
                <Globe className="h-4 w-4" />
                Website requests
              </Link>
              <Link href="/billing" className={`flex items-center justify-between rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${pathname.startsWith('/billing') ? 'bg-white/10 text-white' : 'text-[#8BA49E] hover:bg-white/5 hover:text-white'}`}>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4" />
                  Billing
                </div>
                <span className="text-[10px] text-[#8BA49E]">Later</span>
              </Link>
              <Link href="/settings" className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${pathname.startsWith('/settings') ? 'bg-white/10 text-white' : 'text-[#8BA49E] hover:bg-white/5 hover:text-white'}`}>
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>

            <div className="p-6">
              <div className="mb-4 flex flex-col">
                <span className="text-sm font-medium text-white">Avery North</span>
                <span className="text-xs text-[#8BA49E]">north.staff@fictional.test</span>
              </div>
              <Link href="#" className="text-sm font-medium text-white hover:underline underline-offset-4 decoration-white/30">
                Sign out
              </Link>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex flex-1 flex-col overflow-y-auto">
            {/* Header */}
            <header className="flex items-center justify-between px-4 md:px-8 py-5 sticky top-0 z-40 bg-[#F9F8F4]">
              <div className="text-sm text-slate-500">
                Avery North · Agency
              </div>
              <div className="flex items-center gap-4 md:gap-6">
                <button className="relative text-slate-500 hover:text-slate-700">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#9E3929] text-[10px] font-bold text-white">
                    2
                  </span>
                </button>
                <Link href="#" className="text-sm text-slate-500 hover:text-slate-700">
                  Sign out
                </Link>
                <button className="md:hidden text-slate-500 hover:text-slate-700 ml-1">
                  <Menu className="h-5 w-5" />
                </button>
              </div>
            </header>

            {/* Scrollable Page Content Container */}
            <div className="px-4 md:px-8 pb-24 md:pb-12">
              {children}
            </div>
          </main>

          {/* Mobile Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 w-full bg-[#F9F8F4] border-t border-neutral-200 flex justify-between items-center px-2 py-2 md:hidden z-50 pb-[env(safe-area-inset-bottom,0.5rem)]">
            <Link href="/dashboard" className={`flex flex-col items-center justify-center rounded-2xl px-5 py-2 ${pathname === '/dashboard' ? 'bg-[#E6EFEA] text-[#385B52]' : 'text-slate-500'}`}>
              <Home className="h-5 w-5 mb-1" />
              <span className="text-[10px] font-medium">Home</span>
            </Link>
            <Link href="/requests" className={`flex flex-col items-center justify-center rounded-2xl px-4 py-2 ${pathname.startsWith('/requests') ? 'bg-[#E6EFEA] text-[#385B52]' : 'text-slate-500'}`}>
              <LayoutGrid className="h-5 w-5 mb-1" />
              <span className="text-[10px] font-medium">Requests</span>
            </Link>
            <Link href="/calendar" className={`flex flex-col items-center justify-center rounded-2xl px-4 py-2 ${pathname.startsWith('/calendar') ? 'bg-[#E6EFEA] text-[#385B52]' : 'text-slate-500'}`}>
              <Calendar className="h-5 w-5 mb-1" />
              <span className="text-[10px] font-medium">Calendar</span>
            </Link>
            <Link href="/interpreters" className={`flex flex-col items-center justify-center rounded-2xl px-4 py-2 ${pathname.startsWith('/interpreters') ? 'bg-[#E6EFEA] text-[#385B52]' : 'text-slate-500'}`}>
              <Users className="h-5 w-5 mb-1" />
              <span className="text-[10px] font-medium">Terps</span>
            </Link>
            <Link href="/billing" className={`flex flex-col items-center justify-center rounded-2xl px-4 py-2 ${pathname.startsWith('/billing') ? 'bg-[#E6EFEA] text-[#385B52]' : 'text-slate-500'}`}>
              <CreditCard className="h-5 w-5 mb-1" />
              <span className="text-[10px] font-medium">Billing</span>
            </Link>
          </nav>
        </div>
      </RequestsProvider>
    </ClientsProvider>
  );
}
