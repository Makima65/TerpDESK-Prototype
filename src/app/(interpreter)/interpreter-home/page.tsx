"use client";

import React from "react";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { useInterpreterJobs } from "@/context/InterpreterJobsContext";
import { motion } from "framer-motion";

export default function InterpreterHomePage() {
  const { jobs } = useInterpreterJobs();
  const [offers, setOffers] = React.useState<any[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const item = window.localStorage.getItem('terpdesk_offers');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      return [];
    }
  });

  React.useEffect(() => {
    const loadOffers = () => {
      const data = JSON.parse(localStorage.getItem('terpdesk_offers') || '[]');
      setOffers(data);
    };
    loadOffers();
    window.addEventListener('storage', loadOffers);
    return () => window.removeEventListener('storage', loadOffers);
  }, []);

  const handleAcceptOffer = (offer: any) => {
    const updatedOffers = offers.map(o => o.id === offer.id ? { ...o, status: 'accepted' } : o);
    setOffers(updatedOffers);
    localStorage.setItem('terpdesk_offers', JSON.stringify(updatedOffers));
    
    const acceptedAppointments = JSON.parse(localStorage.getItem('terpdesk_accepted_appointments') || '[]');
    acceptedAppointments.push({
      id: offer.id,
      title: offer.title,
      startsAt: offer.startsAt,
      endsAt: offer.endsAt,
      agencyName: offer.agencyName
    });
    localStorage.setItem('terpdesk_accepted_appointments', JSON.stringify(acceptedAppointments));
  };

 const visibleAppointments = jobs.filter((job) => job.status !== "declined" && job.status !== "released").length;
 const upcomingBookings = jobs.filter((job) => job.status === "booked").length;
 const currentInterpreterId = 'terp-1'; // Mocked current interpreter id
  const pendingOffersList = offers.filter(o => o.status === 'pending' && (!o.interpreterId || o.interpreterId === currentInterpreterId));
  const pendingOffers = pendingOffersList.length;
 const hoursToSubmit = jobs.filter((job) => job.status === "booked" && job.serviceRecordState === "not_started").length;

 return (
 <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-[1200px] mx-auto p-4 md:p-8 w-full space-y-8 pb-24 antialiased">
 {/* Banner */}
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
 <div>
 <h1 className="text-4xl font-semibold tracking-tight text-[var(--ink)] mb-2">
 Welcome, Dale
 </h1>
 <p className="text-[var(--sage)] text-lg">
 Your interpreting work, across your agencies.
 </p>
 </div>
 <Link
 href="/interpreter-calendar"
 className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors w-full md:w-auto "
 >
 <Calendar className="w-4 h-4" />
 My calendar
 </Link>
 </div>

 {/* Stats Card */}
 <div className="bg-[#1B433C] rounded-2xl border border-gray-200 p-6 text-white mt-8">
 <h2 className="text-[12px] font-medium text-[#8BA49E] mb-6">
 Current connected work
 </h2>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
 <div className="flex flex-col">
 <span className="text-[10px] font-semibold tracking-wider text-[#8BA49E] mb-2 uppercase">
 Visible appointments
 </span>
 <span className="text-[28px] font-medium tracking-tight text-white leading-none">
 {visibleAppointments}
 </span>
 </div>

 <div className="flex flex-col border-l border-white/10 pl-4 md:border-l md:border-white/10 md:pl-4">
 <span className="text-[10px] font-semibold tracking-wider text-[#8BA49E] mb-2 uppercase">
 Upcoming bookings
 </span>
 <span className="text-[28px] font-medium tracking-tight text-white leading-none">
 {upcomingBookings}
 </span>
 </div>

 <div className="flex flex-col md:border-l border-white/10 md:pl-4 pt-4 md:pt-0">
 <span className="text-[10px] font-semibold tracking-wider text-[#8BA49E] mb-2 uppercase">
 Pending offers
 </span>
 <span className="text-[28px] font-medium tracking-tight text-white leading-none">
 {pendingOffers}
 </span>
 </div>

 <div className="flex flex-col border-l border-white/10 pl-4 md:border-l md:border-white/10 md:pl-4 pt-4 md:pt-0">
 <span className="text-[10px] font-semibold tracking-wider text-[#8BA49E] mb-2 uppercase">
 Connected agencies
 </span>
 <span className="text-[28px] font-medium tracking-tight text-white leading-none">
 1
 </span>
 </div>

 <div className="flex flex-col border-l border-white/10 pl-4 -ml-4 mt-2 md:mt-0 pt-4 md:pt-0">
 <span className="text-[10px] font-semibold tracking-wider text-[#8BA49E] mb-2 uppercase">
 Hours to submit
 </span>
 <span className="text-[28px] font-medium tracking-tight text-white leading-none">
 {hoursToSubmit}
 </span>
 </div>
 </div>
 </div>

 {/* Grid Layout below stats */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
 {/* Left Column (2/3) */}
 <div className="lg:col-span-2 space-y-6">
 
 {/* Your Offers */}
 <div className="bg-white rounded-2xl border border-gray-200 p-6 border border-gray-200">
 <h2 className="text-lg font-medium text-[var(--ink)] mb-6">Your offers</h2>

 {pendingOffers === 0 ? (
 <p className="text-[14px] text-[var(--sage)]">
 Nothing needs your attention right now.
 </p>
 ) : (
 <div className="space-y-4">
 {pendingOffersList.map((job) => (
  <div
    key={job.id}
    className="bg-[var(--canvas)] rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-gray-200/50"
  >
    <div className="flex items-start gap-3">
    <div className="w-2 h-2 rounded-full bg-[#9B1C1C] mt-2 shrink-0" />
    <div>
    <h3 className="text-[15px] font-medium text-[var(--ink)] mb-1">
    Offer received — {job.title}
    </h3>
    <p className="text-[13px] text-[var(--sage)]">
    Expires {new Date(job.endsAt || new Date()).toLocaleDateString()} · Pending offers do not reserve time.
    </p>
    </div>
    </div>
    <div className="flex gap-2 shrink-0 md:w-auto w-full">
      <Link
        href={`/jobs/${job.id}`}
        className="text-[13px] font-medium text-gray-700 hover:text-[var(--ink)] bg-white border border-gray-200 rounded-full px-4 py-2 text-center transition-colors flex-1 md:flex-none"
      >
        Review
      </Link>
      <button
        onClick={() => handleAcceptOffer(job)}
        className="text-[13px] font-medium text-white bg-[var(--forest)] hover:bg-[#145347] rounded-full px-4 py-2 text-center transition-colors flex-1 md:flex-none cursor-pointer"
      >
        Accept
      </button>
    </div>
  </div>
  ))}
 </div>
 )}
 </div>

 {/* Upcoming Bookings */}
 <div>
 <div className="flex items-center justify-between mb-4 px-2">
 <h2 className="text-lg font-medium text-[var(--ink)]">Upcoming bookings</h2>
 <Link
 href="/interpreter-calendar"
 className="text-[13px] font-medium text-gray-600 hover:text-[var(--ink)] hover:underline shrink-0"
 >
 Open calendar &rarr;
 </Link>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {jobs
 .filter((job) => job.status === "booked")
 .map((job) => {
 const locationParts = job.location.split("·");
 const locPrimary = locationParts[0]?.trim();
 const locSecondary = locationParts[1]?.trim();

 return (
 <Link
 key={job.id}
 href={`/jobs/${job.id}`}
 className="block bg-white rounded-2xl border border-gray-200 p-6 border border-gray-200 hover: transition-shadow"
 >
 <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-2">
 <div className="text-[11px] font-bold tracking-wider text-[#A0522D] uppercase mt-1">
 {job.dateString}
 </div>
 <div className="flex gap-2">
 <div className="bg-[#E2EBE5] text-[#1B433C] text-[12px] font-medium px-3 py-1 rounded-full w-max shrink-0">
 Booked
 </div>
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
 
 {job.hasAutoFill && (
 <p className="text-[13px] text-[var(--sage)] mb-4">
 Booked by {locSecondary?.split('(')[0]?.trim()} using your Auto Fill permission.
 </p>
 )}

 <div className="flex flex-wrap gap-2 mt-4">
 <span className="text-[12px] font-medium text-gray-600 border border-gray-200 px-3 py-1 rounded-full">
 Setting pending
 </span>
 {job.isVirtual && (
 <span className="text-[12px] font-medium text-gray-600 border border-gray-200 px-3 py-1 rounded-full">
 Virtual
 </span>
 )}
 </div>
 </Link>
 );
 })}
 </div>
 </div>

 {/* Unavailable card */}
 <div className="bg-white rounded-2xl border border-gray-200 p-6 border border-gray-200 md:w-2/3 mt-6">
 <h2 className="text-lg font-medium text-[var(--ink)] mb-4">
 Unavailable in this test workspace
 </h2>
 <p className="text-[14px] text-[var(--sage)] leading-relaxed">
 Billing, payments and integrations are unavailable. Notifications
 appear inside the app, and you can turn on optional email notices
 in Settings. Nothing is texted or pushed to your device.
 </p>
 </div>
 </div>

 {/* Right Column (1/3) */}
 <div className="lg:col-span-1">
 {/* Recent Activity */}
 <div className="bg-white rounded-2xl border border-gray-200 p-6 border border-gray-200 min-h-[250px]">
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-lg font-medium text-[var(--ink)]">Recent activity</h2>
 <Link
 href="#"
 className="text-[13px] font-medium text-gray-600 hover:text-[var(--ink)] hover:underline"
 >
 All notifications &rarr;
 </Link>
 </div>
 <p className="text-[14px] text-[var(--sage)] leading-relaxed">
 Auto Fill bookings and newly shared prep materials will appear here.
 </p>
 </div>
 </div>
 </div>
 </motion.div>
 );
}
