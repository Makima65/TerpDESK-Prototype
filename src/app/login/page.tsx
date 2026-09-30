import { Logo } from "@/components/logo";
import { LoginForm } from "@/components/login-form";
import Link from "next/link";

export default function LoginPage() {
 return (
 <div className="min-h-[100dvh] w-full bg-[var(--canvas)] flex flex-col items-center justify-center p-4 font-sans text-[var(--ink)]">
 {/* Header Section */}
 <div className="mb-4 flex flex-col items-center text-center">
 <Logo className="mb-2" />
 <p className="text-lg lg:text-xl text-slate-700">
 Your interpreting business. One place.
 </p>
 </div>

 {/* Main Card */}
 <div className="w-full max-w-[90vw] lg:max-w-md rounded-2xl border border-neutral-100 bg-white p-6 lg:p-8 ">
 <p className="mb-6 text-xs lg:text-sm leading-relaxed text-[var(--sage)]">
 Approved accounts and fictional records only. Scheduling,
 offers, private busy time and prep materials are saved. Billing,
 integrations and notifications are unavailable.
 </p>

 <LoginForm />

 {/* Links inside card */}
 <div className="mt-6 space-y-4 text-xs lg:text-sm leading-relaxed text-[var(--sage)]">
 <p>
 New interpreter?{" "}
 <Link
 href="/register"
 className="text-[var(--sage)] underline decoration-slate-300 underline-offset-4 hover:text-slate-800"
 >
 Create an interpreter account
 </Link>{" "}
 — in preview testing only, and it gives you a profile, not agency access.
 </p>
 <p>
 <Link
 href="/reset-password"
 className="text-[var(--sage)] underline decoration-slate-300 underline-offset-4 hover:text-slate-800"
 >
 Email me a password reset link
 </Link>
 </p>
 </div>
 </div>

 {/* Footer Link */}
 <div className="mt-6 text-center text-xs lg:text-sm text-slate-700">
 <p>
 Curious about terpDESK?{" "}
 <Link
 href="/demo"
 className="font-medium text-slate-700 underline decoration-slate-400 underline-offset-4 hover:text-[var(--ink)]"
 >
 Explore the demo
 </Link>{" "}
 — fictional sample data, nothing saved.
 </p>
 </div>
 </div>
 );
}
