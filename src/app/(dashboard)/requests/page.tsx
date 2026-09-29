"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRequests } from "@/context/RequestsContext";
import { RefreshCw, Building2, MapPin, Users2, ChevronDown } from "lucide-react";

function CustomSelect({ options, value, onChange }: { options: string[], value: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      <div 
        className={`flex items-center justify-between rounded-full bg-[#F3F2EE] px-6 py-3.5 cursor-pointer border transition-colors ${isOpen ? 'border-[#0B3B32] ring-1 ring-[#0B3B32]' : 'border-neutral-200/50'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[14px] text-slate-700 truncate">{value}</span>
        <ChevronDown className={`h-4 w-4 text-slate-500 shrink-0 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute left-0 mt-1 w-full z-50 bg-[#F9F8F4] rounded-2xl border border-neutral-200/50 shadow-lg py-2 overflow-hidden">
          {options.map((option, idx) => (
            <div 
              key={idx}
              className={`px-4 py-2 text-[14px] cursor-pointer transition-colors ${value === option ? 'bg-blue-50/50 text-blue-800 font-medium' : 'text-gray-800 hover:bg-blue-600 hover:text-white'}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper to render the colored badges based on string
function StatusBadge({ status }: { status: string }) {
  if (status === "Offer awaiting response" || status === "Awaiting response") {
    return (
      <span className="rounded-full bg-[#EAE8F4] px-3 py-1 text-[11px] font-semibold text-[#544B84]">
        Offer awaiting response
      </span>
    );
  }
  if (status === "Unfilled / draft") {
    return (
      <span className="rounded-full bg-[#F4EBE0] px-3 py-1 text-[11px] font-semibold text-[#8B6A3E]">
        Unfilled / draft
      </span>
    );
  }
  if (status === "Cancelled") {
    return (
      <span className="rounded-full bg-[#FEF2F2] px-3 py-1 text-[11px] font-semibold text-[#991B1B] border border-[#FCA5A5]/30">
        Cancelled
      </span>
    );
  }
  return (
    <span className="rounded-full bg-[#E9E4D6] px-3 py-1 text-[11px] font-semibold text-[#665D46]">
      {status}
    </span>
  );
}

export default function RequestsPage() {
  const { requests } = useRequests();
  const [searchQuery, setSearchQuery] = useState("");
  const [orgFilter, setOrgFilter] = useState("All organizations");
  const [formatFilter, setFormatFilter] = useState("All formats");
  const [statusFilter, setStatusFilter] = useState("Appointments");

  const filteredRequests = requests.filter(req => {
    const searchLower = searchQuery.toLowerCase();
    const titleMatch = req.title.toLowerCase().includes(searchLower);
    const refMatch = req.id.toLowerCase().includes(searchLower);
    const orgMatch = req.requester?.org?.toLowerCase().includes(searchLower) || false;
    
    if (searchQuery && !titleMatch && !refMatch && !orgMatch) return false;
    
    if (orgFilter !== "All organizations") {
      const org = req.requester?.org || "Organization not provided";
      if (org !== orgFilter && !(orgFilter === "Fictional clinic" && org === "Freshflow")) return false;
    }
    
    if (formatFilter !== "All formats") {
      const format = req.details?.format || "Virtual";
      if (format !== formatFilter && !(formatFilter === "In Person" && format === "In person")) return false;
    }
    
    if (statusFilter !== "Appointments") {
      if (statusFilter === "Cancelled" && req.status !== "Cancelled") return false;
      if (statusFilter === "Pending offers" && req.status !== "Awaiting response" && req.status !== "Offer awaiting response") return false;
      if (statusFilter === "Needing coverage" && req.status !== "Unfilled / draft") return false;
    }
    
    return true;
  });

  const upcomingRequests = filteredRequests.filter((r) => r.timestamp >= Date.now() || !r.actionRequired);
  const pastRequests = filteredRequests.filter((r) => r.timestamp < Date.now() && r.actionRequired);

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 pt-2">
      {/* Test Workspace Banner */}
      <div className="rounded-full bg-[#E6EFEA] px-6 py-3.5 text-sm font-medium text-[#385B52] mb-10">
        Test workspace — fictional information only
      </div>

      {/* Header Row */}
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <h1 className="text-[32px] font-semibold tracking-tight text-slate-900">
            Requests & assignments
          </h1>
          <p className="text-[15px] text-slate-500">
            Upcoming appointments and unresolved past appointments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-slate-600 hover:bg-neutral-50 shadow-sm transition-colors">
            <RefreshCw className="h-[18px] w-[18px]" />
          </button>
          <button className="h-11 rounded-full bg-[#0B3B32] px-6 text-[14px] font-medium text-white transition-opacity hover:opacity-90 shadow-sm">
            New request
          </button>
        </div>
      </div>

      <p className="text-[15px] text-slate-500 pt-3 pb-2">
        Back-to-back appointments are allowed. Travel time is not checked.
      </p>

      {/* Filter Pill */}
      <div className="rounded-full bg-[#F3F2EE] px-6 py-3.5 text-[15px] text-slate-600 mb-2 w-full">
        Active filter: <span className="font-semibold text-slate-900">{statusFilter}</span>
      </div>

      {/* Agency Input */}
      <div className="space-y-1.5 w-full pb-2">
        <label className="pl-5 text-[13px] font-medium text-slate-500">Agency</label>
        <div className="rounded-full bg-[#F3F2EE] px-6 py-3.5 text-[15px] text-slate-600 border border-neutral-200/50">
          North Fictional Interpreting
        </div>
      </div>

      {/* Search / Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pb-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search title, organization, reference..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full bg-[#F3F2EE] px-6 py-3.5 text-[14px] text-slate-700 placeholder:text-slate-500 border border-neutral-200/50 outline-none focus:ring-2 focus:ring-[#0B3B32]/30"
          />
        </div>
        <CustomSelect options={["All organizations", "Fictional clinic"]} value={orgFilter} onChange={setOrgFilter} />
        <CustomSelect options={["All formats", "In Person", "Virtual", "Hybrid - In person and Virtual"]} value={formatFilter} onChange={setFormatFilter} />
        <CustomSelect options={["Appointments", "Needing coverage", "Needs replacement", "Pending offers", "Fully staffed", "Staff follow-up", "Cancelled"]} value={statusFilter} onChange={setStatusFilter} />
      </div>

      <p className="text-[13px] text-slate-500 font-medium pl-2 pb-2">{filteredRequests.length} appointments</p>

      {/* UPCOMING SECTION */}
      <div className="space-y-5 pb-8">
        <h2 className="text-[19px] font-semibold text-slate-900 pl-1">Upcoming</h2>
        <div className="space-y-4">
          {upcomingRequests.map((req) => {
            const org = req.requester?.org || "Organization not provided";
            const format = req.details?.format || req.setting || "Virtual";
            const location = req.onsite?.venue || "Fictional Meet";
            const isCancelled = req.status === "Cancelled";
            const staffingText = isCancelled ? "0 of 0 staffed" : "0 of 1 staffed";

            return (
            <Link
              href={`/requests/${req.id}`}
              key={req.id}
              className="block rounded-[24px] bg-white p-7 shadow-sm border border-[#EBE8DF] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-[17px] font-semibold text-slate-900">{req.title}</h3>
                  <p className="text-[14px] text-slate-500">{req.dateString}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={req.status} />
                </div>
              </div>

              <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between">
                {/* Col 1 */}
                <div className="flex items-start gap-3 w-full md:w-1/3">
                  <Building2 className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[13px] text-slate-500">{org}</span>
                    <span className="text-[13px] text-slate-400">{req.setting}</span>
                  </div>
                </div>
                {/* Col 2 */}
                <div className="flex items-start gap-3 w-full md:w-1/3">
                  <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[13px] text-slate-500">
                      {format} · {location}
                    </span>
                    <span className="text-[13px] text-slate-400">{req.id}</span>
                  </div>
                </div>
                {/* Col 3 */}
                <div className="flex items-start gap-3 w-full md:w-1/3">
                  <Users2 className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[13px] text-slate-500">{staffingText}</span>
                  </div>
                </div>
              </div>
            </Link>
          )})}
        </div>
      </div>

      {/* PAST SECTION */}
      <div className="space-y-5 pb-12">
        <div className="space-y-1 pl-1">
          <h2 className="text-[19px] font-semibold text-slate-900">Past — unresolved</h2>
          <p className="text-[14px] text-slate-500">
            These appointments still need coverage, an offer response, or access follow-up.
          </p>
        </div>
        
        <div className="space-y-4">
          {pastRequests.map((req) => {
            const org = req.requester?.org || "Organization not provided";
            const format = req.details?.format || req.setting || "Virtual";
            const location = req.onsite?.venue || "Fictional Meet";
            const isCancelled = req.status === "Cancelled";
            const staffingText = isCancelled ? "0 of 0 staffed" : "0 of 1 staffed";

            return (
            <Link
              href={`/requests/${req.id}`}
              key={req.id}
              className="block rounded-[24px] bg-white p-7 shadow-sm border border-[#EBE8DF] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-[17px] font-semibold text-slate-900">{req.title}</h3>
                  <p className="text-[14px] text-slate-500">{req.dateString}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={req.status} />
                </div>
              </div>

              <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between">
                {/* Col 1 */}
                <div className="flex items-start gap-3 w-full md:w-1/3">
                  <Building2 className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[13px] text-slate-500">{org}</span>
                    <span className="text-[13px] text-slate-400">{req.setting}</span>
                  </div>
                </div>
                {/* Col 2 */}
                <div className="flex items-start gap-3 w-full md:w-1/3">
                  <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[13px] text-slate-500">
                      {format} · {location}
                    </span>
                    <span className="text-[13px] text-slate-400">{req.id}</span>
                  </div>
                </div>
                {/* Col 3 */}
                <div className="flex items-start gap-3 w-full md:w-1/3">
                  <Users2 className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[13px] text-slate-500">{staffingText}</span>
                  </div>
                </div>
              </div>
            </Link>
          )})}
        </div>
      </div>
    </div>
  );
}
