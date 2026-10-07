"use server";

import { db } from "@/db";
import { requests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function cancelRequest(id: string, reason?: string) {
  const [updated] = await db.update(requests)
    .set({ status: 'Cancelled', canceledAt: new Date(), cancelReason: reason, updatedAt: new Date() })
    .where(eq(requests.id, id))
    .returning();

  revalidatePath(`/requests/${id}`);
  revalidatePath('/dashboard');
  revalidatePath('/requests');
  revalidatePath('/calendar');

  return updated;
}
