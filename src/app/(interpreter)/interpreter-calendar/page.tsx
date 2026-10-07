"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, X, AlertTriangle } from "lucide-react";

type ViewType = 'month' | 'week' | 'day';

interface Rule { weekday: number; startMinute: number; endMinute: number; }
interface Exception { date: string; available: boolean; startMinute?: number; endMinute?: number; }
interface Appointment { id: string; start: Date; end: Date; title: string; agencyName: string; }
interface BusyBlock { id: string; label: string; timeZone: string; isAllDay: boolean; start: string; end: string; }

const timeStringToMinutes = (time: string): number => {
  if (!time) return 0;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const minutesToTimeString = (minutes: number): string => {
  if (minutes == null) return '';
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

export default function InterpreterCalendarPage() {
  const router = useRouter();
  const [view, setView] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formatBadge = (d: Date) => d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  const formatMonthYear = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const formatDayViewSubtitle = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') newDate.setMonth(newDate.getMonth() - 1);
    if (view === 'week') newDate.setDate(newDate.getDate() - 7);
    if (view === 'day') newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') newDate.setMonth(newDate.getMonth() + 1);
    if (view === 'week') newDate.setDate(newDate.getDate() + 7);
    if (view === 'day') newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const [rules, setRules] = useState<Rule[]>([]);
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  const [baseTimezone, setBaseTimezone] = useState('America/Los_Angeles');
  const [isLoaded, setIsLoaded] = useState(false);
  const [busyBlocks, setBusyBlocks] = useState<BusyBlock[]>([]);

  const [acceptedAppointments, setAcceptedAppointments] = useState<Appointment[]>([]);
  const [conflicts, setConflicts] = useState<Appointment[]>([]);

  // Private Busy Time Handlers
  const [busyLabel, setBusyLabel] = useState('Busy');
  const [busyTimeZone, setBusyTimeZone] = useState('Pacific Time — Seattle, Los Angeles');
  const [busyAllDay, setBusyAllDay] = useState(false);
  const [busyStartDate, setBusyStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [busyStartTime, setBusyStartTime] = useState('09:00');
  const [busyEndDate, setBusyEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [busyEndTime, setBusyEndTime] = useState('10:00');

  const handleSlotClick = (day: Date, hour: number) => {
    const dStr = new Date(day.getTime() - day.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    setBusyStartDate(dStr);
    setBusyEndDate(dStr);
    setBusyStartTime(`${hour.toString().padStart(2, '0')}:00`);
    setBusyEndTime(`${(hour + 1).toString().padStart(2, '0')}:00`);
    document.getElementById('private-busy-time')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const avail = localStorage.getItem('terpdesk_availability');
    if (avail) {
      try {
        const parsed = JSON.parse(avail);
        if (parsed.rules) setRules(parsed.rules);
        if (parsed.exceptions) setExceptions(parsed.exceptions);
        if (parsed.baseTimezone) setBaseTimezone(parsed.baseTimezone);
      } catch (e) { }
    }
    const busy = localStorage.getItem('terpdesk_busy_blocks');
    if (busy) {
      try {
        setBusyBlocks(JSON.parse(busy));
      } catch (e) { }
    }

    const loadJobs = () => {
      const storedJobs = localStorage.getItem('terpdesk_interpreter_jobs');
      if (storedJobs) {
        try {
          const parsedJobs = JSON.parse(storedJobs);
          const bookedJobs = parsedJobs
            .filter((j: any) => j.status === 'booked' && !j.id.includes('fictional') && !(j.title || '').includes('Fictional'))
            .map((j: any) => ({
              id: j.id,
              start: new Date(j.startsAt || new Date().toISOString()),
              end: new Date(j.endsAt || new Date(Date.now() + 3600000).toISOString()),
              title: j.title || 'Interpreting request',
              agencyName: j.agencyName || 'QA Fixture Agency'
            }));
          setAcceptedAppointments(bookedJobs);
        } catch (e) { }
      }
    };

    loadJobs();
    window.addEventListener('storage', loadJobs);
    setIsLoaded(true);
    return () => window.removeEventListener('storage', loadJobs);
  }, []);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Rule Handlers
  const addRule = (weekday: number) => {
    setRules(prev => {
      if (prev.some(r => r.weekday === weekday)) return prev;
      return [...prev, { weekday, startMinute: 540, endMinute: 1020 }].sort((a, b) => a.weekday - b.weekday);
    });
  };

  const updateRule = (weekday: number, field: 'startMinute' | 'endMinute', value: number) => {
    setRules(prev => prev.map(r => r.weekday === weekday ? { ...r, [field]: value } : r));
  };

  const removeRule = (weekday: number) => {
    setRules(prev => prev.filter(r => r.weekday !== weekday));
  };

  // Exception Handlers
  const addException = () => {
    const today = new Date().toISOString().split('T')[0];
    setExceptions(prev => [...prev, { date: today, available: false }]);
  };

  const updateException = (idx: number, updates: Partial<Exception>) => {
    setExceptions(prev => prev.map((ex, i) => i === idx ? { ...ex, ...updates } : ex));
  };

  const removeException = (idx: number) => {
    setExceptions(prev => prev.filter((_, i) => i !== idx));
  };

  // Save / Undo / Conflict Engine
  useEffect(() => {
    if (!isLoaded) return;
    
    const weeklySchedule: any = {};
    for (const rule of rules) {
      weeklySchedule[rule.weekday] = {
        available: true,
        startMinute: rule.startMinute,
        endMinute: rule.endMinute
      };
    }
    const dateOverrides = exceptions.map(ex => ({
      date: ex.date,
      available: ex.available,
      startMinute: ex.startMinute,
      endMinute: ex.endMinute
    }));
    
    const payload = {
      baseTimezone,
      weeklySchedule,
      dateOverrides,
      rules,
      exceptions
    };
    
    localStorage.setItem('terpdesk_availability', JSON.stringify(payload));

    const newConflicts: Appointment[] = [];
    for (const appt of acceptedAppointments) {
      const apptDateObj = appt.start;
      const dateStr = apptDateObj.getFullYear() + '-' + String(apptDateObj.getMonth() + 1).padStart(2, '0') + '-' + String(apptDateObj.getDate()).padStart(2, '0');
      const weekday = apptDateObj.getDay();

      const startM = apptDateObj.getHours() * 60 + apptDateObj.getMinutes();
      const endM = appt.end.getHours() * 60 + appt.end.getMinutes();

      const ex = exceptions.find(e => e.date === dateStr);
      if (ex) {
        if (!ex.available || (ex.startMinute != null && startM < ex.startMinute) || (ex.endMinute != null && endM > ex.endMinute)) {
          newConflicts.push(appt);
        }
        continue;
      }

      const r = rules.find(x => x.weekday === weekday);
      if (!r) {
        newConflicts.push(appt);
      } else {
        if (startM < r.startMinute || endM > r.endMinute) {
          newConflicts.push(appt);
        }
      }
    }
    setConflicts(newConflicts);
  }, [rules, exceptions, baseTimezone, isLoaded, acceptedAppointments]);

  // (Busy Time State Moved up)

  const saveBusyTime = () => {
    const newBlock: BusyBlock = {
      id: Math.random().toString(36).substring(2, 9),
      label: busyLabel,
      timeZone: busyTimeZone,
      isAllDay: busyAllDay,
      start: `${busyStartDate}T${busyStartTime}`,
      end: `${busyEndDate}T${busyEndTime}`
    };

    const updatedBlocks = [...busyBlocks, newBlock];
    setBusyBlocks(updatedBlocks);
    localStorage.setItem('terpdesk_busy_blocks', JSON.stringify(updatedBlocks));

    setBusyLabel('Busy');
    setBusyAllDay(false);
  };

  const cancelBusyTime = () => {
    setBusyLabel('Busy');
    setBusyAllDay(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="max-w-[1200px] mx-auto p-4 md:p-8 w-full pb-24 antialiased">

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
          <button onClick={handlePrev} className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={handleToday} className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 text-[13px] font-medium hover:bg-gray-50 transition-colors">
            Today
          </button>
          <button onClick={() => document.getElementById('private-busy-time')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="px-4 py-2 rounded-full bg-[#1B433C] text-white text-[13px] font-medium hover:bg-[#14332D] transition-colors ">
            Block time
          </button>
          <button onClick={handleNext} className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 bg-[#F3F4F6] px-4 py-2 rounded-full text-gray-600">
          <span className="text-[13px] font-medium">{formatBadge(currentDate)}</span>
          <CalendarIcon className="w-4 h-4" />
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center w-fit mx-auto p-1 bg-transparent mt-6 rounded-full relative z-10">
        {(['month', 'week', 'day'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`relative px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap outline-none transition-colors duration-200 ${view === v ? 'text-white' : 'text-[var(--sage)] hover:text-[var(--ink)]'}`}
          >
            {view === v && (
              <motion.div layoutId="interpreterCalendarTogglePill" className="absolute inset-0 bg-[#0f3730] rounded-full" initial={false} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
            )}
            <span className="relative z-10 capitalize">{v}</span>
          </button>
        ))}
      </div>

      <p className="text-[13px] text-[var(--sage)] mt-4 mb-4">
        {view === 'day' ? formatDayViewSubtitle(currentDate) : view === 'week' ? `Week of ${formatBadge(currentDate)}` : formatMonthYear(currentDate)} · Calendar time zone: {timeZone}
      </p>

      {/* Conditional Views */}

      {/* MONTH VIEW */}
      {view === 'month' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-12 w-full overflow-x-auto">
          <div className="min-w-[700px]">
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
            {(() => {
              const year = currentDate.getFullYear();
              const month = currentDate.getMonth(); // 0-11
              const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const rows = Math.ceil((firstDay + daysInMonth) / 7);

              return Array.from({ length: rows }).map((_, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-7 h-32 border-b border-gray-200 last:border-0">
                  {Array.from({ length: 7 }).map((_, colIdx) => {
                    const cellIndex = rowIdx * 7 + colIdx;
                    const dayNumber = cellIndex - firstDay + 1;
                    const isCurrentMonth = dayNumber >= 1 && dayNumber <= daysInMonth;

                    if (!isCurrentMonth) {
                      return <div key={colIdx} className="p-2 border-r border-gray-200 bg-[#F5F4F0] last:border-r-0"></div>;
                    }

                    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNumber.toString().padStart(2, '0')}`;

                    return (
                      <div key={colIdx} className="p-2 border-r border-gray-200 text-[12px] font-medium text-[var(--ink)] last:border-r-0 relative overflow-y-auto">
                        {dayNumber}
                        <div className="mt-1 flex flex-col gap-1">
                          {acceptedAppointments.filter(a => a.start.getFullYear() === year && a.start.getMonth() === month && a.start.getDate() === dayNumber).map(appt => {
                            const startStr = appt.start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                            const endStr = appt.end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                            return (
                              <div key={appt.id} onClick={() => router.push(`/jobs/${appt.id}`)} className="px-2 py-1.5 bg-[#E8EFEA] text-[#0B3B32] rounded-md cursor-pointer transition-opacity hover:opacity-80 border border-[#D5E3DB]">
                                <div className="text-[11px] font-semibold truncate leading-tight">{appt.title}</div>
                                <div className="text-[10px] opacity-90 leading-tight mt-0.5">{startStr}</div>
                                <div className="text-[10px] opacity-90 leading-tight mt-0.5">Reserved</div>
                                <div className="text-[10px] opacity-90 leading-tight mt-0.5 truncate">{appt.agencyName}</div>
                              </div>
                            );
                          })}
                          {busyBlocks.filter(b => b.start.startsWith(dateStr)).map(block => {
                            const startStr = new Date(block.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                            const endStr = new Date(block.end).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                            return (
                              <div key={block.id} className="px-1.5 py-1 bg-gray-100 text-gray-700 rounded-md">
                                <div className="text-[11px] font-medium truncate leading-tight">{block.label || 'Busy'}</div>
                                <div className="text-[10px] opacity-80 leading-tight mt-0.5">{startStr} - {endStr}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ));
            })()}
          </div>
          </div>
        </div>
      )}

      {/* WEEK VIEW TIME GRID */}
      {view === 'week' && (() => {
        const days = [];
        const firstDayOfWeek = new Date(currentDate);
        firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        for (let i = 0; i < 7; i++) {
          const day = new Date(firstDayOfWeek);
          day.setDate(day.getDate() + i);
          days.push(day);
        }

        const hours = Array.from({ length: 24 }).map((_, i) => {
          if (i === 0) return '12 AM';
          if (i === 12) return '12 PM';
          return i < 12 ? `${i} AM` : `${i - 12} PM`;
        });

        return (
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden mb-12 shadow-sm w-full overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header row */}
              <div className="grid grid-cols-[60px_1fr] border-b border-gray-200">
              <div className="border-r border-gray-100 bg-[#FAFAFA]"></div>
              <div className="grid grid-cols-7">
                {days.map((day, i) => (
                  <div key={i} className="text-center py-4 border-r border-gray-100 last:border-r-0">
                    <div className="text-[13px] font-semibold text-[var(--ink)]">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.getDay()]}</div>
                    <div className="text-[13px] text-gray-500 mt-0.5">{day.getMonth() + 1}/{day.getDate()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scrollable grid area */}
            <div className="relative h-[800px] overflow-y-auto">
              <div className="grid grid-cols-[60px_1fr] absolute min-w-full">
                {/* Time Axis */}
                <div className="bg-[#FAFAFA] border-r border-gray-100 flex flex-col relative z-20">
                  {hours.map((h, i) => (
                    <div key={i} className="h-[60px] border-b border-gray-100 relative">
                      <span className={`absolute right-2 text-[10px] text-gray-500 font-medium ${i === 0 ? 'top-1' : '-top-[9px]'}`}>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Day Columns */}
                <div className="grid grid-cols-7 relative">
                  {/* Background grid lines */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col">
                    {hours.map((_, i) => (
                      <div key={i} className="h-[60px] border-b border-gray-100 w-full" />
                    ))}
                  </div>

                  {days.map((day, dIdx) => {
                    const jobs = acceptedAppointments.filter(a => a.start.getFullYear() === day.getFullYear() && a.start.getMonth() === day.getMonth() && a.start.getDate() === day.getDate());
                    const blocks = busyBlocks.filter(b => {
                      const d = new Date(b.start);
                      return d.getFullYear() === day.getFullYear() && d.getMonth() === day.getMonth() && d.getDate() === day.getDate();
                    });

                    return (
                      <div key={dIdx} className="border-r border-gray-100 last:border-r-0 relative group">
                        {/* Interactive Click Grid */}
                        <div className="absolute inset-0 flex flex-col cursor-crosshair">
                          {hours.map((_, hIdx) => (
                            <div 
                              key={hIdx} 
                              className="h-[60px] hover:bg-gray-50/50 transition-colors z-0"
                              onClick={() => handleSlotClick(day, hIdx)}
                            />
                          ))}
                        </div>

                        {/* Plotted Events */}
                        {jobs.map(appt => {
                          const startM = appt.start.getHours() * 60 + appt.start.getMinutes();
                          const endM = appt.end.getHours() * 60 + appt.end.getMinutes();
                          const top = startM; // 1px = 1min
                          const height = Math.max(endM - startM, 30);
                          const startStr = appt.start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

                          return (
                            <div 
                              key={appt.id} 
                              onClick={(e) => { e.stopPropagation(); router.push(`/jobs/${appt.id}`); }}
                              className="absolute left-1 right-1 bg-[#E8EFEA] border border-[#D5E3DB] rounded-lg p-2 overflow-hidden shadow-sm z-10 cursor-pointer hover:shadow-md transition-shadow"
                              style={{ top: `${top}px`, height: `${height}px` }}
                            >
                              <div className="text-[11px] font-semibold text-[#0B3B32] truncate">{appt.title}</div>
                              <div className="text-[10px] text-[#14332D] mt-0.5">{startStr}</div>
                              <div className="text-[10px] text-[#14332D] opacity-90">Reserved</div>
                              <div className="text-[10px] text-[#14332D] opacity-80 mt-1 truncate">{appt.agencyName}</div>
                            </div>
                          );
                        })}

                        {/* Busy Blocks */}
                        {blocks.map(block => {
                          const s = new Date(block.start);
                          const e = new Date(block.end);
                          const startM = s.getHours() * 60 + s.getMinutes();
                          const endM = e.getHours() * 60 + e.getMinutes();
                          const top = startM;
                          const height = Math.max(endM - startM, 30);
                          const startStr = s.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                          
                          return (
                            <div 
                              key={block.id} 
                              className="absolute left-1 right-1 bg-gray-100 border border-gray-200 rounded-lg p-2 overflow-hidden z-10"
                              style={{ top: `${top}px`, height: `${height}px` }}
                            >
                              <div className="text-[11px] font-semibold text-gray-700 truncate">{block.label || 'Busy'}</div>
                              <div className="text-[10px] text-gray-500 mt-0.5">{startStr}</div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            </div>
          </div>
        );
      })()}

      {/* DAY VIEW (AGENDA STYLE) */}
      {view === 'day' && (() => {
        const jobs = acceptedAppointments.filter(a => a.start.getFullYear() === currentDate.getFullYear() && a.start.getMonth() === currentDate.getMonth() && a.start.getDate() === currentDate.getDate());

        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-12 shadow-sm">
            <h2 className="text-[18px] font-semibold text-[var(--ink)] mb-4">
              {formatDayViewSubtitle(currentDate)}
            </h2>

            {jobs.length === 0 ? (
              <p className="text-[14px] text-[var(--sage)] mb-6">
                Nothing scheduled for this day.
              </p>
            ) : (
              <div className="flex flex-col gap-2 mb-6">
                {jobs.map(appt => {
                  const startStr = appt.start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                  return (
                    <div key={appt.id} onClick={() => router.push(`/jobs/${appt.id}`)} className="px-4 py-3 bg-[#E8EFEA] text-[#0B3B32] border border-[#D5E3DB] rounded-xl cursor-pointer hover:opacity-90 transition-opacity w-full">
                      <div className="text-[13px] font-semibold mb-0.5">{appt.title}</div>
                      <div className="text-[12px] opacity-90">{startStr} · Reserved</div>
                    </div>
                  );
                })}
              </div>
            )}

            <button onClick={() => document.getElementById('private-busy-time')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="px-5 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-[13px] font-medium hover:bg-gray-50 transition-colors mt-2">
              Block time on this day
            </button>
          </div>
        );
      })()}

      {/* Manage availability Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-semibold text-[var(--ink)] mb-2">Manage availability</h2>
        <p className="text-[var(--sage)] mb-4 max-w-3xl">
          Your usual working hours, plus any dates that differ. This is a preference, not a promise: nothing here cancels a booking, and an agency can still offer you work outside these hours.
        </p>

        {/* Base Timezone */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-[var(--ink)] mb-4">Base time zone</h3>
          <select value={baseTimezone} onChange={e => setBaseTimezone(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none w-full max-w-md bg-white">
             <option value="America/Los_Angeles">Pacific Time — Seattle, Los Angeles</option>
             <option value="America/Denver">Mountain Time — Denver</option>
             <option value="America/Phoenix">Arizona (no daylight saving)</option>
             <option value="America/Chicago">Central Time — Chicago</option>
             <option value="America/New_York">Eastern Time — New York</option>
          </select>
        </div>

        {/* Card 1: Usual weekly hours */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-[var(--ink)] mb-4">Usual weekly hours</h3>
          <div className="flex flex-col">
            {daysOfWeek.map((day, idx) => {
              const rule = rules.find(r => r.weekday === idx);
              return (
                <div key={day} className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3 last:border-b-0 last:pb-0">
                  <div className="w-32 font-medium text-[var(--ink)] mt-2 sm:mt-0">{day}</div>
                  <div className="flex-1">
                    {!rule ? (
                      <div className="text-gray-400 mt-2 sm:mt-0">Not provided</div>
                    ) : (
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <input type="time" value={minutesToTimeString(rule.startMinute)} onChange={e => updateRule(idx, 'startMinute', timeStringToMinutes(e.target.value))} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none" />
                        <span className="text-gray-400">-</span>
                        <input type="time" value={minutesToTimeString(rule.endMinute)} onChange={e => updateRule(idx, 'endMinute', timeStringToMinutes(e.target.value))} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none" />
                        <button onClick={() => removeRule(idx)} className="text-gray-400 hover:text-red-500 p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  {!rule && (
                    <button onClick={() => addRule(idx)} className="px-4 py-1.5 rounded-full border border-gray-200 text-gray-700 text-[13px] font-medium hover:bg-gray-50 transition-colors shrink-0 mt-3 sm:mt-0">
                      Add hours
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Dates that are different */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-[var(--ink)] mb-2">Dates that are different</h3>
          <p className="text-[var(--sage)] mb-4 text-[15px]">A date entered here replaces your usual hours for that day.</p>

          {exceptions.map((ex, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0">
              <input type="date" value={ex.date} onChange={e => updateException(idx, { date: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none" />
              <select
                value={ex.available ? 'available' : 'unavailable'}
                onChange={e => {
                  const isAvail = e.target.value === 'available';
                  updateException(idx, { available: isAvail, startMinute: isAvail ? 540 : undefined, endMinute: isAvail ? 1020 : undefined });
                }}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white outline-none"
              >
                <option value="unavailable">Not available at all</option>
                <option value="available">Available these hours</option>
              </select>

              {ex.available && ex.startMinute != null && ex.endMinute != null && (
                <div className="flex items-center gap-2">
                  <input type="time" value={minutesToTimeString(ex.startMinute)} onChange={e => updateException(idx, { startMinute: timeStringToMinutes(e.target.value) })} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none" />
                  <span className="text-gray-400">-</span>
                  <input type="time" value={minutesToTimeString(ex.endMinute)} onChange={e => updateException(idx, { endMinute: timeStringToMinutes(e.target.value) })} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none" />
                </div>
              )}

              <button onClick={() => removeException(idx)} className="text-gray-400 hover:text-red-500 p-2 ml-auto">
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}

          <button onClick={addException} className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 text-[13px] font-medium hover:bg-gray-50 transition-colors mt-2">
            Add a date
          </button>
        </div>

        {/* Conflict Engine Output */}
        {conflicts.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 overflow-hidden">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-2 text-[14px]">These are still booked. Availability never cancels accepted work — contact the agency if you need a change.</p>
                <ul className="list-disc pl-5 text-[13px] space-y-1">
                  {conflicts.map(c => {
                    const startStr = c.start.toLocaleString();
                    return (
                      <li key={c.id}>
                        <span className="font-medium">{c.title}</span> with {c.agencyName} ({startStr})
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Private busy time Section */}
      <div id="private-busy-time" className="mt-12">
        <h2 className="text-3xl font-semibold text-[var(--ink)] mb-2">Private busy time</h2>
        <p className="text-[var(--sage)] mb-6 max-w-2xl">
          Only you can see these blocks. Agencies receive no personal details. A block cannot cancel a reserved appointment.
        </p>

        {/* Card 3: Block time */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-12">
          <h3 className="font-semibold text-[var(--ink)] mb-6">Block time</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] text-[var(--sage)] mb-1">Private label (optional)</label>
              <input type="text" value={busyLabel} onChange={e => setBusyLabel(e.target.value)} className="bg-[#F5F4F0] border-none rounded-xl p-3 w-full text-[14px] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[#1B433C]/20" />
            </div>
            <div>
              <label className="block text-[13px] text-[var(--sage)] mb-1">Time zone</label>
              <select
                value={busyTimeZone}
                onChange={e => setBusyTimeZone(e.target.value)}
                className="bg-[#F5F4F0] border-none rounded-xl p-3 w-full text-[14px] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[#1B433C]/20"
              >
                <option value="Pacific Time — Seattle, Los Angeles">Pacific Time — Seattle, Los Angeles</option>
                <option value="Mountain Time — Denver">Mountain Time — Denver</option>
                <option value="Arizona (no daylight saving)">Arizona (no daylight saving)</option>
                <option value="Central Time — Chicago">Central Time — Chicago</option>
                <option value="Eastern Time — New York">Eastern Time — New York</option>
                <option value="Alaska Time">Alaska Time</option>
                <option value="Hawaii Time">Hawaii Time</option>
              </select>
            </div>
            <div className="flex items-center gap-2 my-4">
              <input type="checkbox" checked={busyAllDay} onChange={e => setBusyAllDay(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#1B433C] focus:ring-[#1B433C]" />
              <span className="text-[14px] text-[var(--ink)]">All day</span>
            </div>
            <div>
              <label className="block text-[13px] text-[var(--sage)] mb-1">Busy start</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative flex-1">
                  <input type="date" value={busyStartDate} onChange={e => setBusyStartDate(e.target.value)} className="bg-[#F5F4F0] border-none rounded-xl p-3 w-full text-[14px] pr-10 focus:outline-none" />
                  <CalendarIcon className="w-4 h-4 text-[var(--ink)] absolute right-4 top-3.5 pointer-events-none" />
                </div>
                <div className="relative flex-1">
                  <input type="time" value={busyStartTime} onChange={e => setBusyStartTime(e.target.value)} className="bg-[#F5F4F0] border-none rounded-xl p-3 w-full text-[14px] pr-10 focus:outline-none" />
                  <Clock className="w-4 h-4 text-[var(--ink)] absolute right-4 top-3.5 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="pt-2">
              <label className="block text-[13px] text-[var(--sage)] mb-1">Busy end</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative flex-1">
                  <input type="date" value={busyEndDate} onChange={e => setBusyEndDate(e.target.value)} className="bg-[#F5F4F0] border-none rounded-xl p-3 w-full text-[14px] pr-10 focus:outline-none" />
                  <CalendarIcon className="w-4 h-4 text-[var(--ink)] absolute right-4 top-3.5 pointer-events-none" />
                </div>
                <div className="relative flex-1">
                  <input type="time" value={busyEndTime} onChange={e => setBusyEndTime(e.target.value)} className="bg-[#F5F4F0] border-none rounded-xl p-3 w-full text-[14px] pr-10 focus:outline-none" />
                  <Clock className="w-4 h-4 text-[var(--ink)] absolute right-4 top-3.5 pointer-events-none" />
                </div>
              </div>
            </div>
            <p className="text-[12px] text-[var(--sage)] mt-6 mb-4">
              Agencies you share availability with only see that you are unavailable — never the label. A block never cancels or changes a booked assignment.
            </p>
            <div className="flex items-center gap-3">
              <button onClick={saveBusyTime} className="bg-[#1B433C] text-white rounded-full px-6 py-2 text-[14px] font-medium hover:bg-[#14332D] transition-colors">
                Save private busy time
              </button>
              <button onClick={cancelBusyTime} className="bg-white border border-gray-200 text-gray-700 rounded-full px-6 py-2 text-[14px] font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>

            {busyBlocks.length > 0 && (
              <div className="mt-6 border-t border-gray-100 pt-6">
                <h4 className="font-medium text-[14px] mb-3">Saved Busy Blocks</h4>
                <div className="space-y-2">
                  {busyBlocks.map(b => (
                    <div key={b.id} className="bg-gray-50 p-3 rounded-lg text-sm flex justify-between items-center">
                      <div>
                        <span className="font-semibold">{b.label}</span>
                        <span className="text-gray-500 ml-2">{b.start} to {b.end}</span>
                      </div>
                      <button onClick={() => setBusyBlocks(prev => { const n = prev.filter(x => x.id !== b.id); localStorage.setItem('terpdesk_busy_blocks', JSON.stringify(n)); return n; })} className="text-gray-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
