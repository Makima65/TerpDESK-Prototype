"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { useInterpreterJobs } from "@/context/InterpreterJobsContext";

const formatJobDate = (startStr?: string, endStr?: string) => {
  if (!startStr) return "Date TBD";
  const start = new Date(startStr);
  const end = endStr ? new Date(endStr) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const dateStr = start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
  const timeStart = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const timeEnd = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
  return `${dateStr} · ${timeStart} – ${timeEnd}`;
};

function ServiceTimeBlock({ job }: { job: any }) {
  const [serviceRecord, setServiceRecord] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [actualStart, setActualStart] = useState("");
  const [actualEnd, setActualEnd] = useState("");
  const [breakMinutes, setBreakMinutes] = useState("0");
  
  type MileageLeg = { id: number, from: string, to: string, distance: number | string, type: 'total' | 'round_trip' };
  const [mileageLegs, setMileageLegs] = useState<MileageLeg[]>([]);
  const [mileageNote, setMileageNote] = useState("");
  const [note, setNote] = useState("");

  const [timeChecked, setTimeChecked] = useState(false);
  const [mileageChecked, setMileageChecked] = useState(false);
  const [signatureChecked, setSignatureChecked] = useState(false);

  useEffect(() => {
    const loadRecord = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('terpdesk_service_records');
        if (stored) {
          const records = JSON.parse(stored);
          const record = records.find((r: any) => r.appointmentId === job.id);
          if (record) {
            setServiceRecord(record);
          }
        }
      }
    };
    loadRecord();
    window.addEventListener('storage', loadRecord);
    return () => window.removeEventListener('storage', loadRecord);
  }, [job.id]);

  if (job.status !== 'booked') return null;

  const isPastEndTime = job.endsAt ? new Date() > new Date(job.endsAt) : false;

  const totalMileage = mileageLegs.reduce((acc, leg) => {
    const dist = parseFloat(leg.distance as string) || 0;
    const multiplier = leg.type === 'round_trip' ? 2 : 1;
    return acc + (dist * multiplier);
  }, 0);

  const handleSubmit = () => {
    const newRecord = {
      id: Math.random().toString(36).substring(7),
      appointmentId: job.id,
      interpreterName: "Jamie Fictional", // mock
      state: 'submitted',
      scheduledStart: job.startsAt,
      scheduledEnd: job.endsAt,
      actualStart: actualStart || job.startsAt,
      actualEnd: actualEnd || job.endsAt,
      breakMinutes: parseInt(breakMinutes) || 0,
      reportedMileage: totalMileage,
      mileageNote: mileageNote, // Included per requirements
      approvedMileage: null,
      reviewMessage: null,
      version: 1
    };

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('terpdesk_service_records');
      const records = stored ? JSON.parse(stored) : [];
      records.push(newRecord);
      localStorage.setItem('terpdesk_service_records', JSON.stringify(records));
      
      window.dispatchEvent(new Event('storage'));
      
      setServiceRecord(newRecord);
      setIsFormOpen(false);
    }
  };

  let serviceTimeHours = "-";
  if (actualStart && actualEnd) {
    const start = new Date(actualStart).getTime();
    const end = new Date(actualEnd).getTime();
    if (!isNaN(start) && !isNaN(end)) {
      const diffMs = end - start;
      const mins = Math.max(0, (diffMs / 60000) - (parseInt(breakMinutes) || 0));
      serviceTimeHours = (mins / 60).toFixed(1) + " hr";
    }
  }

  const addMileageLeg = () => {
    setMileageLegs([...mileageLegs, { id: Date.now(), from: '', to: '', distance: '', type: 'total' }]);
  };

  const removeMileageLeg = (id: number) => {
    setMileageLegs(mileageLegs.filter(leg => leg.id !== id));
  };

  const updateMileageLeg = (id: number, field: keyof MileageLeg, value: any) => {
    setMileageLegs(mileageLegs.map(leg => leg.id === id ? { ...leg, [field]: value } : leg));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 border border-gray-200 p-6 ">
      <h2 className="text-lg font-semibold text-[var(--ink)] mb-4">Actual service time</h2>
      <p className="text-[14px] text-[var(--sage)] mb-6">Separate from the scheduled booking above. Submitting or approving hours never changes the booking, the calendar or anyone's reservation, and it does not calculate pay.</p>

      {serviceRecord?.state === 'submitted' ? (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-medium text-[var(--ink)]">Your reported hours</h3>
             <span className="px-3 py-1 text-[12px] font-medium rounded-full bg-purple-100 text-purple-700">Awaiting review</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-6">
            <div className="space-y-4">
              <div>
                <div className="text-[var(--sage)] mb-1">Scheduled booking</div>
                <div className="text-[var(--ink)]">{job.startsAt ? formatJobDate(job.startsAt, job.endsAt) : job.dateString}</div>
              </div>
              <div>
                <div className="text-[var(--sage)] mb-1">Unpaid break</div>
                <div className="text-[var(--ink)]">{serviceRecord.breakMinutes === 0 ? 'None' : `${serviceRecord.breakMinutes} min`}</div>
              </div>
              <div>
                <div className="text-[var(--sage)] mb-1">Mileage reported</div>
                <div className="text-[var(--ink)]">{serviceRecord.reportedMileage.toFixed(1)} mi</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-[var(--sage)] mb-1">Reported actual time</div>
                <div className="text-[var(--ink)]">{formatJobDate(serviceRecord.actualStart, serviceRecord.actualEnd)}</div>
              </div>
              <div>
                <div className="text-[var(--sage)] mb-1">Service time</div>
                <div className="text-[var(--ink)]">3 hr</div>
              </div>
              <div>
                <div className="text-[var(--sage)] mb-1">Mileage approved by the agency</div>
                <div className="text-[var(--ink)]">Not approved yet</div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <button className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
               <ChevronRight className="w-4 h-4" /> Version history (1)
            </button>
          </div>
          
          <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-4 py-1.5 text-sm font-medium transition-colors">
            Submit a correction
          </button>
        </div>
      ) : isFormOpen ? (
        <div className="mb-4 relative">
          <button onClick={() => setIsFormOpen(false)} className="bg-[#1B433C] text-white rounded-full px-5 py-2 text-sm font-medium mb-6 transition-colors hover:bg-[#14332D]">Close</button>
          
          <div className="bg-[#F5F4F0] p-6 rounded-xl">
             <p className="text-sm text-gray-600 mb-6">The scheduled times are filled in as a starting point. Nothing is recorded until you submit, and they are not treated as confirmed until you do. Changing these times does not move the booking in anyone's calendar.</p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[13px] text-gray-600 mb-2">Actual start</label>
                  <input type="datetime-local" value={actualStart} onChange={e => setActualStart(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B32]" />
                  <p className="text-[11px] text-gray-500 mt-1">9:21 AM PDT - Pacific Time — Seattle, Los Angeles (UTC-07:00)</p>
                </div>
                <div>
                  <label className="block text-[13px] text-gray-600 mb-2">Actual end</label>
                  <input type="datetime-local" value={actualEnd} onChange={e => setActualEnd(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B32]" />
                  <p className="text-[11px] text-gray-500 mt-1">12:21 PM PDT - Pacific Time — Seattle, Los Angeles (UTC-07:00)</p>
                </div>
             </div>
             
             <div className="mb-6">
                <label className="block text-[13px] text-gray-600 mb-2">Unpaid break, in minutes (leave at 0 if none)</label>
                <input type="number" value={breakMinutes} onChange={e => setBreakMinutes(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B32]" />
             </div>
             
             <div className="mb-6">
                <p className="text-sm font-medium text-gray-800 mb-2">Service time before review: <span className="font-bold">{serviceTimeHours}</span></p>
             </div>
             
             <div className="bg-white p-5 rounded-xl border border-gray-200 mb-6">
                <h4 className="text-sm font-medium text-[var(--ink)] mb-2">Mileage for this assignment</h4>
                <p className="text-xs text-[var(--sage)] mb-6">Enter either the one-way distance and add a return on the same route, or enter the total distance already travelled without adding a return. This records miles only — no reimbursement is calculated here, and not every assignment pays mileage.</p>
                
                {mileageLegs.map(leg => {
                  const dist = parseFloat(leg.distance as string) || 0;
                  const legTotal = leg.type === 'round_trip' ? dist * 2 : dist;
                  return (
                    <div key={leg.id} className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                        <input type="text" placeholder="From" value={leg.from} onChange={e => updateMileageLeg(leg.id, 'from', e.target.value)} className="w-full md:w-auto md:flex-1 min-w-0 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B32]" />
                        <input type="text" placeholder="To" value={leg.to} onChange={e => updateMileageLeg(leg.id, 'to', e.target.value)} className="w-full md:w-auto md:flex-1 min-w-0 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B32]" />
                        <input type="number" placeholder="Distance" value={leg.distance} onChange={e => updateMileageLeg(leg.id, 'distance', e.target.value)} className="w-full md:w-24 md:flex-none min-w-0 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B32]" />
                        <select value={leg.type} onChange={e => updateMileageLeg(leg.id, 'type', e.target.value)} className="w-full md:w-auto md:flex-[1.5] min-w-0 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B32] truncate text-ellipsis">
                          <option value="total">Total distance already travelled</option>
                          <option value="round_trip">One-way distance + return on same route</option>
                        </select>
                        <button onClick={() => removeMileageLeg(leg.id)} className="text-sm font-medium text-gray-500 hover:text-red-600 self-end md:self-auto shrink-0 transition-colors px-1">Remove</button>
                      </div>
                      <p className="text-xs text-gray-600">Calculated total for this leg: <span className="font-semibold">{legTotal.toFixed(1)} mi</span> {legTotal === 0 ? '— no distance added' : ''}</p>
                    </div>
                  );
                })}
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                   <button onClick={addMileageLeg} className="bg-white border border-gray-300 text-gray-700 rounded-full px-4 py-1.5 text-xs font-medium hover:bg-gray-50 transition-colors">Add a travel leg</button>
                   <span className="text-sm text-gray-700">Calculated total mileage: <span className="font-bold">{totalMileage.toFixed(1)} mi</span></span>
                </div>

                <div className="mb-4">
                  <label className="block text-[13px] text-gray-600 mb-2">Mileage note (optional)</label>
                  <textarea rows={2} value={mileageNote} onChange={e => setMileageNote(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B32]"></textarea>
                </div>

                <p className="text-xs text-[var(--sage)]">Automatic driving distance is not switched on. No mapping service is connected to this workspace yet, so nothing can be calculated from an address today.</p>
             </div>
             
             <div className="mb-6">
                <label className="block text-[13px] text-gray-600 mb-2">Service note (optional)</label>
                <textarea rows={3} value={note} onChange={e => setNote(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B32]"></textarea>
                <p className="text-xs text-[var(--sage)] mt-2">Keep this about timing only — start, end, breaks and waiting. Do not enter participant names, health details or anything said during the assignment.</p>
             </div>
             
             <div className="bg-white p-5 rounded-xl border border-gray-200 mb-6">
                <h4 className="text-sm font-medium text-[var(--ink)] mb-3">Before you submit</h4>
                <div className="space-y-2">
                   <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={timeChecked} onChange={e => setTimeChecked(e.target.checked)} className="rounded text-[var(--forest)] w-4 h-4 focus:ring-[#0B3B32]" />
                      <span className="text-sm text-gray-700">Actual service time — {serviceTimeHours}</span>
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={mileageChecked} onChange={e => setMileageChecked(e.target.checked)} className="rounded text-[var(--forest)] w-4 h-4 focus:ring-[#0B3B32]" />
                      <span className="text-sm text-gray-700">Mileage — {totalMileage.toFixed(1)} mi reported (leave this empty if there was no travel to report)</span>
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={signatureChecked} onChange={e => setSignatureChecked(e.target.checked)} className="rounded text-[var(--forest)] w-4 h-4 focus:ring-[#0B3B32]" />
                      <span className="text-sm text-gray-700">No verification signature is asked for on this assignment</span>
                   </label>
                </div>
             </div>
             
             <div className="flex gap-3">
                <button onClick={handleSubmit} disabled={!timeChecked || !mileageChecked || !signatureChecked} className="bg-[#1B433C] text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-[#14332D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Submit actual hours</button>
                <button className="bg-white border border-gray-300 text-gray-700 rounded-full px-5 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">Save draft</button>
             </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start mb-6">
             <div className="flex-1">
               <h3 className="font-medium text-[var(--ink)] mb-4">Your reported hours</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm mb-6">
                 <div className="space-y-4">
                   <div>
                     <div className="text-[var(--sage)] mb-1">Scheduled booking</div>
                     <div className="text-[var(--ink)]">{job.dateString}</div>
                   </div>
                   <div>
                     <div className="text-[var(--sage)] mb-1">Unpaid break</div>
                     <div className="text-[var(--ink)]">None</div>
                   </div>
                   <div>
                     <div className="text-[var(--sage)] mb-1">Mileage reported</div>
                     <div className="text-[var(--ink)]">0.0 mi</div>
                   </div>
                 </div>
                 
                 <div className="space-y-4">
                   <div>
                     <div className="text-[var(--sage)] mb-1">Reported actual time</div>
                     <div className="text-[var(--ink)]">Not reported yet</div>
                   </div>
                   <div>
                     <div className="text-[var(--sage)] mb-1">Service time</div>
                     <div className="text-[var(--ink)]">—</div>
                   </div>
                   <div>
                     <div className="text-[var(--sage)] mb-1">Mileage approved by the agency</div>
                     <div className="text-[var(--ink)]">Not approved yet</div>
                   </div>
                 </div>
               </div>
             </div>
             <span className="bg-[#F5F4F0] text-gray-600 px-3 py-1 rounded-full text-[12px] font-medium shrink-0 ml-4">Not submitted</span>
          </div>
          
          {isPastEndTime ? (
            <button onClick={() => setIsFormOpen(true)} className="bg-[#1B433C] text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-[#14332D] transition-colors">Submit actual hours</button>
          ) : (
            <p className="text-sm text-gray-500 font-medium">Not submitted (Awaiting end of assignment)</p>
          )}
        </div>
      )}
    </div>
  );
}


export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { jobs, acceptJobOffer, declineOffer, releaseJob } = useInterpreterJobs();
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
              {job.startsAt ? formatJobDate(job.startsAt, job.endsAt) : job.dateString}
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

          {/* Actual Service Time Component */}
          <ServiceTimeBlock job={job} />

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
                  Booking: Reserved
                </span>
              )}
              <span className="bg-white border border-gray-200 text-gray-600 text-[12px] font-medium px-3 py-1 rounded-full ">
                Access: Available
              </span>
            </div>

            <p className="text-[14px] text-gray-700 mb-6">
              Assigned interpreter: <span className="text-[var(--sage)]">
                {job.status === 'pending' ? 'Unfilled' : 'You'}
              </span>
            </p>

            {job.status === 'pending' ? (
              <div className="bg-[var(--canvas)] border border-gray-200 rounded-xl p-5 md:p-6 mt-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-medium text-[var(--ink)]">Your offer ·</span>
                      <span className="bg-[#E0E7FF] text-[#4338CA] text-[11px] font-semibold px-2 py-0.5 rounded-full">
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

                <div className="flex justify-start gap-3 flex-wrap mt-2">
                  <button 
                    onClick={() => releaseJob(job.id)}
                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-[13px] font-medium px-5 py-2 rounded-full transition-colors cursor-pointer"
                  >
                    Give back this assignment
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
