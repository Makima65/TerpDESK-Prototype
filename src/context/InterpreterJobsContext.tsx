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
  startsAt?: string;
  endsAt?: string;
  serviceRecordState?: 'not_started' | 'submitted' | 'approved';
}

interface InterpreterJobsContextType {
  jobs: Job[];
  acceptJobOffer: (jobId: string) => void;
  declineOffer: (jobId: string) => void;
  releaseJob: (jobId: string) => void;
  submitHours: (jobId: string) => void;
}

const InterpreterJobsContext = createContext<InterpreterJobsContextType | undefined>(undefined);

export function InterpreterJobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    let localJobs: Job[] = [];

    // 1. Load existing interpreter jobs but aggressively strip the old fictional data
    const savedJobs = localStorage.getItem('terpdesk_interpreter_jobs');
    if (savedJobs) {
      try {
        const parsed = JSON.parse(savedJobs);
        localJobs = parsed.filter((j: Job) => 
          !(j.id && j.id.startsWith('fictional-')) && 
          !(j.title && j.title.includes('Fictional'))
        );
      } catch (error) {
        console.error("Failed to parse jobs from local storage", error);
      }
    }

    // 2. Load incoming offers from the Agency and merge them in
    const savedOffers = localStorage.getItem('terpdesk_offers');
    if (savedOffers) {
      try {
        const offers = JSON.parse(savedOffers);
        offers.forEach((o: any) => {
          // Check for poisoned Fictional cache in offers
          if (o.title && o.title.includes('Fictional')) return;

          // If we don't already have this offer in our jobs state
          if (!localJobs.find(j => j.id === o.id)) {
            localJobs.push({
              id: o.id,
              title: o.title || "Interpreter Request",
              dateString: o.startsAt ? new Date(o.startsAt).toLocaleString() : "Date TBD",
              status: o.status === 'accepted' ? 'booked' : o.status,
              location: o.agencyName || "Remote",
              isVirtual: true,
              startsAt: o.startsAt,
              endsAt: o.endsAt
            } as Job);
          }
        });
      } catch (e) {
        console.error("Failed to parse offers", e);
      }
    }

    setJobs(localJobs);
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
    
    // Notify the agency side
    localStorage.setItem(`agency_staffing_state_${jobId}`, JSON.stringify({ bookedInterpreter: 'Dale Fictional' }));

    // Update the terpdesk_offers mock database to accepted
    const savedOffers = localStorage.getItem('terpdesk_offers');
    if (savedOffers) {
      try {
        const offers = JSON.parse(savedOffers);
        const updatedOffers = offers.map((o: any) => o.id === jobId ? { ...o, status: 'accepted' } : o);
        localStorage.setItem('terpdesk_offers', JSON.stringify(updatedOffers));

        // Push to accepted appointments for agency view
        const accepted = JSON.parse(localStorage.getItem('terpdesk_accepted_appointments') || '[]');
        const offer = offers.find((o: any) => o.id === jobId);
        if (offer && !accepted.find((a: any) => a.id === jobId)) {
           accepted.push({
             id: offer.id,
             title: offer.title,
             startsAt: offer.startsAt,
             endsAt: offer.endsAt,
             agencyName: offer.agencyName
           });
           localStorage.setItem('terpdesk_accepted_appointments', JSON.stringify(accepted));
        }
      } catch (e) {}
    }
    
    window.dispatchEvent(new Event('storage')); // Trigger cross-tab
  };

  const declineOffer = (jobId: string) => {
    setJobs(prevJobs => prevJobs.map(job => 
      job.id === jobId ? { ...job, status: 'declined' } : job
    ));
    
    // Update the terpdesk_offers to declined
    const savedOffers = localStorage.getItem('terpdesk_offers');
    if (savedOffers) {
       try {
         const offers = JSON.parse(savedOffers);
         const updatedOffers = offers.map((o: any) => o.id === jobId ? { ...o, status: 'declined' } : o);
         localStorage.setItem('terpdesk_offers', JSON.stringify(updatedOffers));
       } catch(e) {}
    }

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
    window.dispatchEvent(new Event('storage'));
  };

  const releaseJob = (jobId: string) => {
    setJobs(prevJobs => prevJobs.map(job => 
      job.id === jobId ? { ...job, status: 'released' } : job
    ));
    window.dispatchEvent(new Event('storage'));
  };

  const submitHours = (jobId: string) => {
    setJobs(prevJobs => prevJobs.map(job => 
      job.id === jobId ? { ...job, serviceRecordState: 'submitted' } : job
    ));
    window.dispatchEvent(new Event('storage'));
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
