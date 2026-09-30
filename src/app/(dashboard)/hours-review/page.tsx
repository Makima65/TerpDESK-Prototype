"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

type RecordType = {
 id: string;
 title: string;
 interpreter: string;
 status: 'submitted' | 'approved';
 reportedMileage: string;
 approvedMileage: string | null;
 historyCount: number;
};

const MOCK_RECORDS: RecordType[] = [
 {
 id: '1',
 title: 'Fictional mileage and signature test',
 interpreter: 'QA Interpreter Two',
 status: 'submitted',
 reportedMileage: '0.0 mi',
 approvedMileage: null,
 historyCount: 1,
 },
 {
 id: '2',
 title: 'Fictional service-time test',
 interpreter: 'QA Interpreter One',
 status: 'approved',
 reportedMileage: '22.0 mi',
 approvedMileage: '18.0 mi',
 historyCount: 10,
 }
];

function ServiceRecordCard({ record }: { record: RecordType }) {
 const [recordState, setRecordState] = useState<'submitted' | 'approved'>(record.status);
 const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
 const [showSignatureError, setShowSignatureError] = useState(false);
 const [hasException, setHasException] = useState(false);
 
 // Correction State
 const [correctionText, setCorrectionText] = useState("");
 const [showCorrectionError, setShowCorrectionError] = useState(false);
 
 // View Signature Error State
 const [showViewSignatureError, setShowViewSignatureError] = useState(false);

 const handleApprove = () => {
 if (!hasException) {
 setShowSignatureError(true);
 return;
 }
 setShowSignatureError(false);
 setRecordState('approved');
 };

 const handleRequestCorrection = () => {
 if (!correctionText.trim()) {
 setShowCorrectionError(true);
 return;
 }
 // Normal submission logic here
 };

 return (
 <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 mb-4">
 <div className="flex justify-between items-start mb-6">
 <div>
 <h2 className="font-semibold text-lg text-[var(--ink)] mb-6">{record.title}</h2>
 <h3 className="font-medium text-[16px] text-[var(--ink)]">{record.interpreter}</h3>
 </div>
 <div className="flex flex-col items-end gap-5">
 <Link href="#" className="text-sm underline text-gray-700 hover:text-[var(--ink)] transition-colors">
 Open appointment
 </Link>
 <span className={`px-3 py-1 text-[12px] font-medium rounded-full ${recordState === 'submitted' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
 {recordState === 'submitted' ? 'Awaiting review' : 'Approved'}
 </span>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-8">
 <div className="space-y-4">
 <div>
 <div className="text-[var(--sage)] mb-1">Scheduled booking</div>
 <div className="text-[var(--ink)]">Tue, Sep 22 · 10:53 AM – 12:53 PM PDT</div>
 </div>
 <div>
 <div className="text-[var(--sage)] mb-1">Unpaid break</div>
 <div className="text-[var(--ink)]">None</div>
 </div>
 <div>
 <div className="text-[var(--sage)] mb-1">Mileage reported</div>
 <div className="text-[var(--ink)]">{record.reportedMileage}</div>
 </div>
 </div>
 
 <div className="space-y-4">
 <div>
 <div className="text-[var(--sage)] mb-1">Reported actual time</div>
 <div className="text-[var(--ink)]">Tue, Sep 22 · 10:53 AM – 12:53 PM PDT</div>
 </div>
 <div>
 <div className="text-[var(--sage)] mb-1">Service time</div>
 <div className="text-[var(--ink)]">2 hr</div>
 </div>
 <div>
 <div className="text-[var(--sage)] mb-1">Mileage approved by the agency</div>
 <div className="text-[var(--ink)]">{recordState === 'approved' ? (record.approvedMileage || record.reportedMileage) : 'Not approved yet'}</div>
 </div>
 </div>
 </div>

 {recordState === 'approved' && record.id === '2' && (
 <div className="text-sm text-[var(--sage)] mb-4 border-t border-gray-200 pt-6">
 Home → Site · 11.0 mi one-way distance + return on the same route · calculated total 22.0 mi
 </div>
 )}

 {recordState === 'approved' && record.id === '2' && (
 <div className="bg-[#E6EFEA] text-[#385B52] p-3 rounded-lg text-sm mb-6">
 Agency adjusted the approved mileage: Fictional policy caps the second leg — the reported figure above is kept as submitted.
 </div>
 )}
 
 {recordState === 'approved' && (
 <div className="text-sm text-gray-600 mb-6 border-t border-gray-200 pt-4">
 Approved {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}. Locked. Approval confirms the service record only; it is not a payment.
 </div>
 )}

 <div className="mb-6">
 <button 
 onClick={() => setIsHistoryExpanded(!isHistoryExpanded)} 
 className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2"
 >
 {isHistoryExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />} Version history ({record.historyCount})
 </button>
 {isHistoryExpanded && (
 <div className="text-xs text-[var(--sage)] mb-4 pl-4 space-y-2">
 <div>v1 · submitted by {record.interpreter} · Tue, Sep 22 · 2:53 PM PDT</div>
 </div>
 )}
 </div>

 {recordState === 'submitted' ? (
 <div className="bg-[#F5F4F0] p-4 md:p-5 rounded-xl mb-6">
 <h4 className="text-sm font-medium text-[var(--ink)] mb-1">Service-verification signature</h4>
 <p className="text-sm text-[var(--sage)]">No signature has been collected yet.</p>
 </div>
 ) : (
 <div className="bg-[#F5F4F0] p-4 md:p-5 rounded-xl mb-6">
 <h4 className="text-sm font-medium text-[var(--ink)] mb-1">Service-verification signature</h4>
 <p className="text-sm text-[var(--sage)] mb-4">Signed by Fictional Verifier (Site coordinator) on Tue, Sep 22 · 2:53 PM PDT.</p>
 <button 
 onClick={() => setShowViewSignatureError(true)}
 className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-4 py-1.5 text-sm font-medium transition-colors mb-2"
 >
 View signature
 </button>
 {showViewSignatureError && (
 <p className="text-[#C23B22] text-sm mt-1">That signature could not be opened. Try again.</p>
 )}
 </div>
 )}

 {recordState === 'submitted' && (
 <div className="bg-[#F5F4F0] p-4 md:p-5 rounded-xl">
 <label className="flex items-start gap-3 cursor-pointer mb-6">
 <input 
 type="checkbox" 
 className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[var(--forest)] focus:ring-[#0B3B32]" 
 checked={hasException}
 onChange={(e) => {
 setHasException(e.target.checked);
 setShowSignatureError(false);
 }}
 />
 <span className="text-sm text-gray-700">Record a signature exception (demo bypass)</span>
 </label>
 <div className="mb-5">
 <label className="block text-xs text-gray-600 mb-2">Mileage to approve (reported: {record.reportedMileage})</label>
 <input type="text" defaultValue="0" className="w-full sm:w-[200px] bg-[#F5F4F0] border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-[#0B3B32] outline-none transition-shadow" />
 </div>
 <div className="mb-5">
 <label className="block text-xs text-gray-600 mb-2">Message to the interpreter (required to request a correction)</label>
 <textarea 
 rows={4} 
 value={correctionText}
 onChange={(e) => {
 setCorrectionText(e.target.value);
 setShowCorrectionError(false);
 }}
 className="w-full bg-[#F5F4F0] border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-[#0B3B32] outline-none transition-shadow resize-none"
 ></textarea>
 </div>
 {showSignatureError && <p className="text-[#C23B22] text-sm mb-4">This assignment needs a service-verification signature, or a recorded exception, before it can be approved</p>}
 {showCorrectionError && <p className="text-[#C23B22] text-sm mb-4">Say what needs correcting so the interpreter can fix it</p>}
 <div className="flex flex-col sm:flex-row gap-3 w-full mb-4">
 <button 
 onClick={handleApprove}
 className="w-full sm:w-auto bg-[#145347] text-white hover:bg-[#0f4037] rounded-full px-6 py-2.5 text-sm font-medium transition-colors"
 >
 Approve service record
 </button>
 <button 
 onClick={handleRequestCorrection}
 className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-6 py-2.5 text-sm font-medium transition-colors"
 >
 Request a correction
 </button>
 </div>
 <p className="text-xs text-[var(--sage)] leading-relaxed">
 Approving confirms what was worked and the mileage the agency accepts. It does not calculate pay, rates or an invoice, and it never overwrites what the interpreter submitted.
 </p>
 </div>
 )}
 </div>
 );
}

export default function HoursReviewPage() {
 const [activeTab, setActiveTab] = useState<'awaiting' | 'all'>('awaiting');
 
 const submittedCount = MOCK_RECORDS.filter(r => r.status === 'submitted').length;
 const allCount = MOCK_RECORDS.length;
 
 const displayedRecords = activeTab === 'awaiting' 
 ? MOCK_RECORDS.filter(r => r.status === 'submitted') 
 : MOCK_RECORDS;

 return (
 <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 space-y-6 pb-24 antialiased pt-6">
 <div>
 <h1 className="text-3xl font-bold text-[var(--ink)] mb-2">Hours review</h1>
 <p className="text-sm text-[var(--sage)] mb-6">
 Reported service time awaiting your confirmation. Approval records the service; it does not create pay or an invoice.
 </p>
 </div>

 <div className="flex flex-wrap gap-3 mb-8">
 <button 
 onClick={() => setActiveTab('awaiting')}
 className={`w-full sm:w-auto px-5 py-2.5 transition-colors text-sm font-medium rounded-full ${
 activeTab === 'awaiting' 
 ? 'bg-[#145347] text-white hover:bg-[#0f4037]' 
 : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 '
 }`}
 >
 Awaiting review ({submittedCount})
 </button>
 <button 
 onClick={() => setActiveTab('all')}
 className={`w-full sm:w-auto px-5 py-2.5 transition-colors text-sm font-medium rounded-full ${
 activeTab === 'all' 
 ? 'bg-[#145347] text-white hover:bg-[#0f4037]' 
 : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 '
 }`}
 >
 All reported hours ({allCount})
 </button>
 </div>

 <div className="flex flex-col gap-6 w-full">
 {displayedRecords.map(record => (
 <ServiceRecordCard key={record.id} record={record} />
 ))}
 </div>
 </div>
 );
}
