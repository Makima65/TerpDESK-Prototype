"use server";

import { db } from "@/db";
import { requests, offers, interpreters } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function fetchLiveRequests() {
  const dbRows = await db.select().from(requests).orderBy(desc(requests.createdAt));
  const allOffers = await db.select().from(offers);
  
  return dbRows.map(row => {
    const requestOffers = allOffers.filter(o => o.requestId === row.id);
    const hasAcceptedOffer = requestOffers.some(o => o.status === 'accepted');
    
    return {
      id: row.id,
    title: row.title,
    status: row.status,
    data: row.data,
    timestamp: row.createdAt.getTime(),
    dateString: row.createdAt.toLocaleDateString(),
    requester: row.data?.requester || { org: row.data?.intake?.program || "General" },
    details: row.data?.details || { format: "Virtual", timeZone: "America/Los_Angeles" },
    onsite: row.data?.onsite || { venue: "No location specified" },
    overview: row.data?.overview,
    prepNotes: row.data?.prepNotes,
    privateNotes: row.data?.privateNotes,
    startsAt: row.createdAt.toISOString(),
    endsAt: new Date(row.createdAt.getTime() + 3600000).toISOString(),
      slots: [],
      offers: requestOffers,
      hasAcceptedOffer,
      canceledAt: row.canceledAt ? row.canceledAt.toISOString() : null,
      cancelReason: row.cancelReason
    };
  });
}

export async function fetchLiveRequestById(id: string) {
  const dbRows = await db.select().from(requests).where(eq(requests.id, id));
  if (!dbRows || dbRows.length === 0) return null;
  const row = dbRows[0];
  
  const requestOffers = await db.select({
    id: offers.id,
    interpreterId: offers.interpreterId,
    interpreterName: interpreters.name,
    state: offers.status,
    expiresAt: offers.expiresAt
  })
  .from(offers)
  .leftJoin(interpreters, eq(offers.interpreterId, interpreters.id))
  .where(eq(offers.requestId, id));

  const mappedOffers = requestOffers.map(o => ({
    id: o.id,
    interpreterId: o.interpreterId,
    interpreterName: o.interpreterName || 'Unknown Interpreter',
    state: o.state,
    expiresAt: o.expiresAt.toISOString()
  }));

  return {
    id: row.id,
    title: row.title,
    status: row.status,
    data: row.data,
    timestamp: row.createdAt.getTime(),
    dateString: row.createdAt.toLocaleDateString(),
    requester: row.data?.requester || { org: row.data?.intake?.program || "General" },
    details: row.data?.details || { format: "Virtual", timeZone: "America/Los_Angeles" },
    onsite: row.data?.onsite || { venue: "No location specified" },
    overview: row.data?.overview,
    prepNotes: row.data?.prepNotes,
    privateNotes: row.data?.privateNotes,
    startsAt: row.createdAt.toISOString(),
    endsAt: new Date(row.createdAt.getTime() + 3600000).toISOString(),
    slots: [],
    offers: mappedOffers,
    canceledAt: row.canceledAt ? row.canceledAt.toISOString() : null,
    cancelReason: row.cancelReason
  };
}
