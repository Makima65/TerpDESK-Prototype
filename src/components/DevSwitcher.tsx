"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGlobalState, DevUser } from "@/context/GlobalContext";

export function DevSwitcher() {
  const { currentUser, setCurrentUser } = useGlobalState();
  const router = useRouter();

  const handleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let newUser: DevUser;
    
    if (value === 'staff-1') {
      newUser = { id: 'staff-1', role: 'agency', email: 'north.staff@fictional.test', agency_id: 'agency-1' };
    } else if (value === 'terp-1') {
      newUser = { id: 'terp-1', role: 'interpreter' };
    } else {
      newUser = { id: 'terp-new', role: 'interpreter' };
    }
    
    setCurrentUser(newUser);
    
    // Enforce role-based UI by redirecting to their respective dashboard
    if (newUser.role === 'agency') {
      router.push('/dashboard');
    } else if (newUser.role === 'interpreter') {
      router.push('/interpreter-home');
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-white border-2 border-orange-500 rounded-lg p-3 shadow-2xl flex flex-col gap-2 min-w-[200px]">
      <div className="flex flex-col gap-0.5 border-b border-gray-100 pb-2">
        <div className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Dev Toggle</div>
        <div className="text-xs text-gray-500 font-medium">Role: <span className="text-gray-800">{currentUser.role}</span></div>
        {currentUser.email && <div className="text-xs text-gray-500 font-medium">Email: <span className="text-gray-800">{currentUser.email}</span></div>}
        <div className="text-xs text-gray-500 font-medium">ID: <span className="text-gray-800">{currentUser.id}</span></div>
      </div>
      <select 
        value={currentUser.id} 
        onChange={handleSwitch}
        className="text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1 outline-none focus:border-orange-400 w-full cursor-pointer"
      >
        <option value="staff-1">Agency Staff</option>
        <option value="terp-1">Active Interpreter</option>
        <option value="terp-new">New Interpreter</option>
      </select>
    </div>
  );
}
