export interface Slot {
  id: string;
  active: boolean;
  reservedBy: string | null;
  interpreterName?: string;
  needsReplacement: boolean;
  followUp: boolean;
}

export interface Offer {
  id: string;
  slotId: string;
  interpreterId: string;
  state: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  expiresAt: number | string;
}

export interface Appointment {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  state: 'draft' | 'cancelled' | 'active';
  slots: Slot[];
  offers: Offer[];
  [key: string]: any; // Allow other properties for legacy data support
}

export function isNeedsReplacementStatus(status?: string | null): boolean {
  return !!status && status.toLowerCase().replace(/[\s_-]+/g, '') === 'needsreplacement';
}

export function getStaffingRatio(appointment: Appointment) {
  const activeSlots = appointment.slots?.filter(s => s.active) || [];
  const totalSlots = activeSlots.length || (appointment.requiredPositions || 1); // fallback to legacy
  const bookedSlots = activeSlots.filter(s => s.reservedBy !== null);
  const bookedCount = bookedSlots.length || (appointment.acceptedInterpretersCount || 0); // fallback
  return { bookedCount, totalSlots, bookedSlots };
}

export function getStaffingLabel(appointment: Appointment, now: number = Date.now()): string {
  if (appointment.state === 'cancelled' || appointment.status?.toLowerCase() === 'cancelled') {
    return 'Cancelled';
  }
  
  const { bookedCount, totalSlots } = getStaffingRatio(appointment);
  const filters = getStatusFilters(appointment, now);
  
  if (isNeedsReplacementStatus(appointment.status)) return 'Needs replacement';

  if (bookedCount === totalSlots && totalSlots > 0) return 'Fully staffed';
  if (filters.hasPendingOffer) return 'Offer awaiting response';
  if (filters.needsReplacement) return 'Needs replacement';
  if (bookedCount > 0) return 'Partially staffed';
  
  return 'Unfilled / draft';
}

export function getStatusFilters(appointment: Appointment, now: number = Date.now()) {
  const { bookedCount, totalSlots } = getStaffingRatio(appointment);
  
  const isPastStart = appointment.startsAt ? now >= new Date(appointment.startsAt).getTime() : false;
  const isPastEnd = appointment.endsAt ? now > new Date(appointment.endsAt).getTime() : false;
  const isCancelled = appointment.state === 'cancelled' || appointment.status?.toLowerCase() === 'cancelled';
  
  const activeSlots = appointment.slots?.filter(s => s.active) || [];
  
  // A pending offer must be active (not expired)
  const hasPendingOffer = (appointment.offers || []).some(o => 
    o.state === 'pending' && (new Date(o.expiresAt).getTime() > now)
  ) || (appointment.pendingOffer === true) || (appointment.status?.toLowerCase().includes('awaiting response'));
  
  const needingCoverage = !isPastStart && !isCancelled && bookedCount < totalSlots && !hasPendingOffer;
  
  const needsReplacement = !isCancelled && (
    isNeedsReplacementStatus(appointment.status) ||
    (activeSlots.some(s => s.needsReplacement && !s.reservedBy) && bookedCount < totalSlots)
  );
  
  const staffFollowUp = !isCancelled && isPastEnd && activeSlots.some(s => s.followUp);

  const fullyStaffed = !isPastStart && !isCancelled && bookedCount === totalSlots && totalSlots > 0;

  return {
    isCancelled,
    isPastStart,
    isPastEnd,
    needingCoverage,
    hasPendingOffer,
    fullyStaffed,
    needsReplacement,
    staffFollowUp
  };
}
