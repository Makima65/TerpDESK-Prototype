import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Webhook receiver for the AWS Lambda email forwarder.
 * Lambda POSTs each inbound domain email as JSON: { email, subject, rawContent }.
 */
interface InboundEmailPayload {
  email: string;
  subject: string;
  rawContent: string;
}

interface WebhookSuccessResponse {
  success: true;
  received: { email: string; subject: string; contentLength: number };
}

interface WebhookErrorResponse {
  success: false;
  error: string;
  invalidFields?: (keyof InboundEmailPayload)[];
}

const REQUIRED_FIELDS: readonly (keyof InboundEmailPayload)[] = ["email", "subject", "rawContent"];

/**
 * Constant-time comparison. Both values are SHA-256 hashed first so the buffers
 * are always equal length (timingSafeEqual throws otherwise) and length isn't leaked.
 */
function isValidApiKey(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

function validatePayload(
  body: unknown
): { ok: true; data: InboundEmailPayload } | { ok: false; invalidFields: (keyof InboundEmailPayload)[] } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, invalidFields: [...REQUIRED_FIELDS] };
  }

  const record = body as Record<string, unknown>;
  const invalidFields = REQUIRED_FIELDS.filter((field) => typeof record[field] !== "string");

  if (invalidFields.length > 0) {
    return { ok: false, invalidFields };
  }

  return {
    ok: true,
    data: {
      email: record.email as string,
      subject: record.subject as string,
      rawContent: record.rawContent as string,
    },
  };
}

export async function POST(
  req: Request
): Promise<NextResponse<WebhookSuccessResponse | WebhookErrorResponse>> {
  try {
    const expectedSecret = process.env.INTAKE_WEBHOOK_SECRET;
    if (!expectedSecret) {
      // Fail closed: never accept traffic when the secret isn't configured.
      console.error("[Intake Webhook] INTAKE_WEBHOOK_SECRET is not set — rejecting request.");
      return NextResponse.json({ success: false, error: "Webhook is not configured." }, { status: 500 });
    }

    if (!isValidApiKey(req.headers.get("x-api-key"), expectedSecret)) {
      console.warn("[Intake Webhook] Unauthorized request (missing or invalid x-api-key).");
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      // Malformed JSON will never succeed on retry — reject as a client error.
      return NextResponse.json({ success: false, error: "Request body must be valid JSON." }, { status: 400 });
    }

    const validation = validatePayload(body);
    if (!validation.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Payload must include string fields: email, subject, rawContent.",
          invalidFields: validation.invalidFields,
        },
        { status: 400 }
      );
    }

    const { email, subject, rawContent } = validation.data;

    // Verification log for the live AWS trigger. rawContent is intentionally not logged (may contain PII).
    console.log("[Intake Webhook] Inbound email received", {
      email,
      subject,
      contentLength: rawContent.length,
      receivedAt: new Date().toISOString(),
    });

    // TODO: Insert into PostgreSQL via Drizzle here.
    //   - Route by sender/subject (e.g. ODHH emails -> reuse the parser in /api/intake/odhh).
    //   - db.insert(requests).values({ title, status: 'draft', data }).returning({ id: requests.id })
    //   - revalidatePath('/requests'); revalidatePath('/dashboard');

    return NextResponse.json(
      {
        success: true,
        received: { email, subject, contentLength: rawContent.length },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Intake Webhook] Failed to process inbound email:", error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
