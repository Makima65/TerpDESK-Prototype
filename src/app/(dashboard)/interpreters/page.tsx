"use client";

import React, { useState } from "react";
import { useGlobalState } from "@/context/GlobalContext";

function getMockInterpreterDetails(id: string) {
  if (id === 'terp-1') {
    return { name: "Active Interpreter", location: "Tacoma, WA · South Puget Sound, up to 40 miles", initials: "AI", color: "bg-[#E28373]", badges: ["Active with this agency"] };
  } else if (id === 'terp-new') {
    return { name: "New Interpreter", location: "Olympia, WA", initials: "NI", color: "bg-[#D8B4E2]", badges: ["Active with this agency"] };
  }
  return { name: `Interpreter ${id}`, location: "Location not set", initials: id.substring(0,2).toUpperCase(), color: "bg-[var(--forest)]", badges: ["Active with this agency"] };
}

export default function InterpretersPage() {
  const { currentUser, memberships, membership_requests, approveMembershipRequest, declineMembershipRequest, website_profile_consent } = useGlobalState();
  const [activeTab, setActiveTab] = useState<'roster' | 'requests' | 'website'>('roster');
  const [searchQuery, setSearchQuery] = useState("");

  if (currentUser.role !== 'agency') {
    return (
      <div className="p-8 text-center text-slate-500">
        You do not have permission to view this page.
      </div>
    );
  }

  const agencyId = currentUser.agency_id || "agency-1";

  // Roster Tab
  const activeMemberships = memberships.filter(m => m.agency_id === agencyId && m.active);
  const rosterInterpreters = activeMemberships.map(m => getMockInterpreterDetails(m.user_id)).filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Join Requests Tab
  const pendingRequests = membership_requests.filter(r => r.agency_id === agencyId && r.state === 'pending');
  const answeredRequests = membership_requests.filter(r => r.agency_id === agencyId && r.state !== 'pending');

  // Website Profiles Tab
  const websiteProfiles = website_profile_consent.filter(c => c.agency_id === agencyId && c.allowed);

  const getBadgeClass = (badge: string) => {
    if (badge.includes("Active") || badge === "approved" || badge === "Approved for the website") {
      return "bg-[#E5F0EB] text-[#0A3D31]";
    }
    if (badge.includes("self-reported") || badge === "declined") {
      return "bg-[#FDE8E8] text-[#9B1C1C]";
    }
    return "bg-[#F4F3EF] text-gray-700";
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6 space-y-6 pb-24 antialiased">
      <div className="space-y-2 mb-6">
        <h1 className="text-[28px] font-semibold tracking-tight text-[var(--ink)]">Interpreters</h1>
        <p className="text-[15px] text-[var(--sage)]">
          People connected to this agency, and people asking to join it.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => setActiveTab('roster')}
          className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${
            activeTab === 'roster'
              ? 'bg-[var(--forest)] text-[var(--canvas)] border border-[#0B3B32]'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Roster ({activeMemberships.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${
            activeTab === 'requests'
              ? 'bg-[var(--forest)] text-[var(--canvas)] border border-[#0B3B32]'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Join requests ({pendingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('website')}
          className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${
            activeTab === 'website'
              ? 'bg-[var(--forest)] text-[var(--canvas)] border border-[#0B3B32]'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Website profiles
        </button>
      </div>

      {activeTab === 'roster' && (
        <div className="space-y-6">
          <div className="flex flex-col">
            <label className="block text-[13px] text-[var(--sage)] mb-1.5 ml-1">Search by name</label>
            <input
              type="text"
              placeholder="Start typing a name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F4F3EF] border-none rounded-full px-5 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-[#0B3B32] outline-none transition-shadow"
            />
          </div>

          <div className="space-y-4">
            {rosterInterpreters.length === 0 ? (
              <p className="text-gray-600 pl-2">No interpreters found.</p>
            ) : (
              rosterInterpreters.map((interpreter, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:transition-shadow">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0 ${interpreter.color || 'bg-gray-300'}`}>
                      {interpreter.initials}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-[17px] font-medium text-[var(--ink)]">{interpreter.name}</h3>
                      <p className="text-[13px] text-[var(--sage)] mb-2">{interpreter.location}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {interpreter.badges.map((badge, idx2) => (
                          <span key={idx2} className={`px-3 py-1 rounded-full text-[11px] font-medium ${getBadgeClass(badge)}`}>
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button className="text-sm text-[var(--sage)] font-medium hover:text-[var(--ink)] transition-colors sm:pt-1 self-start sm:self-auto">
                    Manage access
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-6">
          {pendingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <p className="text-gray-600">No one is waiting for a decision.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((req, idx) => {
                const details = getMockInterpreterDetails(req.interpreter_id);
                return (
                  <div key={req.id} className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6 hover:shadow-sm transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-white font-semibold text-[17px] shrink-0 bg-[#0B3B32]">
                        {details.initials}
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-[19px] font-semibold text-[var(--ink)]">{details.name}</h3>
                        <p className="text-[13px] text-[var(--sage)] mb-4">{details.location === "Location not set" ? "Location not set · Greater Tacoma area" : details.location}</p>
                        
                        <div className="flex flex-col space-y-1 mb-5">
                          <p className="text-[13px] text-gray-700">QA Fictional Certification (expired) · Fictional Certifying Body · 2019</p>
                          <p className="text-[13px] text-gray-700">QA Fictional Liability Policy · Fictional Insurer · 2026</p>
                          <p className="text-[13px] text-gray-700">QA Fictional Mentorship (no expiration) · Fictional Training Co · 2023</p>
                        </div>
                        
                        <p className="text-[11px] text-[#A0AAB4]">
                          Self-reported by the interpreter. terpDESK has not checked these details, and they do not approve anyone for specialised work.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 pt-1">
                      <button 
                        onClick={() => approveMembershipRequest(req.id)}
                        className="px-6 py-2 rounded-full bg-[#0B3B32] text-white text-[13px] font-medium hover:bg-[#082a23] transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => declineMembershipRequest(req.id)}
                        className="px-6 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-[13px] font-medium hover:bg-gray-50 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-lg font-semibold text-[var(--ink)] mb-6">Already answered</h2>
            {answeredRequests.length === 0 ? (
              <p className="text-gray-600">No answered requests yet.</p>
            ) : (
              <div className="flex flex-col">
                {answeredRequests.map((req, idx) => {
                  const details = getMockInterpreterDetails(req.interpreter_id);
                  return (
                    <div key={req.id} className={`flex items-center gap-4 py-4 ${idx !== answeredRequests.length - 1 ? 'border-b border-gray-200' : ''}`}>
                      <span className="text-[15px] font-medium text-[var(--ink)] min-w-[150px]">{details.name}</span>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${getBadgeClass(req.state)} capitalize`}>
                        {req.state}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'website' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-lg font-semibold text-[var(--ink)] mb-4">Website profiles</h2>
            <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
              Interpreters who are active with this agency and chose to let you feature them. You decide whether each profile appears on your website. You cannot turn this permission on for someone; only they can. Approved profiles show exactly the four fields below — nothing else from their account, contact details or credential files.
            </p>
            <p className="text-[14px] text-[var(--sage)]">
              Your website is not switched on, so approving a profile does not show it anywhere yet.
            </p>
          </div>

          {websiteProfiles.length === 0 ? (
            <p className="text-gray-600 pl-2">No website profiles found.</p>
          ) : (
            websiteProfiles.map((profile, idx) => {
              const details = getMockInterpreterDetails(profile.interpreter_id);
              return (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6 hover:transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0 ${details.color || 'bg-gray-300'}`}>
                      {details.initials}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-[17px] font-medium text-[var(--ink)]">{details.name}</h3>
                      <p className="text-[13px] text-[var(--sage)] mb-3">{details.location}</p>
                      <div className="mb-4 flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${getBadgeClass(profile.review_state)} capitalize`}>
                          {profile.review_state.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[13px] text-[var(--sage)]">
                        This preview is exactly what the website would show: name, photo, bio and broad service area.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-1">
                    <button className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      {profile.review_state === 'approved' ? 'Remove from website' : 'Approve for website'}
                    </button>
                    <button className="text-sm font-medium text-[var(--sage)] hover:text-[var(--ink)] transition-colors">
                      Decline
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
