"use client";
import React from "react";
import Link from "next/link";
import { useRequests } from "@/context/RequestsContext";

export default function DashboardPage() {
  const { requests } = useRequests();
  
  const totalAppointments = requests.length;
  const needingCoverage = requests.filter(r => r.status === "Unfilled / draft").length;
  const pendingOffersCount = requests.filter(r => r.status.includes("Awaiting")).length;
  const staffFollowUpCount = requests.filter(r => r.status === "Partially staffed").length;
  const needsReplacementCount = 0;

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
    <div className="mx-auto max-w-[1200px] space-y-10 pt-2">
      
      {/* Banners & Inputs */}
      <div className="space-y-6">
        <div className="rounded-full bg-[#E6EFEA] px-6 py-3.5 text-sm font-medium text-[#385B52]">
          Test workspace — fictional information only
        </div>
        
        <div className="space-y-1.5 w-full">
          <label className="pl-5 text-[13px] font-medium text-slate-500">Agency</label>
          <div className="rounded-full bg-[#F3F2EE] px-6 py-3.5 text-[15px] text-slate-600 border border-neutral-200/50">
            North Fictional Interpreting
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-0">
        <div className="space-y-2">
          <h1 className="text-[32px] font-semibold tracking-tight text-slate-900">Welcome, Avery</h1>
          <p className="text-[15px] text-slate-500">
            Your scheduling desk. Appointments and coverage saved across authorized accounts.
          </p>
        </div>
        <Link href="/requests/new" className="inline-block rounded-full bg-[#0B3B32] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0B3B32]/50">
          New request
        </Link>
      </div>

      {/* Dark Stats Card */}
      <div className="rounded-[24px] bg-[#0B3B32] p-8 text-white shadow-sm">
        <p className="mb-8 text-xs font-medium text-[#8BA49E]">
          Upcoming appointments and unresolved past appointments
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
          <Link href="/requests" className="flex flex-col gap-2 text-left hover:opacity-75 transition-opacity cursor-pointer">
            <span className="text-[11px] font-semibold tracking-widest text-[#8BA49E]">APPOINTMENTS</span>
            <span className="text-[28px] font-medium leading-none">{totalAppointments}</span>
          </Link>
          <Link href="/requests" className="flex flex-col gap-2 text-left hover:opacity-75 transition-opacity cursor-pointer">
            <span className="text-[11px] font-semibold tracking-widest text-[#8BA49E]">NEEDING COVERAGE</span>
            <span className="text-[28px] font-medium leading-none">{needingCoverage}</span>
          </Link>
          <Link href="/requests" className="flex flex-col gap-2 text-left hover:opacity-75 transition-opacity cursor-pointer">
            <span className="text-[11px] font-semibold tracking-widest text-[#8BA49E]">PENDING OFFERS</span>
            <span className="text-[28px] font-medium leading-none">{pendingOffersCount}</span>
          </Link>
          <Link href="/requests" className="flex flex-col gap-2 text-left hover:opacity-75 transition-opacity cursor-pointer">
            <span className="text-[11px] font-semibold tracking-widest text-[#8BA49E]">STAFF FOLLOW-UP</span>
            <span className="text-[28px] font-medium leading-none">{staffFollowUpCount}</span>
          </Link>
          
          <Link href="/requests" className="flex flex-col gap-2 text-left hover:opacity-75 transition-opacity cursor-pointer">
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
            <h2 className="text-lg font-semibold text-slate-900 px-2">Needs attention</h2>
            
            <div className="space-y-2.5">
              {requests.map(request => (
                <div key={request.id} className="flex items-center justify-between rounded-[2rem] bg-[#EFECE5] px-6 py-3.5">
                  <div className="flex items-start gap-3">
                    <div className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${request.status.includes("Awaiting") ? "bg-[#AF4A3F]" : "bg-[#B59A6D]"}`}></div>
                    <div className="flex flex-col">
                      <p className="text-[15px] font-medium text-slate-800">{request.status} — {request.title}</p>
                      <p className="mt-0.5 text-[13px] text-slate-500">{request.dateString}</p>
                    </div>
                  </div>
                  <Link href={`/requests/${request.id}`} className="ml-4 shrink-0 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                    {request.status.includes("Awaiting") ? "View" : "Manage slots"}
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming bookings */}
          <section className="space-y-5">
            <div className="rounded-[24px] bg-white p-8 shadow-sm border border-neutral-100/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[17px] font-semibold text-slate-900">Upcoming bookings</h2>
                <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Open calendar →</button>
              </div>

              <div className="space-y-6">
                {/* Booking 1 */}
                <div className="flex items-start justify-between border-b border-neutral-100 pb-6">
                  <div className="space-y-1">
                    <p className="text-[15px] font-medium text-slate-900">Fictional community class</p>
                    <p className="text-[13px] text-slate-500">Tue, Nov 10 · 9:02 AM – 11:02 AM PST</p>
                    <p className="text-[13px] text-slate-500">Virtual details pending</p>
                  </div>
                  <span className="rounded-full bg-[#E6EFEA] px-3 py-1 text-xs font-medium text-[#385B52]">
                    Fully staffed
                  </span>
                </div>

                {/* Booking 2 */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-[15px] font-medium text-slate-900">Live check hii25</p>
                    <p className="text-[13px] text-slate-500">Wed, Nov 24 · 5:12 AM – 6:12 AM PST</p>
                    <p className="text-[13px] text-slate-500">Fictional room L</p>
                  </div>
                  <span className="rounded-full bg-[#E8F3EE] px-3 py-1 text-xs font-medium text-[#466960]">
                    Partially staffed
                  </span>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column (col-span-1) */}
        <div className="lg:col-span-1">
          <div className="rounded-[24px] bg-white p-8 shadow-sm border border-neutral-100/50 h-full max-h-[400px]">
            <h2 className="mb-4 text-[17px] font-semibold text-slate-900">Unavailable in this test workspace</h2>
            <p className="text-[15px] leading-relaxed text-slate-500">
              Billing, payments and integrations are unavailable. Notifications appear inside the app, and you can turn on optional email notices in Settings. Nothing is texted or pushed to your device.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
