"use server";

import { db } from "@/db";
import { requests, RequestData } from "@/db/schema";
import { revalidatePath } from "next/cache";

interface CreateRequestPayload {
  title: string;
  startsAt: Date;
  endsAt: Date;
  data: RequestData;
}

export async function createRequest(payload: CreateRequestPayload) {
  const [newRequest] = await db.insert(requests).values({
    title: payload.title,
    status: 'draft',
    createdAt: payload.startsAt,
    data: payload.data
  }).returning({ id: requests.id });

  revalidatePath('/requests');
  revalidatePath('/dashboard');
  
  return newRequest.id;
}
