"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface RequestItem {
  id: string;
  title: string;
  dateString: string;
  status: string;
  setting: string;
  actionRequired: boolean;
  timestamp: number;
  overview?: any;
  details?: any;
  onsite?: any;
  requester?: any;
  prepNotes?: string;
  privateNotes?: string;
  activity?: string;
  location?: string;
  organization?: string;
  format?: string;
  pendingOffer?: boolean | string;
  serviceRecordState?: string;
}

interface RequestsContextType {
  requests: RequestItem[];
  addRequest: (request: RequestItem) => void;
  updateRequest: (id: string, request: Partial<RequestItem>) => void;
}

const defaultRequests: RequestItem[] = [
  {
    id: "APT-88334D",
    title: "Testing assignment",
    dateString: "Expires Fri, Oct 2 · 12:00 AM GMT+8",
    status: "Awaiting response",
    setting: "Virtual",
    actionRequired: true,
    timestamp: new Date("2026-10-02").getTime(),
  },
  {
    id: "APT-88334E",
    title: "Medical interpreting request",
    dateString: "Mon, Sep 21 · 9:12 AM – 10:12 AM PDT",
    status: "Unfilled / draft",
    setting: "Medical",
    actionRequired: true,
    timestamp: new Date("2026-09-21").getTime(),
  },
  {
    id: "APT-88334F",
    title: "Workplace interpreting request",
    dateString: "Mon, Sep 21 · 9:14 AM – 10:14 AM PDT",
    status: "Unfilled / draft",
    setting: "Workplace",
    actionRequired: true,
    timestamp: new Date("2026-09-21T09:14:00").getTime(),
  },
  {
    id: "APT-88334G",
    title: "Partially staffed — Testing",
    dateString: "Thu, Sep 24 · 9:56 AM – 3:56 PM PDT",
    status: "Partially staffed",
    setting: "Other",
    actionRequired: true,
    timestamp: new Date("2026-09-24T09:56:00").getTime(),
  }
];

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<RequestItem[]>(defaultRequests);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("terpdesk_requests");
    if (saved) {
      try {
        setRequests(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse requests from local storage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("terpdesk_requests", JSON.stringify(requests));
    }
  }, [requests, isLoaded]);

  const addRequest = (request: RequestItem) => {
    setRequests((prev) => [request, ...prev].sort((a, b) => b.timestamp - a.timestamp));
  };

  const updateRequest = (id: string, updatedData: Partial<RequestItem>) => {
    setRequests((prev) => prev.map(req => req.id === id ? { ...req, ...updatedData } : req));
  };

  if (!isLoaded) return null;

  return (
    <RequestsContext.Provider value={{ requests, addRequest, updateRequest }}>
      {children}
    </RequestsContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestsContext);
  if (context === undefined) {
    throw new Error("useRequests must be used within a RequestsProvider");
  }
  return context;
}
