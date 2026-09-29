"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Job {
  id: string;
  title: string;
  dateString: string;
  status: 'pending' | 'booked' | 'declined' | 'released';
  location: string;
  isVirtual: boolean;
  hasAutoFill?: boolean;
  serviceRecordState?: 'not_started' | 'submitted' | 'approved';
}

interface InterpreterJobsContextType {
  jobs: Job[];
  acceptJobOffer: (jobId: string) => void;
  declineOffer: (jobId: string) => void;
  releaseJob: (jobId: string) => void;
  submitHours: (jobId: string) => void;
}

const mockJobs: Job[] = [
  {
    id: "fictional-1",
    title: "Fictional notification test",
    dateString: "THU, OCT 15 · 10:54 PM PDT – FRI, OCT 16 · 12:54 AM PDT",
    status: "pending",
    location: "Virtual details pending · QA Fixture Agency A (automated tests)",
    isVirtual: true,
  },
  {
    id: "fictional-2",
    title: "Fictional notification test",
    dateString: "SUN, OCT 18 · 10:54 AM – 12:54 PM PDT",
    status: "pending",
    location: "Virtual details pending · QA Fixture Agency A (automated tests)",
    isVirtual: true,
  },
  {
    id: "fictional-3",
    title: "Fictional notification test",
    dateString: "TUE, OCT 20 · 10:54 PM PDT – WED, OCT 21 · 12:54 AM PDT",
    status: "pending",
    location: "Virtual details pending · QA Fixture Agency A (automated tests)",
    isVirtual: true,
  },
  {
    id: "fictional-4",
    title: "Fictional Auto Fill test",
    dateString: "MON, OCT 26, 2020 · 2:52 PM – 4:52 PM PDT",
    status: "booked",
    location: "Virtual details pending · QA Fixture Agency A (automated tests)",
    isVirtual: true,
    hasAutoFill: true,
    serviceRecordState: "not_started",
  },
  {
    id: "fictional-5",
    title: "Fictional release test",
    dateString: "FRI, JAN 29 · 3:52 AM – 5:52 AM PST",
    status: "booked",
    location: "Virtual details pending · QA Fixture Agency A (automated tests)",
    isVirtual: true,
  },
  {
    id: "fictional-6",
    title: "Fictional release test",
    dateString: "FRI, JAN 29 · 9:52 AM – 11:52 AM PST",
    status: "booked",
    location: "Virtual details pending · QA Fixture Agency B (automated tests)",
    isVirtual: true,
  },
];

const InterpreterJobsContext = createContext<InterpreterJobsContextType | undefined>(undefined);

export function InterpreterJobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedJobs = localStorage.getItem('terpdesk_interpreter_jobs');
    if (savedJobs) {
      try {
        setJobs(JSON.parse(savedJobs));
      } catch (error) {
        console.error("Failed to parse jobs from local storage", error);
      }
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('terpdesk_interpreter_jobs', JSON.stringify(jobs));
    }
  }, [jobs, isMounted]);

  const acceptJobOffer = (jobId: string) => {
    setJobs(prevJobs => prevJobs.map(job => 
      job.id === jobId ? { ...job, status: 'booked' } : job
    ));
    localStorage.setItem(`agency_staffing_state_${jobId}`, JSON.stringify({ bookedInterpreter: 'Dale Fictional' }));
  };

  const declineOffer = (jobId: string) => {
    setJobs(prevJobs => prevJobs.map(job => 
      job.id === jobId ? { ...job, status: 'declined' } : job
    ));
    
    // Log the decline to the agency's previous offers array
    const agencyStateString = localStorage.getItem(`agency_staffing_state_${jobId}`);
    if (agencyStateString) {
      try {
        const state = JSON.parse(agencyStateString);
        const nameToLog = state.pendingOffer?.interpreterName || 'Unknown Interpreter';
        const newOffers = [...(state.previousOffers || []), { name: nameToLog, status: 'Declined', date: new Date().toISOString() }];
        localStorage.setItem(`agency_staffing_state_${jobId}`, JSON.stringify({ ...state, pendingOffer: null, previousOffers: newOffers }));
      } catch (e) {
        console.error("Failed to log decline", e);
        localStorage.removeItem(`agency_staffing_state_${jobId}`);
      }
    } else {
      localStorage.removeItem(`agency_staffing_state_${jobId}`);
    }
  };

  const releaseJob = (jobId: string) => {
    setJobs(prevJobs => prevJobs.map(job => 
      job.id === jobId ? { ...job, status: 'released' } : job
    ));
  };

  const submitHours = (jobId: string) => {
    setJobs(prevJobs => prevJobs.map(job => 
      job.id === jobId ? { ...job, serviceRecordState: 'submitted' } : job
    ));
  };

  if (!isMounted) return null;

  return (
    <InterpreterJobsContext.Provider value={{ jobs, acceptJobOffer, declineOffer, releaseJob, submitHours }}>
      {children}
    </InterpreterJobsContext.Provider>
  );
}

export function useInterpreterJobs() {
  const context = useContext(InterpreterJobsContext);
  if (!context) {
    throw new Error("useInterpreterJobs must be used within an InterpreterJobsProvider");
  }
  return context;
}
