"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useGlobalState } from "@/context/GlobalContext";
import { useRouter } from "next/navigation";

export function NotificationBell() {
  const { notifications, currentUser, markNotificationAsRead } = useGlobalState();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const myNotifications = notifications
    .filter((notification) => {
      if (currentUser.role === 'agency') {
        // Agencies only see notifications sent to their agency_id
        return notification.recipient_id === currentUser.agency_id; 
      } else {
        // Interpreters only see notifications sent to their specific user id
        return notification.recipient_id === currentUser.id;
      }
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  const unreadCount = myNotifications.filter((n) => n.read_at === null).length;

  const handleNotificationClick = (id: string, href?: string) => {
    markNotificationAsRead(id);
    setIsOpen(false);
    if (href) {
      router.push(href);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        className="relative text-slate-500 hover:text-slate-700 mt-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#9E3929] text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded-2xl z-50 overflow-hidden flex flex-col max-h-[400px]">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-semibold text-[15px] text-gray-800 tracking-tight">Notifications</h3>
          </div>
          <div className="overflow-y-auto flex-1">
            {myNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                No notifications yet.
              </div>
            ) : (
              <div className="flex flex-col">
                {myNotifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.id, notif.href)}
                    className={`text-left px-4 py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors ${
                      notif.read_at === null ? 'bg-[#F9F8F4]' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {notif.read_at === null && (
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#0B3B32] shrink-0" />
                      )}
                      <div className={`flex flex-col gap-1 ${notif.read_at !== null ? 'ml-5' : ''}`}>
                        <span className={`text-sm ${notif.read_at === null ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {notif.title}
                        </span>
                        <span className="text-[13px] text-gray-500 leading-snug">
                          {notif.body}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
