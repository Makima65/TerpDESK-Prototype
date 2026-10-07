"use server";

import { db } from "@/db";
import { requests, offers, interpreters } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function fetchInterpreterOffers(interpreterEmail: string = 'interpreter@example.com') {
  // Find interpreter by email
  const interpreterRows = await db.select().from(interpreters).where(eq(interpreters.email, interpreterEmail));
  if (!interpreterRows.length) return [];
  const interpreter = interpreterRows[0];

  // Join offers with requests
  const offersData = await db.select({
    offer: offers,
    request: requests,
  })
  .from(offers)
  .innerJoin(requests, eq(offers.requestId, requests.id))
  .where(eq(offers.interpreterId, interpreter.id));

  return offersData.map(row => ({
    id: row.offer.id,
    requestId: row.request.id,
    title: row.request.title,
    startsAt: row.request.createdAt.toISOString(),
    endsAt: new Date(row.request.createdAt.getTime() + 3600000).toISOString(),
    status: row.offer.status,
    requestStatus: row.request.status,
    agencyName: "Fictional Agency", // Placeholder
    interpreterId: row.offer.interpreterId,
  }));
}
