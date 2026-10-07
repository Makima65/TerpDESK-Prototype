"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface IngestSuccessResponse {
  success: true;
  id: string;
  parsed: {
    srn: string;
    date: string;
    startTime: string;
    endTime: string;
    locationName: string;
    locationAddress: string;
    requestorName: string | null;
    startsAt: string;
    endsAt: string;
  };
}

interface IngestErrorResponse {
  success: false;
  error: string;
  missingFields?: string[];
}

type IngestResponse = IngestSuccessResponse | IngestErrorResponse;

interface EmailIngestTesterProps {
  /** Called after a job is created so client-fetched lists can reload. */
  onIngested?: (requestId: string) => void | Promise<void>;
}

function buildSampleEmail(): string {
  // Future date so the new draft shows up in "Needs attention" during the demo.
  const today = new Date();
  const appt = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  const srn = String(20226000 + Math.floor(Math.random() * 1000));

  return [
    `Date of Interpreter Request - ${fmt(today)}`,
    `Service Request #${srn}`,
    `Requestor Name: Berle Ross`,
    `Appointment Date: ${fmt(appt)}`,
    `Appointment Start Time: 8:00 AM`,
    `Appointment End Time: 9:00 AM`,
    `Location: ALTSA HQ`,
    `Address: 4450 10th Avenue SE Lacey, Washington 98504`,
  ].join("\n");
}

export default function EmailIngestTester({ onIngested }: EmailIngestTesterProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [rawEmailText, setRawEmailText] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [lastSuccess, setLastSuccess] = React.useState<IngestSuccessResponse | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const close = React.useCallback(() => {
    if (isSubmitting) return;
    setIsOpen(false);
    setError(null);
  }, [isSubmitting]);

  React.useEffect(() => {
    if (!isOpen) return;
    textareaRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!rawEmailText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/intake/odhh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawEmailText }),
      });
      const json = (await res.json()) as IngestResponse;

      if (!res.ok || !json.success) {
        const err = json as IngestErrorResponse;
        const missing = err.missingFields?.length ? ` Missing: ${err.missingFields.join(", ")}.` : "";
        setError(`${err.error ?? `Request failed (${res.status}).`}${missing}`);
        return;
      }

      setLastSuccess(json);
      setRawEmailText("");
      setIsOpen(false);
      await onIngested?.(json.id);
      router.refresh();
    } catch (err) {
      console.error("[EmailIngestTester]", err);
      setError("Network error — could not reach the intake endpoint.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-amber-300/80 bg-amber-50/60 px-5 py-3">
        <span className="rounded-full bg-amber-200/80 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-amber-900">
          DEMO
        </span>
        <p className="text-[13px] text-amber-900/80">ODHH email intake pipeline</p>
        <button
          id="email-ingest-open"
          type="button"
          onClick={() => {
            setLastSuccess(null);
            setIsOpen(true);
          }}
          className="ml-auto rounded-full border border-amber-300 bg-white px-4 py-1.5 text-[13px] font-medium text-amber-900 transition-colors hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
        >
          Simulate Inbound ODHH Email
        </button>
        {lastSuccess && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full text-[12px] text-[#385B52]"
          >
            ✓ Created draft for SRN #{lastSuccess.parsed.srn} — {lastSuccess.parsed.locationName} ({lastSuccess.parsed.date},{" "}
            {lastSuccess.parsed.startTime}–{lastSuccess.parsed.endTime}).{" "}
            <a href={`/requests/${lastSuccess.id}`} className="font-medium underline underline-offset-2">
              Open request
            </a>
          </motion.p>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="email-ingest-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="email-ingest-title"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-[560px] rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
            >
              <div className="mb-1 flex items-center gap-2">
                <h2 id="email-ingest-title" className="text-[18px] font-medium text-[var(--ink)]">
                  Simulate inbound ODHH email
                </h2>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold tracking-widest text-amber-900">
                  DEV TOOL
                </span>
              </div>
              <p className="mb-4 text-[13px] text-[var(--sage)]">
                Paste the raw email body. It is sent to <code className="rounded bg-[#F4F3EF] px-1">/api/intake/odhh</code> and
                saved as a draft request.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  id="email-ingest-textarea"
                  ref={textareaRef}
                  value={rawEmailText}
                  onChange={(e) => setRawEmailText(e.target.value)}
                  disabled={isSubmitting}
                  rows={10}
                  spellCheck={false}
                  placeholder={"Service Request #20226737\nAppointment Date: 12/15/2021\nAppointment Start Time: 8:00 AM\n..."}
                  className="w-full resize-none rounded-2xl border-none bg-[#F4F3EF] p-4 font-mono text-[12.5px] leading-relaxed text-gray-800 outline-none transition-shadow focus:ring-2 focus:ring-[#0B3B32] disabled:opacity-60"
                />

                {error && (
                  <p id="email-ingest-error" role="alert" className="rounded-xl bg-[#F9ECEA] px-4 py-2.5 text-[13px] text-[#AF4A3F]">
                    {error}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    id="email-ingest-load-sample"
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setRawEmailText(buildSampleEmail());
                      setError(null);
                    }}
                    className="text-[13px] font-medium text-[var(--sage)] underline underline-offset-2 transition-colors hover:text-[var(--ink)] disabled:opacity-50"
                  >
                    Load sample email
                  </button>
                  <div className="ml-auto flex gap-2">
                    <button
                      id="email-ingest-cancel"
                      type="button"
                      onClick={close}
                      disabled={isSubmitting}
                      className="rounded-full px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      id="email-ingest-submit"
                      type="submit"
                      disabled={isSubmitting || !rawEmailText.trim()}
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--forest)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0B3B32]/50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting && (
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      )}
                      {isSubmitting ? "Parsing…" : "Parse & Create Job"}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
