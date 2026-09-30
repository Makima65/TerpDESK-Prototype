"use client";

import React, { useState } from "react";
import { useRequests } from "@/context/RequestsContext";
import Link from "next/link";

export default function CalendarPage() {
 const { requests } = useRequests();
 const [view, setView] = useState<'month' | 'week' | 'day'>('month');
 const [currentDate, setCurrentDate] = useState(new Date());

 const year = currentDate.getFullYear();
 const month = currentDate.getMonth();

 const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
 const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

 const daysInMonth = getDaysInMonth(year, month);
 const firstDayIndex = getFirstDayOfMonth(year, month);

 const cells = [];
 for (let i = 0; i < firstDayIndex; i++) cells.push(null);
 for (let i = 1; i <= daysInMonth; i++) cells.push(new Date(year, month, i));

 // Add trailing empty cells to complete the grid (if 35 or 42)
 const totalCells = cells.length > 35 ? 42 : 35;
 while (cells.length < totalCells) cells.push(null);

 const getWeekDays = (date: Date) => {
 const current = new Date(date);
 current.setDate(current.getDate() - current.getDay());
 const week = [];
 for (let i = 0; i < 7; i++) {
 week.push(new Date(current));
 current.setDate(current.getDate() + 1);
 }
 return week;
 };

 const weekDays = getWeekDays(currentDate);

 const changeMonth = (offset: number) => {
 setCurrentDate(new Date(year, month + offset, 1));
 };

 const isSameDay = (d1: Date | null, timestamp: number) => {
 if (!d1) return false;
 const d2 = new Date(timestamp);
 return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
 };

 const leftArrow = (
 <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
 </svg>
 );

 const rightArrow = (
 <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
 </svg>
 );

 const calIcon = (
 <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
 </svg>
 );

 return (
 <div className="max-w-[1200px] mx-auto p-6 space-y-6 pb-24 antialiased">
 {/* Header */}
 <div className="space-y-2">
 <h1 className="text-[28px] font-semibold tracking-tight text-[var(--ink)]">Agency calendar</h1>
 <p className="text-[15px] text-[var(--sage)]">
 One appointment per job, with coverage across its independent slots.
 </p>
 </div>

 {/* Controls Row */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-8 gap-4">
 <div className="flex items-center gap-2">
 <button onClick={() => changeMonth(-1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
 {leftArrow}
 </button>
 <button onClick={() => setCurrentDate(new Date())} className="px-5 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
 Today
 </button>
 <button onClick={() => changeMonth(1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
 {rightArrow}
 </button>
 </div>
 <div className="flex items-center bg-[#F4F3EF] rounded-full px-4 py-2 text-sm text-gray-700 font-medium w-fit">
 {calIcon}
 {currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
 </div>
 </div>

 {/* View Toggle */}
 <div className="bg-[#F4F3EF] rounded-full p-1 flex mt-4 max-w-md">
 {(['month', 'week', 'day'] as const).map((v) => (
 <button 
 key={v}
 onClick={() => setView(v)}
 className={`flex-1 text-center py-2 text-sm rounded-full transition-all ${view === v ? 'bg-white text-[var(--ink)] font-medium' : 'text-[var(--sage)] hover:text-gray-700'}`}
 >
 {v.charAt(0).toUpperCase() + v.slice(1)}
 </button>
 ))}
 </div>

 {/* Views */}
 {view === 'month' && (
 <div className="bg-white rounded-2xl border border-gray-200 border border-gray-200 p-4 sm:p-6 mt-6 overflow-hidden">
 <div className="overflow-x-auto pb-2">
 <div className="min-w-[700px]">
 <div className="grid grid-cols-7 mb-2">
 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
 <div key={day} className="text-center text-xs font-semibold text-[var(--sage)] uppercase tracking-wider py-2">
 {day}
 </div>
 ))}
 </div>
 <div className="grid grid-cols-7 border-t border-l border-gray-200">
 {cells.map((date, idx) => {
 const dayRequests = date ? requests.filter(r => isSameDay(date, r.timestamp)) : [];
 return (
 <div key={idx} className="min-h-[120px] border-r border-b border-gray-200 p-2 flex flex-col">
 {date && (
 <div className="text-sm font-medium text-[var(--sage)] mb-2 px-1">
 {date.getDate()}
 </div>
 )}
 <div className="flex-1 overflow-y-auto space-y-1">
 {dayRequests.map(req => (
 <Link href={`/requests/${req.id}`} key={req.id} className="block bg-[#E5F0EB] text-[#0A3D31] rounded-md p-1.5 text-xs transition-colors hover:bg-[#D5E6DF]">
 <div className="font-semibold truncate">{req.title || "Request"}</div>
 <div className="text-[10px] opacity-80 truncate">{req.status}</div>
 </Link>
 ))}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>
 </div>
 )}

 {view === 'week' && (
 <div className="bg-white rounded-2xl border border-gray-200 border border-gray-200 p-6 mt-6 overflow-hidden flex">
 {/* Hours Column */}
 <div className="w-16 flex flex-col border-r border-gray-200 shrink-0 mt-8">
 {Array.from({ length: 24 }).map((_, i) => (
 <div key={i} className="h-16 flex items-start justify-end pr-3 border-b border-gray-50 text-[11px] text-gray-400 font-medium pt-1">
 {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
 </div>
 ))}
 </div>
 {/* Days Grid */}
 <div className="flex-1 overflow-x-auto">
 <div className="flex min-w-[700px] h-full relative">
 {/* Background Hour lines */}
 <div className="absolute inset-0 top-8 -z-10 flex flex-col pointer-events-none">
 {Array.from({ length: 24 }).map((_, i) => (
 <div key={i} className="h-16 border-b border-gray-50 w-full shrink-0"></div>
 ))}
 </div>
 {weekDays.map((dayDate, dayIdx) => {
 const dayRequests = requests.filter(r => isSameDay(dayDate, r.timestamp));
 return (
 <div key={dayIdx} className="flex-1 border-r border-gray-200 flex flex-col">
 <div className="h-8 border-b border-gray-200 text-center text-xs font-semibold text-[var(--sage)] uppercase tracking-wider py-1.5 bg-white">
 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayDate.getDay()]} {dayDate.getDate()}
 </div>
 <div className="flex-1 p-2 flex flex-col gap-1 mt-2 h-[1536px]">
 {dayRequests.map(req => (
 <Link href={`/requests/${req.id}`} key={req.id} className="block bg-[#E5F0EB] text-[#0A3D31] rounded-md p-1.5 text-xs transition-colors hover:bg-[#D5E6DF] z-10">
 <div className="font-semibold truncate">{req.title || "Request"}</div>
 <div className="text-[10px] opacity-80 truncate">{req.status}</div>
 </Link>
 ))}
 </div>
 </div>
 )
 })}
 </div>
 </div>
 </div>
 )}

 {view === 'day' && (() => {
 const dayRequests = requests.filter(r => isSameDay(currentDate, r.timestamp));
 return (
 <div className="bg-white rounded-2xl border border-gray-200 border border-gray-200 p-8 mt-6 min-h-[400px]">
 <h2 className="text-xl font-semibold text-[var(--ink)] mb-6">
 {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
 </h2>
 
 {dayRequests.length === 0 ? (
 <div className="flex items-center justify-center h-48">
 <p className="text-[var(--sage)]">Nothing scheduled for this day.</p>
 </div>
 ) : (
 <div className="space-y-4">
 {dayRequests.map(req => (
 <Link href={`/requests/${req.id}`} key={req.id} className="block bg-gray-50 rounded-xl p-4 border border-gray-200 hover:bg-gray-100 transition-colors">
 <div className="flex justify-between items-start">
 <div>
 <h3 className="font-semibold text-[var(--ink)]">{req.title || "Request"}</h3>
 <p className="text-sm text-[var(--sage)] mt-1">{req.dateString || "Time not specified"}</p>
 </div>
 <span className="bg-[#E5F0EB] text-[#0A3D31] rounded-full px-3 py-1 text-xs font-medium">
 {req.status}
 </span>
 </div>
 </Link>
 ))}
 </div>
 )}
 </div>
 );
 })()}
 </div>
 );
}
