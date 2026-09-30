"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";

type ViewType = 'month' | 'week' | 'day';

export default function InterpreterCalendarPage() {
 const [view, setView] = useState<ViewType>('month');

 return (
 <div className="max-w-[1200px] mx-auto p-4 md:p-8 w-full pb-24 antialiased">
 
 {/* Banner */}
 {/* Header */}
 <div>
 <h1 className="text-3xl font-semibold tracking-tight text-[var(--ink)] mb-2">
 My calendar
 </h1>
 <p className="text-[var(--sage)] text-[15px] max-w-2xl mb-6">
 Reserved assignments across your agencies, plus private busy time. Pending offers do not book your calendar.
 </p>
 </div>

 {/* Controls */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 
 <div className="flex items-center gap-2">
 <button className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
 <ChevronLeft className="w-4 h-4" />
 </button>
 <button className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 text-[13px] font-medium hover:bg-gray-50 transition-colors">
 Today
 </button>
 <button className="px-4 py-2 rounded-full bg-[#1B433C] text-white text-[13px] font-medium hover:bg-[#14332D] transition-colors ">
 Block time
 </button>
 <button className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>

 <div className="flex items-center gap-2 bg-[#F3F4F6] px-4 py-2 rounded-full text-gray-600">
 <span className="text-[13px] font-medium">09/29/2026</span>
 <CalendarIcon className="w-4 h-4" />
 </div>
 
 </div>

 {/* View Toggle */}
 <div className="bg-[#F3F4F6] p-1 rounded-full flex w-full mt-6">
 <button 
 onClick={() => setView('month')}
 className={`flex-1 text-[13px] font-medium py-2 rounded-full transition-all ${view === 'month' ? 'bg-white text-[var(--ink)] ' : 'text-[var(--sage)] hover:text-gray-700'}`}
 >
 Month
 </button>
 <button 
 onClick={() => setView('week')}
 className={`flex-1 text-[13px] font-medium py-2 rounded-full transition-all ${view === 'week' ? 'bg-white text-[var(--ink)] ' : 'text-[var(--sage)] hover:text-gray-700'}`}
 >
 Week
 </button>
 <button 
 onClick={() => setView('day')}
 className={`flex-1 text-[13px] font-medium py-2 rounded-full transition-all ${view === 'day' ? 'bg-white text-[var(--ink)] ' : 'text-[var(--sage)] hover:text-gray-700'}`}
 >
 Day
 </button>
 </div>

 <p className="text-[13px] text-[var(--sage)] mt-4 mb-4">
 {view === 'day' ? 'Tuesday, September 29, 2026' : view === 'week' ? 'Sep 27 – Oct 3, 2026' : 'September 2026'} · Calendar time zone: Asia/Singapore (times shown adjust for daylight saving)
 </p>

 {/* Conditional Views */}
 
 {/* MONTH VIEW */}
 {view === 'month' && (
 <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden border border-gray-200">
 
 {/* Header */}
 <div className="grid grid-cols-7 border-b border-gray-200">
 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
 <div key={day} className="text-center py-4 text-[12px] font-semibold text-[var(--ink)]">
 {day}
 </div>
 ))}
 </div>

 {/* Grid Body */}
 <div className="flex flex-col">
 {/* Row 1 */}
 <div className="grid grid-cols-7 h-32 border-b border-gray-200 last:border-0">
 <div className="p-2 border-r border-gray-200 bg-[#F5F4F0]"></div>
 <div className="p-2 border-r border-gray-200 bg-[#F5F4F0]"></div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">1</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">2</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">3</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">4</div>
 <div className="p-2 text-[12px] font-medium text-[var(--ink)]">5</div>
 </div>
 {/* Row 2 */}
 <div className="grid grid-cols-7 h-32 border-b border-gray-200 last:border-0">
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">6</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">7</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">8</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">9</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">10</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">11</div>
 <div className="p-2 text-[12px] font-medium text-[var(--ink)]">12</div>
 </div>
 {/* Row 3 */}
 <div className="grid grid-cols-7 h-32 border-b border-gray-200 last:border-0">
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">13</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">14</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">15</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">16</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">17</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">18</div>
 <div className="p-2 text-[12px] font-medium text-[var(--ink)]">19</div>
 </div>
 {/* Row 4 */}
 <div className="grid grid-cols-7 h-32 border-b border-gray-200 last:border-0">
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">20</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">21</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">22</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">23</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">24</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">25</div>
 <div className="p-2 text-[12px] font-medium text-[var(--ink)]">26</div>
 </div>
 {/* Row 5 */}
 <div className="grid grid-cols-7 h-32 border-b border-gray-200 last:border-0">
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">27</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">28</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">29</div>
 <div className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)]">30</div>
 <div className="p-2 border-r border-gray-200 bg-[#F5F4F0]"></div>
 <div className="p-2 border-r border-gray-200 bg-[#F5F4F0]"></div>
 <div className="p-2 bg-[#F5F4F0]"></div>
 </div>
 </div>
 </div>
 )}

 {/* WEEK VIEW */}
 {view === 'week' && (
 <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden border border-gray-200 p-4">
 <div className="flex">
 
 {/* Time Sidebar */}
 <div className="w-16 shrink-0 pt-[52px]">
 {Array.from({ length: 11 }).map((_, i) => (
 <div key={i} className="h-14 relative">
 <span className="absolute -top-2 right-2 text-[10px] text-gray-400 font-medium">
 {i === 0 ? '12 AM' : `${i} AM`}
 </span>
 </div>
 ))}
 </div>

 {/* Days Grid */}
 <div className="flex-1 grid grid-cols-7 border-l border-gray-200">
 
 {/* Day Headers */}
 {['Sun, 9/27', 'Mon, 9/28', 'Tue, 9/29', 'Wed, 9/30', 'Thu, 10/1', 'Fri, 10/2', 'Sat, 10/3'].map((day, idx) => (
 <div key={day} className="text-center pb-4 pt-2 border-b border-gray-200 border-r last:border-r-0">
 <div className={`text-[12px] font-semibold ${idx === 2 ? 'text-blue-600' : 'text-[var(--ink)]'}`}>
 {day}
 </div>
 </div>
 ))}

 {/* Grid Lines */}
 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, colIdx) => (
 <div key={day} className="border-r border-gray-200 last:border-r-0 relative">
 {Array.from({ length: 11 }).map((_, i) => (
 <div key={i} className="h-14 border-b border-gray-50 last:border-0" />
 ))}
 </div>
 ))}
 
 </div>
 </div>
 </div>
 )}

 {/* DAY VIEW */}
 {view === 'day' && (
 <div className="bg-white rounded-2xl border border-gray-200 p-6 border border-gray-200 min-h-[250px]">
 <h2 className="text-[18px] font-semibold text-[var(--ink)] mb-4">
 Tuesday, September 29
 </h2>
 <p className="text-[14px] text-[var(--sage)] mb-6">
 Nothing scheduled for this day.
 </p>
 <button className="px-5 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-[13px] font-medium hover:bg-gray-50 transition-colors ">
 Block time on this day
 </button>
 </div>
 )}

 {/* Manage availability Section */}
 <div className="mt-12">
 <h2 className="text-3xl font-semibold text-[var(--ink)] mb-2">Manage availability</h2>
 <p className="text-[var(--sage)] mb-4 max-w-3xl">
 Your usual working hours, plus any dates that differ. This is a preference, not a promise: nothing here cancels a booking, and an agency can still offer you work outside these hours.
 </p>
 <p className="text-[var(--sage)] text-sm mb-6 max-w-4xl">
 Times are shown in your profile time zone, Pacific Time — Seattle, Los Angeles. Daylight saving is applied to each date. Days you leave empty are shown to agencies as 'availability not provided', not as free time.
 </p>

 {/* Card 1: Usual weekly hours */}
 <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 border border-gray-200">
 <h3 className="font-semibold text-[var(--ink)] mb-4">Usual weekly hours</h3>
 <div className="flex flex-col">
 {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
 <div key={day} className="flex items-center border-b border-gray-200 py-3 last:border-b-0 last:pb-0">
 <div className="w-32 font-medium text-[var(--ink)]">{day}</div>
 <div className="flex-1 text-gray-400">Not provided</div>
 <button className="px-4 py-1.5 rounded-full border border-gray-200 text-gray-700 text-[13px] font-medium hover:bg-gray-50 transition-colors shrink-0">
 Add hours
 </button>
 </div>
 ))}
 </div>
 </div>

 {/* Card 2: Dates that are different */}
 <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 border border-gray-200">
 <h3 className="font-semibold text-[var(--ink)] mb-2">Dates that are different</h3>
 <p className="text-[var(--sage)] mb-4 text-[15px]">
 A date entered here replaces your usual hours for that day.
 </p>
 <button className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 text-[13px] font-medium hover:bg-gray-50 transition-colors">
 Add a date
 </button>
 </div>

 {/* Action Buttons */}
 <div className="flex items-center gap-3">
 <button className="bg-[#1B433C] text-white rounded-full px-6 py-2 text-[14px] font-medium hover:bg-[#14332D] transition-colors ">
 Save availability
 </button>
 <button className="bg-white border border-gray-200 text-gray-700 rounded-full px-6 py-2 text-[14px] font-medium hover:bg-gray-50 transition-colors ">
 Undo changes
 </button>
 </div>
 </div>

 {/* Private busy time Section */}
 <div className="mt-12">
 <h2 className="text-3xl font-semibold text-[var(--ink)] mb-2">Private busy time</h2>
 <p className="text-[var(--sage)] mb-6 max-w-2xl">
 Only you can see these blocks. Agencies receive no personal details. A block cannot cancel a reserved appointment.
 </p>

 {/* Card 3: Block time */}
 <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-12 border border-gray-200">
 <h3 className="font-semibold text-[var(--ink)] mb-6">Block time</h3>
 
 <div className="space-y-4">
 <div>
 <label className="block text-[13px] text-[var(--sage)] mb-1">Private label (optional)</label>
 <input 
 type="text" 
 defaultValue="Busy" 
 className="bg-[#F5F4F0] border-none rounded-xl p-3 w-full text-[14px] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[#1B433C]/20"
 />
 </div>
 
 <div>
 <label className="block text-[13px] text-[var(--sage)] mb-1">Time zone</label>
 <input 
 type="text" 
 defaultValue="Pacific Time — Seattle, Los Angeles" 
 readOnly
 className="bg-[#F5F4F0] border-none rounded-xl p-3 w-full text-[14px] text-[var(--ink)] focus:outline-none"
 />
 </div>

 <div className="flex items-center gap-2 my-4">
 <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1B433C] focus:ring-[#1B433C]" />
 <span className="text-[14px] text-[var(--ink)]">All day</span>
 </div>

 <div>
 <label className="block text-[13px] text-[var(--sage)] mb-1">Busy start</label>
 <div className="flex flex-col sm:flex-row sm:items-center gap-4">
 <div className="relative flex-1">
 <input type="text" defaultValue="09/29/2026" className="bg-[#F5F4F0] border-none rounded-xl p-3 w-full text-[14px] pr-10 focus:outline-none" />
 <CalendarIcon className="w-4 h-4 text-[var(--ink)] absolute right-4 top-3.5" />
 </div>
 <div className="relative flex-1">
 <input type="text" defaultValue="09:00 AM" className="bg-[#F5F4F0] border-none rounded-xl p-3 w-full text-[14px] pr-10 focus:outline-none" />
 <Clock className="w-4 h-4 text-[var(--ink)] absolute right-4 top-3.5" />
 </div>
 </div>
 <p className="text-[12px] text-[var(--sage)] mt-2">
 9:00 AM PDT · Pacific Time — Seattle, Los Angeles (UTC-07:00)
 </p>
 </div>

 <div className="pt-2">
 <label className="block text-[13px] text-[var(--sage)] mb-1">Busy end</label>
 <div className="flex flex-col sm:flex-row sm:items-center gap-4">
 <div className="relative flex-1">
 <input type="text" defaultValue="09/29/2026" className="bg-[#F5F4F0] border-none rounded-xl p-3 w-full text-[14px] pr-10 focus:outline-none" />
 <CalendarIcon className="w-4 h-4 text-[var(--ink)] absolute right-4 top-3.5" />
 </div>
 <div className="relative flex-1">
 <input type="text" defaultValue="10:00 AM" className="bg-[#F5F4F0] border-none rounded-xl p-3 w-full text-[14px] pr-10 focus:outline-none" />
 <Clock className="w-4 h-4 text-[var(--ink)] absolute right-4 top-3.5" />
 </div>
 </div>
 <p className="text-[12px] text-[var(--sage)] mt-2">
 10:00 AM PDT · Pacific Time — Seattle, Los Angeles (UTC-07:00)
 </p>
 </div>

 <p className="text-[12px] text-[var(--sage)] mt-6 mb-4">
 Agencies you share availability with only see that you are unavailable — never the label. A block never cancels or changes a booked assignment.
 </p>

 <div className="flex items-center gap-3">
 <button className="bg-[#1B433C] text-white rounded-full px-6 py-2 text-[14px] font-medium hover:bg-[#14332D] transition-colors ">
 Save private busy time
 </button>
 <button className="bg-white border border-gray-200 text-gray-700 rounded-full px-6 py-2 text-[14px] font-medium hover:bg-gray-50 transition-colors ">
 Cancel
 </button>
 </div>
 </div>
 </div>
 </div>

 </div>
 );
}
