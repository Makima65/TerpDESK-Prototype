"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { useInterpreterJobs } from "@/context/InterpreterJobsContext";

export default function JobDetailPage() {
 const { id } = useParams<{ id: string }>();
 const { jobs, acceptJobOffer, declineOffer, releaseJob, submitHours } = useInterpreterJobs();
 const [isOffersOpen, setIsOffersOpen] = useState(true);

 const job = jobs.find(j => j.id === id);

 if (!job) return <div className="p-8 text-center text-[var(--sage)]">Job not found</div>;

 if (job.status === 'declined') {
 return (
 <div className="max-w-[1200px] mx-auto p-4 md:p-8 w-full pb-24 antialiased flex flex-col items-center justify-center pt-32">
 <div className="bg-white rounded-2xl border border-gray-200 border border-gray-200 p-8 text-center max-w-md w-full">
 <h2 className="text-xl font-semibold text-[var(--ink)] mb-4">Offer Declined</h2>
 <p className="text-[var(--sage)] mb-8">You have declined this offer.</p>
 <Link href="/interpreter-home" className="inline-flex items-center justify-center gap-2 text-[14px] font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-6 py-2.5 rounded-full transition-colors">
 <ArrowLeft className="w-4 h-4" />
 Back to dashboard
 </Link>
 </div>
 </div>
 );
 }

 if (job.status === 'released') {
 return (
 <div className="max-w-[1200px] mx-auto p-4 md:p-8 w-full pb-24 antialiased flex flex-col items-center justify-center pt-32">
 <div className="bg-white rounded-2xl border border-gray-200 border border-gray-200 p-8 text-center max-w-md w-full">
 <h2 className="text-xl font-semibold text-[var(--ink)] mb-4">Assignment Released</h2>
 <p className="text-[var(--sage)] mb-8">You have released this assignment and no longer have access.</p>
 <Link href="/interpreter-home" className="inline-flex items-center justify-center gap-2 text-[14px] font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-6 py-2.5 rounded-full transition-colors">
 <ArrowLeft className="w-4 h-4" />
 Back to dashboard
 </Link>
 </div>
 </div>
 );
 }

 return (
 <div className="max-w-[1200px] mx-auto p-4 md:p-8 w-full pb-24 antialiased">
 
 {/* Back Button */}
 <div className="mb-6">
 <Link href="/jobs" className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--sage)] hover:text-[var(--ink)] transition-colors">
 <ArrowLeft className="w-4 h-4" />
 Back to assignments
 </Link>
 </div>

 <div className="max-w-[800px]">
 {/* Page Header */}
 <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
 <div>
 <h1 className="text-[28px] font-semibold text-[var(--ink)] mb-1 tracking-tight">
 {job.title}
 </h1>
 <p className="text-[15px] text-[var(--sage)]">
 {job.dateString}
 </p>
 </div>
 <div className="flex items-center gap-3 shrink-0 sm:mt-2">
 {job.status === 'pending' && (
 <span className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
 Offers / draft
 </span>
 )}
 {job.status === 'booked' && (
 <span className="bg-[#E2EBE5] text-[#1B433C] text-[12px] px-3 py-1.5 rounded-full font-medium">
 Booked
 </span>
 )}
 <Link href="/interpreter-calendar" className="bg-white border border-gray-200 text-[var(--ink)] text-sm px-4 py-1.5 rounded-full hover:bg-gray-50 transition-colors ">
 View in calendar
 </Link>
 </div>
 </div>

 <div className="space-y-4">
 
 {/* Overview Card */}
 <div className="bg-white rounded-2xl border border-gray-200 border border-gray-200 p-6 ">
 <h2 className="text-[16px] font-semibold text-[var(--ink)] mb-4">Overview</h2>
 <div className="space-y-0">
 <div className="flex items-center justify-between py-3 border-b border-gray-50">
 <span className="text-[14px] text-gray-400">Location</span>
 <span className="text-[14px] text-[var(--ink)] text-right">{job.location}</span>
 </div>
 <div className="flex items-center justify-between py-3 border-b border-gray-50">
 <span className="text-[14px] text-gray-400">Reference</span>
 <span className="text-[14px] text-[var(--ink)]">APT-1E7415</span>
 </div>
 <div className="flex items-center justify-between py-3">
 <span className="text-[14px] text-gray-400">Status</span>
 <span className="text-[14px] text-[var(--ink)]">See your offer status below</span>
 </div>
 </div>
 </div>

 {/* Assignment Details Card */}
 <div className="bg-white rounded-2xl border border-gray-200 border border-gray-200 p-6 ">
 <h2 className="text-[16px] font-semibold text-[var(--ink)] mb-4">Assignment details</h2>
 <div className="space-y-0">
 <div className="flex items-center justify-between py-3 border-b border-gray-50">
 <span className="text-[14px] text-gray-400">Format</span>
 <span className="text-[14px] text-[var(--ink)]">
 {job.isVirtual ? 'Virtual' : 'In person'}
 </span>
 </div>
 <div className="flex items-center justify-between py-3">
 <span className="text-[14px] text-gray-400">Time zone</span>
 <span className="text-[14px] text-[var(--ink)]">Pacific Time — Seattle, Los Angeles</span>
 </div>
 </div>
 </div>

 {/* Virtual meeting details */}
 {job.isVirtual && (
 <div className="bg-white rounded-2xl border border-gray-200 border border-gray-200 p-6 ">
 <h2 className="text-[16px] font-semibold text-[var(--ink)] mb-4">Virtual meeting details</h2>
 <p className="text-[var(--ink)] text-sm mb-1">Not provided yet.</p>
 <p className="text-[var(--sage)] text-sm">Treat meeting links and access codes as restricted assignment information.</p>
 </div>
 )}

 {/* Card 2 */}
 <div className="bg-white rounded-2xl border border-gray-200 border border-gray-200 p-6 ">
 <h2 className="text-lg font-semibold text-[var(--ink)] mb-4">Preparation notes</h2>
 <p className="text-[14px] text-[var(--sage)]">No preparation notes yet.</p>
 </div>

 {/* Card 3 */}
 <div className="bg-white rounded-2xl border border-gray-200 border border-gray-200 p-6 ">
 <h2 className="text-lg font-semibold text-[var(--ink)] mb-4">Prep materials</h2>
 <p className="text-[14px] text-[var(--sage)]">No prep materials have been shared for this job.</p>
 </div>

 {/* Card 4 - Staffing */}
 <div className="bg-white rounded-2xl border border-gray-200 border border-gray-200 p-6 ">
 <h2 className="text-lg font-semibold text-[var(--ink)] mb-4">Staffing</h2>
 <p className="text-[14px] text-[var(--sage)] mb-8">Pending offers do not reserve time.</p>

 <h3 className="text-[16px] font-semibold text-[var(--ink)] mb-4">
 Your position · interpreter
 </h3>

 <div className="flex flex-wrap items-center gap-3 mb-6">
 {job.status === 'pending' ? (
 <span className="bg-[#FEF3C7] text-[#92400E] text-[12px] font-medium px-3 py-1 rounded-full">
 Booking: Unfilled
 </span>
 ) : (
 <span className="bg-[#E2EBE5] text-[#1B433C] text-[12px] font-medium px-3 py-1 rounded-full">
 Booking: Filled
 </span>
 )}
 <span className="bg-white border border-gray-200 text-gray-600 text-[12px] font-medium px-3 py-1 rounded-full ">
 Access: Available
 </span>
 </div>

 <p className="text-[14px] text-gray-700 mb-6">
 Assigned interpreter: <span className="text-[var(--sage)]">
 {job.status === 'pending' ? 'Unfilled' : 'Dale Fictional'}
 </span>
 </p>

 {job.status === 'pending' ? (
 <div className="bg-[var(--canvas)] border border-gray-200 rounded-xl p-5 md:p-6 mt-4">
 <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
 <div className="flex flex-col gap-2">
 <div className="flex items-center gap-2">
 <span className="text-[14px] font-medium text-[var(--ink)]">Your offer ·</span>
 <span className="bg-[#E0E7FF] text-[#4338CA] text-[11px] font-semibold -full">
 Pending
 </span>
 </div>
 <p className="text-[13px] text-[var(--sage)]">
 Response due Fri, Oct 2 · 12:00 AM GMT+8
 </p>
 </div>

 <div className="flex items-center gap-3 shrink-0">
 <button 
 onClick={() => acceptJobOffer(job.id)}
 className="bg-[var(--forest)] hover:bg-[#145347] cursor-pointer text-white text-[13px] font-medium px-5 py-2 rounded-full transition-colors w-full sm:w-auto "
 >
 Accept offer
 </button>
 <button 
 onClick={() => declineOffer(job.id)}
 className="bg-white hover:bg-gray-50 cursor-pointer text-gray-800 border border-gray-200 text-[13px] font-medium px-5 py-2 rounded-full transition-colors w-full sm:w-auto "
 >
 Decline offer
 </button>
 </div>
 </div>
 </div>
 ) : (
 <div className="mt-4 flex flex-col gap-4">
 <div className="bg-[#F5F4F0] rounded-xl p-4">
 <button 
 onClick={() => setIsOffersOpen(!isOffersOpen)}
 className="w-full flex items-center gap-2 text-left focus:outline-none"
 >
 {isOffersOpen ? (
 <ChevronDown className="w-4 h-4 text-gray-700" />
 ) : (
 <ChevronRight className="w-4 h-4 text-gray-700" />
 )}
 <span className="font-medium text-sm text-[var(--ink)]">Previous offers (1)</span>
 </button>
 
 {isOffersOpen && (
 <div className="mt-4 flex items-center gap-2 pl-6">
 <span className="text-[14px] text-gray-600">Your offer ·</span>
 <span className="bg-white border border-gray-200 text-gray-600 text-[11px] font-medium px-2 py-0.5 rounded-full ">
 Closed
 </span>
 </div>
 )}
 </div>

 <div className="flex justify-end gap-3 flex-wrap">
 <button 
 onClick={() => releaseJob(job.id)}
 className="bg-white hover:bg-red-50 text-red-700 border border-red-200 text-[13px] font-medium px-5 py-2 rounded-full transition-colors cursor-pointer"
 >
 Give back
 </button>
 
 {job.serviceRecordState === 'not_started' && (
 <button 
 onClick={() => submitHours(job.id)}
 className="bg-[#1B433C] hover:bg-[#145347] text-white text-[13px] font-medium px-5 py-2 rounded-full transition-colors cursor-pointer"
 >
 Submit Hours
 </button>
 )}

 {job.serviceRecordState === 'submitted' && (
 <button 
 disabled
 className="bg-gray-100 text-[var(--sage)] text-[13px] font-medium px-5 py-2 rounded-full cursor-not-allowed"
 >
 Hours submitted - Awaiting Agency Approval
 </button>
 )}
 </div>
 </div>
 )}

 </div>

 </div>
 </div>
 </div>
 );
}
