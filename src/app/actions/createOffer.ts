"use server";

import { db } from "@/db";
import { offers, requests } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

interface CreateOfferPayload {
  requestId: string;
  interpreterId: string;
  expiresAt: Date;
}

export async function createOffer(payload: CreateOfferPayload) {
  const [newOffer] = await db.insert(offers).values({
    requestId: payload.requestId,
    interpreterId: payload.interpreterId,
    expiresAt: payload.expiresAt,
    status: 'pending'
  }).returning();

  // Also update request status to 'Offer awaiting response'
  await db.update(requests)
    .set({ status: 'Offer awaiting response', updatedAt: new Date() })
    .where(eq(requests.id, payload.requestId));

  revalidatePath(`/requests/${payload.requestId}`);
  revalidatePath('/requests');
  revalidatePath('/dashboard');
  
  return newOffer;
}
