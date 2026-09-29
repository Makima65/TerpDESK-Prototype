"use client";

import React, { useState } from "react";

export default function SettingsPage() {
  const [theme, setTheme] = useState("default");

  const notifications = [
    { title: "Offer responses", subtitle: "An interpreter accepts or declines one of your offers." },
    { title: "Give-backs needing replacement", subtitle: "An interpreter releases a booked position." },
    { title: "Access changes on booked positions", subtitle: "Job access is removed or restored on a booked position." },
    { title: "Join requests", subtitle: "Someone asks to connect with your agency." },
    { title: "Service record submissions", subtitle: "An interpreter submits actual hours for review." },
    { title: "Signature exceptions", subtitle: "An interpreter asks for a signature exception." }
  ];

  return (
    <div className="max-w-[1200px] mx-auto p-6 space-y-6 pb-24 antialiased">
      {/* Top Banner */}
      <div className="rounded-full bg-[#E6EFEA] px-6 py-3.5 text-sm font-medium text-[#385B52] mb-6">
        Test workspace — fictional information only
      </div>

      {/* Header Section */}
      <div className="space-y-2 mb-6">
        <h1 className="text-[28px] font-semibold tracking-tight text-gray-900">Settings</h1>
        <p className="text-[15px] text-gray-500">
          Your account and how terpDESK tells you about activity.
        </p>
      </div>

      {/* Card 1: Account */}
      <div className="bg-white rounded-[24px] p-6 mb-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-[14px] text-gray-500">Name</span>
          <span className="text-[14px] text-gray-900 font-medium">Avery North</span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-[14px] text-gray-500">Sign-in email</span>
          <span className="text-[14px] text-gray-900 font-medium">north.staff@fictional.test</span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-100 mb-4">
          <span className="text-[14px] text-gray-500">Agency</span>
          <span className="text-[14px] text-gray-900 font-medium">North Fictional Interpreting</span>
        </div>

        {/* Agency Join Code Box */}
        <div className="bg-[#F9F9F8] rounded-xl p-4 my-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h3 className="font-medium text-gray-900 text-[14px]">Agency join code</h3>
            <p className="text-gray-500 text-[13px] mt-0.5">Interpreters enter this under Connections to ask to join your agency.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-gray-900 text-[14px]">NORTH-2026</span>
            <button className="bg-white border border-gray-200 rounded-full px-4 py-1.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Copy
            </button>
          </div>
        </div>

        <p className="text-[13px] text-gray-500 mb-4">
          Notifications are sent to your sign-in email above, not to a contact address on your profile.
        </p>

        <button className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
          Change my password
        </button>
      </div>

      {/* Card 2: Notifications */}
      <div className="bg-white rounded-[24px] p-6 mb-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        <p className="text-[14px] text-gray-600 mb-6 mt-1">
          Choose how terpDESK tells you about each kind of activity. In-app notices appear in your workspace. Email is optional and off until you turn it on. terpDESK does not send text messages or phone alerts.
        </p>

        <div className="space-y-0">
          {notifications.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-gray-100 last:border-0 gap-4">
              <div>
                <h3 className="text-[14px] font-medium text-gray-900">{item.title}</h3>
                <p className="text-[13px] text-gray-500">{item.subtitle}</p>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-[#0B3B32] focus:ring-[#0B3B32] accent-[#0B3B32] cursor-pointer" />
                  <span className="text-[13px] text-gray-700 font-medium">In-app</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0B3B32] focus:ring-[#0B3B32] accent-[#0B3B32] cursor-pointer" />
                  <span className="text-[13px] text-gray-700 font-medium">Email</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[12px] text-gray-400 mt-6 leading-relaxed">
          Emails keep details out of the message itself; they tell you something happened and ask you to sign in. Account invitations, password recovery and security emails are separate from these choices and are always sent. terpDESK reports an email as sent once it is handed to the mail service; that is not a guarantee it reached your inbox.
        </p>
      </div>

      {/* Card 3: Appearance */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Appearance</h2>
        <p className="text-[14px] text-gray-500 mb-6">Customize your workspace theme and colors.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Default */}
          <div className="flex flex-col items-center">
            <div
              onClick={() => setTheme("default")}
              className={`w-full max-w-[200px] h-24 rounded-xl flex overflow-hidden cursor-pointer transition-all ${theme === 'default' ? 'border-2 border-[#0B3B32] ring-2 ring-[#0B3B32]/20 shadow-md' : 'border border-gray-200 hover:border-gray-300 shadow-sm'}`}
            >
              <div className="w-1/4 h-full bg-[#0B3B32]" />
              <div className="w-3/4 h-full bg-[#F9F8F4]" />
            </div>
            <span className={`mt-3 text-[13px] font-medium ${theme === 'default' ? 'text-gray-900' : 'text-gray-500'}`}>Agency Default</span>
          </div>

          {/* Ocean */}
          <div className="flex flex-col items-center">
            <div
              onClick={() => setTheme("ocean")}
              className={`w-full max-w-[200px] h-24 rounded-xl flex overflow-hidden cursor-pointer transition-all ${theme === 'ocean' ? 'border-2 border-[#1E3A8A] ring-2 ring-[#1E3A8A]/20 shadow-md' : 'border border-gray-200 hover:border-gray-300 shadow-sm'}`}
            >
              <div className="w-1/4 h-full bg-[#1E3A8A]" />
              <div className="w-3/4 h-full bg-slate-50" />
            </div>
            <span className={`mt-3 text-[13px] font-medium ${theme === 'ocean' ? 'text-gray-900' : 'text-gray-500'}`}>Ocean Blue</span>
          </div>

          {/* Dark Mode */}
          <div className="flex flex-col items-center">
            <div
              onClick={() => setTheme("dark")}
              className={`w-full max-w-[200px] h-24 rounded-xl flex overflow-hidden cursor-pointer transition-all ${theme === 'dark' ? 'border-2 border-gray-700 ring-2 ring-gray-700/20 shadow-md' : 'border border-gray-200 hover:border-gray-300 shadow-sm'}`}
            >
              <div className="w-1/4 h-full bg-[#1F2937]" />
              <div className="w-3/4 h-full bg-[#111827]" />
            </div>
            <span className={`mt-3 text-[13px] font-medium ${theme === 'dark' ? 'text-gray-900' : 'text-gray-500'}`}>Dark Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
}
