"use client";
import React from "react";
import Link from "next/link";
import { useRequests } from "@/context/RequestsContext";
import { motion } from "framer-motion";

export default function DashboardPage() {
 const { requests } = useRequests();
 
 const totalAppointments = requests.length;
 const needingCoverage = requests.filter(r => r.status === "Unfilled / draft").length;
 const pendingOffersCount = requests.filter(r => r.status.includes("Awaiting")).length;
 const staffFollowUpCount = requests.filter(r => r.status === "Partially staffed").length;
 const needsReplacementCount = 0;

 const getNeedsAttentionPriority = (status: string) => {
   if (status === 'Needs replacement') return 1;
   if (status === 'Staff follow-up') return 2;
   if (status.includes('Awaiting') || status.includes('Offer') || status.includes('Pending')) return 3;
   if (status.includes('Unfilled') || status.includes('draft') || status.includes('Partially')) return 4;
   return 5;
 };

 const needsAttentionJobs = [...requests]
   .filter(r => r.status !== 'Cancelled' && getNeedsAttentionPriority(r.status) < 5)
   .sort((a, b) => getNeedsAttentionPriority(a.status) - getNeedsAttentionPriority(b.status));

 const upcomingBookingsJobs = [...requests]
   .filter(r => {
     const s = r.status.toLowerCase();
     if (s.includes('cancel')) return false;
     if (s.includes('unfilled') || s.includes('draft')) return false;
     return s.includes('staffed') || s.includes('booked') || s.includes('accepted') || s.includes('assigned');
   })
   .sort((a, b) => {
     const timeA = (a.timestamp && !isNaN(Number(a.timestamp))) ? Number(a.timestamp) : 0;
     const timeB = (b.timestamp && !isNaN(Number(b.timestamp))) ? Number(b.timestamp) : 0;
     return timeA - timeB;
   })
   .slice(0, 6);

 const [awaitingReviewCount, setAwaitingReviewCount] = React.useState(0);
 
 React.useEffect(() => {
 try {
 const storedJobs = JSON.parse(localStorage.getItem('terpdesk_interpreter_jobs') || '[]');
 const submitted = storedJobs.filter((job: any) => job.serviceRecordState === 'submitted').length;
 setAwaitingReviewCount(submitted);
 } catch (e) {
 console.error(e);
 }
 }, []);

  return (
  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mx-auto max-w-[1200px] space-y-10 pt-2">
 
 {/* Banners & Inputs */}
 <div className="space-y-6">
 <div className="space-y-1.5 w-full">
 <label className="pl-5 text-[13px] font-medium text-[var(--sage)]">Agency</label>
 <div className="rounded-full bg-[#F3F2EE] px-6 py-3.5 text-[15px] text-slate-600 border border-neutral-200/50">
 North Fictional Interpreting
 </div>
 </div>
 </div>

 {/* Welcome Section */}
 <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-0">
 <div className="space-y-2">
 <h1 className="text-[32px] font-semibold tracking-tight text-[var(--ink)]">Welcome, Avery</h1>
 <p className="text-[15px] text-[var(--sage)]">
 Your scheduling desk. Appointments and coverage saved across authorized accounts.
 </p>
 </div>
 <Link href="/requests/new" className="inline-block rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0B3B32]/50">
 New request
 </Link>
 </div>

 {/* Dark Stats Card */}
 <div className="rounded-2xl border border-gray-200 bg-[var(--forest)] p-8 text-white ">
 <p className="mb-8 text-xs font-medium text-[#8BA49E]">
 Upcoming appointments and unresolved past appointments
 </p>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
 <Link href="/requests" className="flex flex-col gap-2 text-left hover:opacity-75 transition-opacity cursor-pointer">
 <span className="text-[11px] font-semibold tracking-widest text-[#8BA49E]">APPOINTMENTS</span>
 <span className="text-[28px] font-medium leading-none">{totalAppointments}</span>
 </Link>
 <Link href="/requests?filter=needing-coverage" className="flex flex-col gap-2 text-left hover:opacity-75 transition-opacity cursor-pointer">
 <span className="text-[11px] font-semibold tracking-widest text-[#8BA49E]">NEEDING COVERAGE</span>
 <span className="text-[28px] font-medium leading-none">{needingCoverage}</span>
 </Link>
 <Link href="/requests?filter=pending-offers" className="flex flex-col gap-2 text-left hover:opacity-75 transition-opacity cursor-pointer">
 <span className="text-[11px] font-semibold tracking-widest text-[#8BA49E]">PENDING OFFERS</span>
 <span className="text-[28px] font-medium leading-none">{pendingOffersCount}</span>
 </Link>
 <Link href="/requests?filter=staff-follow-up" className="flex flex-col gap-2 text-left hover:opacity-75 transition-opacity cursor-pointer">
 <span className="text-[11px] font-semibold tracking-widest text-[#8BA49E]">STAFF FOLLOW-UP</span>
 <span className="text-[28px] font-medium leading-none">{staffFollowUpCount}</span>
 </Link>
 
 <Link href="/requests?filter=needs-replacement" className="flex flex-col gap-2 text-left hover:opacity-75 transition-opacity cursor-pointer">
 <span className="text-[11px] font-semibold tracking-widest text-[#8BA49E]">NEEDS REPLACEMENT</span>
 <span className="text-[28px] font-medium leading-none">{needsReplacementCount}</span>
 </Link>
 <Link href="/hours-review" className="flex flex-col gap-2 text-left hover:opacity-75 transition-opacity cursor-pointer">
 <span className="text-[11px] font-semibold tracking-widest text-[#8BA49E]">HOURS AWAITING REVIEW</span>
 <span className="text-[28px] font-medium leading-none">{awaitingReviewCount}</span>
 </Link>
 </div>
 </div>

 {/* Bottom Grid */}
 <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
 {/* Left Column (col-span-2) */}
 <div className="lg:col-span-2 space-y-8">
 
 {/* Needs attention */}
 <section className="space-y-5">
 <h2 className="text-lg font-semibold text-[var(--ink)] px-2">Needs attention</h2>
 
 <div className="space-y-2.5">
 {needsAttentionJobs.length === 0 && <p className="text-sm text-[var(--sage)]">Nothing needs your attention right now.</p>}
 {needsAttentionJobs.map(request => {
  const s = request.status;
  let dotColor = "bg-[#B59A6D]"; // Yellow default
  let btnLabel = "Manage slots";
  
  if (s === 'Needs replacement' || s === 'Staff follow-up') {
    dotColor = "bg-red-500";
    btnLabel = "Open";
  } else if (s.includes('Awaiting') || s.includes('Offer') || s.includes('Pending')) {
    dotColor = "bg-[#AF4A3F]"; // Coral
    btnLabel = "View";
  }

  return (
   <Link href={`/requests/${request.id}`} key={request.id} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-[#EFECE5] px-6 py-3.5 hover:bg-[#e8e4db] transition-colors cursor-pointer">
   <div className="flex items-start gap-3">
   <div className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${dotColor}`}></div>
   <div className="flex flex-col">
   <p className="text-[15px] font-medium text-slate-800">{request.status} — {request.title}</p>
   <p className="mt-0.5 text-[13px] text-[var(--sage)]">{request.dateString}</p>
   {request.pendingOffer && <p className="text-xs text-[#AF4A3F] mt-1 font-medium">Offer expires soon</p>}
   </div>
   </div>
   <div className="ml-4 shrink-0 text-sm font-medium text-slate-700 transition-colors">
   {btnLabel}
   </div>
   </Link>
  )
 })}
 </div>
 </section>

 {/* Upcoming bookings */}
 <section className="space-y-5">
 <div className="rounded-2xl border border-gray-200 bg-white p-8 border border-neutral-100/50">
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-[17px] font-semibold text-[var(--ink)]">Upcoming bookings</h2>
 <button className="text-sm font-medium text-slate-600 hover:text-[var(--ink)] transition-colors">Open calendar →</button>
 </div>

 <div className="space-y-6">
 {upcomingBookingsJobs.length === 0 && <p className="text-sm text-[var(--sage)]">No upcoming bookings.</p>}
 {upcomingBookingsJobs.map(job => (
  <Link href={`/requests/${job.id}`} key={job.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-neutral-100 pb-6 last:border-0 last:pb-0 hover:bg-gray-50 transition-colors cursor-pointer">
  <div className="space-y-1">
  <p className="text-[15px] font-medium text-[var(--ink)]">{job.title}</p>
  <p className="text-[13px] text-[var(--sage)]">{job.dateString}</p>
  <p className="text-[13px] text-[var(--sage)]">{job.location || 'Virtual details pending'}</p>
  </div>
  <div className="shrink-0 mt-1 sm:mt-0">
    <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${job.status.includes('Partially') ? 'bg-[#E8F3EE] text-[#466960]' : 'bg-[#E6EFEA] text-[#385B52]'}`}>
    {job.status}
    </span>
  </div>
  </Link>
 ))}
 </div>
 </div>
 </section>

 </div>

 {/* Right Column (col-span-1) */}
 <div className="lg:col-span-1">
 <div className="rounded-2xl border border-gray-200 bg-white p-8 border border-neutral-100/50 h-full max-h-[400px]">
 <h2 className="mb-4 text-[17px] font-semibold text-[var(--ink)]">Unavailable in this test workspace</h2>
 <p className="text-[15px] leading-relaxed text-[var(--sage)]">
 Billing, payments and integrations are unavailable. Notifications appear inside the app, and you can turn on optional email notices in Settings. Nothing is texted or pushed to your device.
 </p>
 </div>
 </div>
 </div>

  </motion.div>
  );
}
