"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RefreshCw, MapPin } from "lucide-react";
import { useInterpreterJobs } from "@/context/InterpreterJobsContext";
import { motion } from "framer-motion";

type Tab = "upcoming" | "past";

export default function InterpreterJobsPage() {
 const { jobs } = useInterpreterJobs();
 const [activeTab, setActiveTab] = useState<Tab>("upcoming");
 const [pastFilter, setPastFilter] = useState("All past jobs");

 const upcomingJobs = jobs.filter(job => job.status === 'pending' || job.status === 'booked');
 const pastJobs = jobs.filter(job => job.status === 'declined' || job.status === 'released');
 
 const upcomingCount = upcomingJobs.length;
 const pastCount = pastJobs.length;
 const totalCount = upcomingCount + pastCount;

 return (
 <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-[1200px] mx-auto p-4 md:p-8 w-full pb-24 antialiased">
 
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pt-4">
 <div>
 <h1 className="text-3xl font-semibold tracking-tight text-[var(--ink)] mb-2">
 Jobs
 </h1>
 <p className="text-[var(--sage)] text-[15px]">
 Shared appointments, offers and reserved interpreter positions.
 </p>
 </div>
 <button className="flex items-center justify-center p-2.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shrink-0">
 <RefreshCw className="w-4 h-4" />
 </button>
 </div>

 {/* Search Bar */}
 <div className="w-full mb-4">
 <input 
 type="text" 
 placeholder="Search jobs, locations and settings..." 
 className="w-full bg-[#F5F4F0] border-none rounded-full px-6 py-3.5 text-[14px] text-[var(--ink)] placeholder:text-[var(--sage)] focus:outline-none focus:ring-2 focus:ring-[#1B433C]/20 transition-all"
 />
 </div>

 {/* Count Text */}
 <p className="text-sm text-[var(--sage)] my-4">{totalCount} appointments</p>

 {/* Toggle Bar */}
 <div className="bg-[#F5F4F0] p-1 rounded-full flex w-full mb-8">
 <button 
 onClick={() => setActiveTab("upcoming")}
 className={`flex-1 text-[13px] font-medium py-2 rounded-full flex items-center justify-center gap-1.5 transition-all ${activeTab === "upcoming" ? "bg-white text-[var(--ink)] " : "text-[var(--sage)] hover:text-gray-700"}`}
 >
 Upcoming <span className={activeTab === "upcoming" ? "text-[var(--sage)] font-normal" : "font-normal opacity-70"}>{upcomingCount}</span>
 </button>
 <button 
 onClick={() => setActiveTab("past")}
 className={`flex-1 text-[13px] font-medium py-2 rounded-full flex items-center justify-center gap-1.5 transition-all ${activeTab === "past" ? "bg-white text-[var(--ink)] " : "text-[var(--sage)] hover:text-gray-700"}`}
 >
 Past jobs <span className={activeTab === "past" ? "text-[var(--sage)] font-normal" : "font-normal opacity-70"}>{pastCount}</span>
 </button>
 </div>

 {/* Conditional View: Upcoming */}
 {activeTab === "upcoming" && (
 <div>
 <h2 className="text-xl font-semibold text-[var(--ink)] mt-8 mb-4">Upcoming</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {upcomingJobs.map((job) => {
 const locationParts = job.location.split('·');
 const locPrimary = locationParts[0]?.trim();
 const locSecondary = locationParts[1]?.trim();
 
 return (
 <Link key={job.id} href={`/jobs/${job.id}`} className="block bg-white rounded-2xl border border-gray-200 p-6 border border-gray-200 hover: transition-shadow">
 <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-2">
 <div className="text-[11px] font-bold tracking-wider text-[#A0522D] uppercase mt-1">
 {job.dateString}
 </div>
 <div className="flex gap-2">
 {job.status === 'pending' && (
 <div className="bg-[#F5F3FF] text-[#6D28D9] text-[12px] font-medium px-3 py-1 rounded-full w-max shrink-0">
 Offer received
 </div>
 )}
 {job.status === 'booked' && (
 <div className="bg-[#E2EBE5] text-[#1B433C] text-[12px] font-medium px-3 py-1 rounded-full w-max shrink-0">
 Booked
 </div>
 )}
 {job.hasAutoFill && (
 <div className="bg-[#FCE8E6] text-[#A0522D] text-[12px] font-medium px-3 py-1 rounded-full w-max shrink-0">
 Auto Fill
 </div>
 )}
 </div>
 </div>
 <h3 className="text-lg font-semibold text-[var(--ink)] my-2">
 {job.title}
 </h3>
 <div className="flex items-start gap-2 mb-4">
 <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
 <div className="text-[14px]">
 <span className="text-[var(--ink)] block">{locPrimary}</span>
 <span className="text-[var(--sage)]">{locSecondary}</span>
 </div>
 </div>
 <div className="flex flex-wrap gap-2 mt-4">
 <span className="text-[12px] font-medium text-gray-600 border border-gray-200 px-3 py-1 rounded-full">Setting pending</span>
 {job.isVirtual && (
 <span className="text-[12px] font-medium text-gray-600 border border-gray-200 px-3 py-1 rounded-full">Virtual</span>
 )}
 </div>
 </Link>
 );
 })}
 </div>
 </div>
 )}

 {/* Conditional View: Past Jobs */}
 {activeTab === "past" && (
 <div>
 
 {/* A. Filter Bar */}
 <div className="flex flex-wrap items-center gap-2 mb-8">
 {["All past jobs", "Needs hours", "Submitted", "Changes requested", "Approved"].map((filter) => (
 <button 
 key={filter}
 onClick={() => setPastFilter(filter)}
 className={`text-[13px] font-medium px-4 py-2 rounded-full transition-colors ${
 pastFilter === filter 
 ? "bg-[#1B433C] text-white" 
 : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
 }`}
 >
 {filter}
 </button>
 ))}
 </div>

 {/* B. Past Jobs Section */}
 <h2 className="text-xl font-semibold text-[var(--ink)] mb-2">Past jobs</h2>
 <p className="text-sm text-[var(--sage)] mb-6">
 A past date does not mean the service was completed or approved. Reported hours stay in their own state until an agency reviews them.
 </p>

 {/* C. Conditional Grid vs Empty State */}
 {(pastFilter === "Needs hours" || pastFilter === "Changes requested") ? (
 <div className="bg-white rounded-2xl border border-gray-200 border border-gray-200 p-6 mb-12">
 <p className="text-[14px] text-[var(--sage)]">
 No past jobs are in "{pastFilter}" right now.
 </p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
 {/* Card 1 */}
 <Link href="/jobs/past-1" className="block bg-white rounded-2xl border border-gray-200 p-6 border border-gray-200 hover: transition-shadow">
 <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-2">
 <div className="text-[11px] font-bold tracking-wider text-[#A0522D] uppercase mt-1">
 TUE, SEP 22 · 10:53 AM – 12:53 PM PDT
 </div>
 <div className="flex gap-2">
 <div className="bg-[#E2EBE5] text-[#1B433C] text-[12px] font-medium px-3 py-1 rounded-full w-max shrink-0">
 Booked
 </div>
 </div>
 </div>
 <h3 className="text-lg font-semibold text-[var(--ink)] my-2">
 Fictional mileage and signature test
 </h3>
 <div className="flex items-start gap-2 mb-4">
 <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
 <div className="text-[14px]">
 <span className="text-[var(--ink)] block">Virtual details pending</span>
 <span className="text-[var(--sage)]">QA Fixture Agency A (automated tests)</span>
 </div>
 </div>
 <div className="flex flex-wrap gap-2 mt-4">
 <span className="text-[12px] font-medium text-gray-600 border border-gray-200 px-3 py-1 rounded-full">Setting pending</span>
 <span className="text-[12px] font-medium text-gray-600 border border-gray-200 px-3 py-1 rounded-full">Virtual</span>
 </div>
 </Link>

 {/* Card 2 */}
 <Link href="/jobs/past-2" className="block bg-white rounded-2xl border border-gray-200 p-6 border border-gray-200 hover: transition-shadow">
 <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-2">
 <div className="text-[11px] font-bold tracking-wider text-[#A0522D] uppercase mt-1">
 TUE, SEP 22 · 10:53 AM – 12:53 PM PDT
 </div>
 <div className="flex gap-2">
 <div className="bg-[#E2EBE5] text-[#1B433C] text-[12px] font-medium px-3 py-1 rounded-full w-max shrink-0">
 Booked
 </div>
 </div>
 </div>
 <h3 className="text-lg font-semibold text-[var(--ink)] my-2">
 Fictional mileage and signature test
 </h3>
 <div className="flex items-start gap-2 mb-4">
 <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
 <div className="text-[14px]">
 <span className="text-[var(--ink)] block">Virtual details pending</span>
 <span className="text-[var(--sage)]">QA Fixture Agency A (automated tests)</span>
 </div>
 </div>
 <div className="flex flex-wrap gap-2 mt-4">
 <span className="text-[12px] font-medium text-gray-600 border border-gray-200 px-3 py-1 rounded-full">Setting pending</span>
 <span className="text-[12px] font-medium text-gray-600 border border-gray-200 px-3 py-1 rounded-full">Virtual</span>
 </div>
 </Link>

 {/* Card 3 */}
 <Link href="/jobs/past-3" className="block bg-white rounded-2xl border border-gray-200 p-6 border border-gray-200 hover: transition-shadow">
 <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-2">
 <div className="text-[11px] font-bold tracking-wider text-[#A0522D] uppercase mt-1">
 TUE, SEP 22 · 10:53 AM – 12:53 PM PDT
 </div>
 <div className="flex gap-2">
 <div className="bg-[#E2EBE5] text-[#1B433C] text-[12px] font-medium px-3 py-1 rounded-full w-max shrink-0">
 Booked
 </div>
 </div>
 </div>
 <h3 className="text-lg font-semibold text-[var(--ink)] my-2">
 Fictional service-time test
 </h3>
 <div className="flex items-start gap-2 mb-4">
 <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
 <div className="text-[14px]">
 <span className="text-[var(--ink)] block">Virtual details pending</span>
 <span className="text-[var(--sage)]">QA Fixture Agency A (automated tests)</span>
 </div>
 </div>
 <div className="flex flex-wrap gap-2 mt-4">
 <span className="text-[12px] font-medium text-gray-600 border border-gray-200 px-3 py-1 rounded-full">Setting pending</span>
 <span className="text-[12px] font-medium text-gray-600 border border-gray-200 px-3 py-1 rounded-full">Virtual</span>
 </div>
 </Link>

 {/* Card 4 */}
 <Link href="/jobs/past-4" className="block bg-white rounded-2xl border border-gray-200 p-6 border border-gray-200 hover: transition-shadow">
 <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-2">
 <div className="text-[11px] font-bold tracking-wider text-[#A0522D] uppercase mt-1">
 TUE, SEP 22 · 10:53 AM – 12:53 PM PDT
 </div>
 <div className="flex gap-2">
 <div className="bg-[#E2EBE5] text-[#1B433C] text-[12px] font-medium px-3 py-1 rounded-full w-max shrink-0">
 Booked
 </div>
 </div>
 </div>
 <h3 className="text-lg font-semibold text-[var(--ink)] my-2">
 Fictional service-time test
 </h3>
 <div className="flex items-start gap-2 mb-4">
 <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
 <div className="text-[14px]">
 <span className="text-[var(--ink)] block">Virtual details pending</span>
 <span className="text-[var(--sage)]">QA Fixture Agency A (automated tests)</span>
 </div>
 </div>
 <div className="flex flex-wrap gap-2 mt-4">
 <span className="text-[12px] font-medium text-gray-600 border border-gray-200 px-3 py-1 rounded-full">Setting pending</span>
 <span className="text-[12px] font-medium text-gray-600 border border-gray-200 px-3 py-1 rounded-full">Virtual</span>
 </div>
 </Link>

 </div>
 )}

 {/* D. Assignments You No Longer Hold */}
 <h2 className="text-xl font-semibold text-[var(--ink)] mb-4">Assignments you no longer hold</h2>
 <div className="flex flex-col gap-4">
 
 {/* Card 1 */}
 <div className="bg-white rounded-2xl border border-gray-200 p-6 border border-gray-200 w-full">
 <h3 className="font-semibold text-[var(--ink)] mb-1">Fictional service-time test</h3>
 <p className="text-sm text-[var(--sage)] mb-3">Tue, Sep 22 · 10:53 AM – 12:53 PM PDT · QA Fixture Agency A (automated tests)</p>
 <p className="text-[14px] text-gray-800 mb-2">You gave this assignment back. Fictional give-back</p>
 <p className="text-xs text-gray-400">Released Wed, Sep 23 · 5:53 AM GMT+8. Job details and prep materials are no longer available to you.</p>
 </div>

 {/* Card 2 */}
 <div className="bg-white rounded-2xl border border-gray-200 p-6 border border-gray-200 w-full">
 <h3 className="font-semibold text-[var(--ink)] mb-1">Fictional release test</h3>
 <p className="text-sm text-[var(--sage)] mb-3">Sat, Jan 30 · 3:53 PM – 5:53 PM PST · QA Fixture Agency A (automated tests)</p>
 <p className="text-[14px] text-gray-800 mb-2">The agency cancelled this appointment.</p>
 <p className="text-xs text-gray-400">Released Wed, Sep 23 · 5:53 AM GMT+8. Job details and prep materials are no longer available to you.</p>
 </div>

 {/* Card 3 */}
 <div className="bg-white rounded-2xl border border-gray-200 p-6 border border-gray-200 w-full">
 <h3 className="font-semibold text-[var(--ink)] mb-1">Fictional release test</h3>
 <p className="text-sm text-[var(--sage)] mb-3">Sat, Jan 30 · 9:53 AM – 11:53 AM PST · QA Fixture Agency A (automated tests)</p>
 <p className="text-[14px] text-gray-800 mb-2">You gave this assignment back. Race A</p>
 <p className="text-xs text-gray-400">Released Wed, Sep 23 · 5:53 AM GMT+8. Job details and prep materials are no longer available to you.</p>
 </div>

 {/* Card 4 */}
 <div className="bg-white rounded-2xl border border-gray-200 p-6 border border-gray-200 w-full">
 <h3 className="font-semibold text-[var(--ink)] mb-1">Fictional release test</h3>
 <p className="text-sm text-[var(--sage)] mb-3">Sat, Jan 30 · 3:53 AM – 5:53 AM PST · QA Fixture Agency A (automated tests)</p>
 <p className="text-[14px] text-gray-800 mb-2">The agency removed you from this assignment.</p>
 <p className="text-xs text-gray-400">Released Wed, Sep 23 · 5:53 AM GMT+8. Job details and prep materials are no longer available to you.</p>
 </div>

 {/* Card 5 */}
 <div className="bg-white rounded-2xl border border-gray-200 p-6 border border-gray-200 w-full">
 <h3 className="font-semibold text-[var(--ink)] mb-1">Fictional release test</h3>
 <p className="text-sm text-[var(--sage)] mb-3">Fri, Jan 29 · 9:53 PM – 11:53 PM PST · QA Fixture Agency A (automated tests)</p>
 <p className="text-[14px] text-gray-800 mb-2">The agency cancelled this appointment.</p>
 <p className="text-xs text-gray-400">Released Wed, Sep 23 · 5:53 AM GMT+8. Job details and prep materials are no longer available to you.</p>
 </div>

 {/* Card 6 */}
 <div className="bg-white rounded-2xl border border-gray-200 p-6 border border-gray-200 w-full">
 <h3 className="font-semibold text-[var(--ink)] mb-1">Fictional release test</h3>
 <p className="text-sm text-[var(--sage)] mb-3">Fri, Jan 29 · 3:52 PM – 5:52 PM PST · QA Fixture Agency A (automated tests)</p>
 <p className="text-[14px] text-gray-800 mb-2">The agency removed you from this assignment. We will be in touch about other work.</p>
 <p className="text-xs text-gray-400">Released Wed, Sep 23 · 5:52 AM GMT+8. Job details and prep materials are no longer available to you.</p>
 </div>
 
 </div>
 </div>
 )}

 </motion.div>
 );
}
