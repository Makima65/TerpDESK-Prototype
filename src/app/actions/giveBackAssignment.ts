"use server";

import { db } from "@/db";
import { requests, offers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function giveBackAssignment(offerId: string, requestId: string, reason: string) {
  await db.transaction(async (tx) => {
    // Update offer to 'returned'
    await tx.update(offers)
      .set({ status: 'returned', updatedAt: new Date() })
      .where(eq(offers.id, offerId));

    // Update request to 'Needs replacement'
    await tx.update(requests)
      .set({ status: 'Needs replacement', updatedAt: new Date() })
      .where(eq(requests.id, requestId));
  });

  // Revalidate routes to instantly update UI
  revalidatePath('/jobs');
  revalidatePath('/interpreter-home');
  revalidatePath('/dashboard');
  revalidatePath(`/requests/${requestId}`);
}
