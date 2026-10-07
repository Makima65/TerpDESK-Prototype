"use server";

import { db } from "@/db";
import { requests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function submitInterpreterHours(
  requestId: string,
  actualStartTime: string,
  actualEndTime: string,
  miles: number
): Promise<{ success: boolean }> {
  await db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ data: requests.data })
      .from(requests)
      .where(eq(requests.id, requestId));

    if (!existing) {
      throw new Error("Request not found");
    }

    await tx
      .update(requests)
      .set({
        status: "awaiting_review",
        data: {
          ...existing.data,
          hoursSubmission: {
            actualStartTime,
            actualEndTime,
            miles,
            submittedAt: new Date().toISOString(),
          },
        },
        updatedAt: new Date(),
      })
      .where(eq(requests.id, requestId));
  });

  revalidatePath("/jobs");
  revalidatePath("/interpreter-home");
  revalidatePath("/dashboard");
  revalidatePath("/hours-review");
  revalidatePath(`/requests/${requestId}`);

  return { success: true };
}
