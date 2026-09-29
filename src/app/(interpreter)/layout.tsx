"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Briefcase,
  Calendar,
  Users,
  CircleDollarSign,
  Navigation,
  GraduationCap,
  FileText,
  Building,
  Network,
  User,
  Settings,
  Bell,
  Menu,
} from "lucide-react";
import { InterpreterJobsProvider } from "@/context/InterpreterJobsContext";

export default function InterpreterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9F8F4] font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-[#0B3B32] text-white shrink-0">
        <div className="flex flex-col p-5 pb-2">
          <div className="flex items-center gap-3 mb-1">
            <Image
              src="/terpdesk-mark.png"
              alt="terpDESK Logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg object-contain bg-white p-1"
              priority
            />
            <span className="text-white font-semibold text-[22px]">terpDESK</span>
          </div>
          <span className="text-[13px] text-[#8BA49E]">Your interpreting business. One place.</span>
          <span className="mt-5 text-[14px] font-medium text-white">Interpreter workspace</span>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-0.5 px-4 py-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#0B3B32] [&::-webkit-scrollbar-thumb]:bg-[#1B433C] [&::-webkit-scrollbar-thumb]:rounded-full">
          <Link href="/interpreter-home" className={`flex items-center gap-3 rounded-xl px-4 py-[9px] text-[14px] font-medium transition-colors ${pathname === '/interpreter-home' ? 'bg-white/10 text-white' : 'text-[#8BA49E] hover:bg-white/5 hover:text-white'}`}>
            <Home strokeWidth={1.5} className="h-[18px] w-[18px] shrink-0" />
            Home
          </Link>
          <Link href="/jobs" className={`flex items-center gap-3 rounded-xl px-4 py-[9px] text-[14px] font-medium transition-colors ${pathname.startsWith('/jobs') ? 'bg-white/10 text-white' : 'text-[#8BA49E] hover:bg-white/5 hover:text-white'}`}>
            <Briefcase strokeWidth={1.5} className="h-[18px] w-[18px] shrink-0" />
            Jobs
          </Link>
          <Link href="/interpreter-calendar" className={`flex items-center gap-3 rounded-xl px-4 py-[9px] text-[14px] font-medium transition-colors ${pathname.startsWith('/interpreter-calendar') ? 'bg-white/10 text-white' : 'text-[#8BA49E] hover:bg-white/5 hover:text-white'}`}>
            <Calendar strokeWidth={1.5} className="h-[18px] w-[18px] shrink-0" />
            Calendar
          </Link>
          <Link href="#" className="flex items-center justify-between rounded-xl px-4 py-[9px] text-[14px] font-medium text-[#8BA49E] hover:bg-white/5 hover:text-white transition-colors">
            <div className="flex items-center gap-3">
              <Users strokeWidth={1.5} className="h-[18px] w-[18px] shrink-0" />
              People
            </div>
            <span className="text-[10px] uppercase text-[#8BA49E]">Later</span>
          </Link>
          <Link href="#" className="flex items-center justify-between rounded-xl px-4 py-[9px] text-[14px] font-medium text-[#8BA49E] hover:bg-white/5 hover:text-white transition-colors">
            <div className="flex items-center gap-3">
              <CircleDollarSign strokeWidth={1.5} className="h-[18px] w-[18px] shrink-0" />
              Money
            </div>
            <span className="text-[10px] uppercase text-[#8BA49E]">Later</span>
          </Link>
          <Link href="/mileage" className={`flex items-center gap-3 rounded-xl px-4 py-[9px] text-[14px] font-medium transition-colors ${pathname.startsWith('/mileage') ? 'bg-white/10 text-white' : 'text-[#8BA49E] hover:bg-white/5 hover:text-white'}`}>
            <Navigation strokeWidth={1.5} className="h-[18px] w-[18px] shrink-0" />
            Mileage
          </Link>
          <Link href="#" className="flex items-center justify-between rounded-xl px-4 py-[9px] text-[14px] font-medium text-[#8BA49E] hover:bg-white/5 hover:text-white transition-colors">
            <div className="flex items-center gap-3">
              <GraduationCap strokeWidth={1.5} className="h-[18px] w-[18px] shrink-0" />
              CEUs
            </div>
            <span className="text-[10px] uppercase text-[#8BA49E]">Later</span>
          </Link>
          <Link href="/prep" className={`flex items-center gap-3 rounded-xl px-4 py-[9px] text-[14px] font-medium transition-colors ${pathname.startsWith('/prep') ? 'bg-white/10 text-white' : 'text-[#8BA49E] hover:bg-white/5 hover:text-white'}`}>
            <FileText strokeWidth={1.5} className="h-[18px] w-[18px] shrink-0" />
            Prep
          </Link>
          <Link href="/agencies" className={`flex items-center gap-3 rounded-xl px-4 py-[9px] text-[14px] font-medium transition-colors ${pathname.startsWith('/agencies') ? 'bg-white/10 text-white' : 'text-[#8BA49E] hover:bg-white/5 hover:text-white'}`}>
            <Building strokeWidth={1.5} className="h-[18px] w-[18px] shrink-0" />
            Agencies
          </Link>
          <Link href="#" className="flex items-center justify-between rounded-xl px-4 py-[9px] text-[14px] font-medium text-[#8BA49E] hover:bg-white/5 hover:text-white transition-colors">
            <div className="flex items-center gap-3">
              <Network strokeWidth={1.5} className="h-[18px] w-[18px] shrink-0" />
              Connections
            </div>
            <span className="text-[10px] uppercase text-[#8BA49E]">Later</span>
          </Link>
          <Link href="/profile" className={`flex items-center gap-3 rounded-xl px-4 py-[9px] text-[14px] font-medium transition-colors ${pathname.startsWith('/profile') ? 'bg-white/10 text-white' : 'text-[#8BA49E] hover:bg-white/5 hover:text-white'}`}>
            <User strokeWidth={1.5} className="h-[18px] w-[18px] shrink-0" />
            My Profile
          </Link>
          <Link href="/interpreter-settings" className={`flex items-center gap-3 rounded-xl px-4 py-[9px] text-[14px] font-medium transition-colors ${pathname.startsWith('/interpreter-settings') ? 'bg-white/10 text-white' : 'text-[#8BA49E] hover:bg-white/5 hover:text-white'}`}>
            <Settings strokeWidth={1.5} className="h-[18px] w-[18px] shrink-0" />
            Settings
          </Link>
        </nav>

        <div className="p-5 pt-2">
          <div className="mb-4 flex flex-col">
            <span className="text-[14px] font-medium text-white">Dale Fictional</span>
            <span className="text-xs text-[#8BA49E]">terp.declined@fictional.test</span>
          </div>
          <Link href="/" className="text-[13px] font-medium text-[#8BA49E] hover:text-white transition-colors">
            Sign out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col overflow-y-auto relative">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#F9F8F4]">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-5 flex items-center justify-between w-full">
            <div className="text-[14px] text-gray-500 font-medium">
              Dale Fictional · Interpreter
            </div>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-[13px] font-medium text-[#0B3B32] hover:underline underline-offset-4 hidden sm:block">
                Switch to Agency
              </Link>
              <div className="relative cursor-pointer hover:text-gray-900 text-gray-500 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#9B1C1C] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#F9F8F4]">
                  1
                </span>
              </div>
              <Link href="/" className="text-[14px] font-medium text-gray-700 hover:text-gray-900 transition-colors hidden md:block">
                Sign out
              </Link>
              <button className="md:hidden text-slate-500 hover:text-slate-900 transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content Container */}
        <div className="pb-24 md:pb-0">
          <InterpreterJobsProvider>
            {children}
          </InterpreterJobsProvider>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#F9F8F4] border-t border-neutral-200 flex justify-between items-center px-2 py-2 md:hidden z-50 pb-[env(safe-area-inset-bottom,0.5rem)]">
        <Link href="/interpreter-home" className={`flex flex-col items-center justify-center rounded-2xl px-5 py-2 ${pathname === '/interpreter-home' ? 'bg-[#E6EFEA] text-[#385B52]' : 'text-slate-500'}`}>
          <Home className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/jobs" className={`flex flex-col items-center justify-center rounded-2xl px-4 py-2 ${pathname.startsWith('/jobs') ? 'bg-[#E6EFEA] text-[#385B52]' : 'text-slate-500'}`}>
          <Briefcase className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-medium">Jobs</span>
        </Link>
        <Link href="/interpreter-calendar" className={`flex flex-col items-center justify-center rounded-2xl px-4 py-2 ${pathname.startsWith('/interpreter-calendar') ? 'bg-[#E6EFEA] text-[#385B52]' : 'text-slate-500'}`}>
          <Calendar className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-medium">Calendar</span>
        </Link>
        <Link href="/mileage" className={`flex flex-col items-center justify-center rounded-2xl px-4 py-2 ${pathname.startsWith('/mileage') ? 'bg-[#E6EFEA] text-[#385B52]' : 'text-slate-500'}`}>
          <Navigation className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-medium">Mileage</span>
        </Link>
        <Link href="/interpreter-settings" className={`flex flex-col items-center justify-center rounded-2xl px-4 py-2 ${pathname.startsWith('/interpreter-settings') ? 'bg-[#E6EFEA] text-[#385B52]' : 'text-slate-500'}`}>
          <Settings className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-medium">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
