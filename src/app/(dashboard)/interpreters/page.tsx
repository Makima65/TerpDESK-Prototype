"use client";

import React, { useState } from "react";
import Image from "next/image";

const MOCK_INTERPRETERS = [
  {
    id: "1",
    name: "Avery Fictional",
    location: "Tacoma, WA · South Puget Sound, up to 40 miles",
    badges: ["Active with this agency", "In person", "Virtual", "1 self-reported"],
    initials: "AF",
    color: "bg-[#E28373]",
  },
  {
    id: "2",
    name: "CMG Interpreter",
    location: "Olympia, WA · up to 40 miles",
    badges: ["Active with this agency", "In person", "Virtual", "1 self-reported"],
    image: "/cmg-avatar.jpg", // We'll just put a placeholder if image is missing
    initials: "CM",
    color: "bg-[#D8B4E2]",
  },
  {
    id: "3",
    name: "Dale Fictional",
    location: "Location not set",
    badges: ["Active with this agency", "In person", "Virtual", "1 self-reported"],
    initials: "DF",
    color: "bg-[#0B3B32]",
  }
];

const ANSWERED_REQUESTS = [
  { id: 1, name: "Melissa Shaw", status: "Approved" },
  { id: 2, name: "Jenni", status: "Approved" },
  { id: 3, name: "CMG Interpreter", status: "Approved" },
  { id: 4, name: "Dale Fictional", status: "Approved" },
  { id: 5, name: "Dale Fictional", status: "Declined" },
  { id: 6, name: "Avery Fictional", status: "Approved" },
];

export default function InterpretersPage() {
  const [activeTab, setActiveTab] = useState<'roster' | 'requests' | 'website'>('roster');

  const getBadgeClass = (badge: string) => {
    if (badge.includes("Active") || badge === "Approved" || badge === "Approved for the website") {
      return "bg-[#E5F0EB] text-[#0A3D31]";
    }
    if (badge.includes("self-reported")) {
      return "bg-[#FDE8E8] text-[#9B1C1C]"; // Faint red
    }
    return "bg-[#F4F3EF] text-gray-700"; // Light gray
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6 space-y-6 pb-24 antialiased">
      {/* Top Banner */}
      <div className="rounded-full bg-[#E6EFEA] px-6 py-3.5 text-sm font-medium text-[#385B52] mb-6">
        Test workspace — fictional information only
      </div>

      {/* Header & Subtitle */}
      <div className="space-y-2 mb-6">
        <h1 className="text-[28px] font-semibold tracking-tight text-gray-900">Interpreters</h1>
        <p className="text-[15px] text-gray-500">
          People connected to this agency, and people asking to join it.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => setActiveTab('roster')}
          className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${
            activeTab === 'roster'
              ? 'bg-[#0B3B32] text-white border border-[#0B3B32]'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Roster (7)
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${
            activeTab === 'requests'
              ? 'bg-[#0B3B32] text-white border border-[#0B3B32]'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Join requests (0)
        </button>
        <button
          onClick={() => setActiveTab('website')}
          className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${
            activeTab === 'website'
              ? 'bg-[#0B3B32] text-white border border-[#0B3B32]'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Website profiles
        </button>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          <div className="flex flex-col">
            <label className="block text-[13px] text-gray-500 mb-1.5 ml-1">Search by name</label>
            <input
              type="text"
              placeholder="Start typing a name"
              className="w-full bg-[#F4F3EF] border-none rounded-full px-5 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-[#0B3B32] outline-none transition-shadow"
            />
          </div>

          <div className="space-y-4">
            {MOCK_INTERPRETERS.map((interpreter) => (
              <div key={interpreter.id} className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-start sm:items-center gap-4">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0 ${interpreter.color || 'bg-gray-300'}`}>
                    {interpreter.initials}
                  </div>
                  {/* Details */}
                  <div className="flex flex-col">
                    <h3 className="text-[17px] font-medium text-gray-900">{interpreter.name}</h3>
                    <p className="text-[13px] text-gray-500 mb-2">{interpreter.location}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {interpreter.badges.map((badge, idx) => (
                        <span key={idx} className={`px-3 py-1 rounded-full text-[11px] font-medium ${getBadgeClass(badge)}`}>
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Right Action */}
                <button className="text-sm text-gray-500 font-medium hover:text-gray-900 transition-colors sm:pt-1 self-start sm:self-auto">
                  Manage access
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-8">
          <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm">
            <p className="text-gray-600">No one is waiting for a decision.</p>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Already answered</h2>
            <div className="flex flex-col">
              {ANSWERED_REQUESTS.map((req, idx) => (
                <div key={req.id} className={`flex items-center gap-4 py-4 ${idx !== ANSWERED_REQUESTS.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <span className="text-[15px] font-medium text-gray-900 min-w-[150px]">{req.name}</span>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${getBadgeClass(req.status)}`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'website' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Website profiles</h2>
            <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
              Interpreters who are active with this agency and chose to let you feature them. You decide whether each profile appears on your website. You cannot turn this permission on for someone; only they can. Approved profiles show exactly the four fields below — nothing else from their account, contact details or credential files.
            </p>
            <p className="text-[14px] text-gray-500">
              Your website is not switched on, so approving a profile does not show it anywhere yet.
            </p>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0 bg-[#D8B4E2]">
                CM
              </div>
              <div className="flex flex-col">
                <h3 className="text-[17px] font-medium text-gray-900">CMG Interpreter</h3>
                <p className="text-[13px] text-gray-500 mb-3">up to 40 miles</p>
                <div className="mb-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#E5F0EB] text-[#0A3D31]">
                    Approved for the website
                  </span>
                </div>
                <p className="text-[13px] text-gray-500">
                  This preview is exactly what the website would show: name, photo, bio and broad service area.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 pt-1">
              <button className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Remove from website
              </button>
              <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
