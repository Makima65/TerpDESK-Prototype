"use server";

import { db } from "@/db";
import { requests, offers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateOfferStatus(offerId: string, status: 'accepted' | 'declined' | 'withdrawn') {
  // Update offer
  const updatedOffers = await db.update(offers)
    .set({ status, updatedAt: new Date() })
    .where(eq(offers.id, offerId))
    .returning();

  if (!updatedOffers.length) {
    throw new Error("Offer not found");
  }

  const offer = updatedOffers[0];

  // If accepted, update the parent request status
  if (status === 'accepted') {
    await db.update(requests)
      .set({ status: 'assigned', updatedAt: new Date() })
      .where(eq(requests.id, offer.requestId));
  }

  // If withdrawn, update the parent request status back to Unfilled
  if (status === 'withdrawn') {
    await db.update(requests)
      .set({ status: 'Unfilled / draft', updatedAt: new Date() })
      .where(eq(requests.id, offer.requestId));
  }

  revalidatePath('/interpreter-home');
  revalidatePath('/jobs');
  revalidatePath(`/requests/${offer.requestId}`);
  return offer;
}
