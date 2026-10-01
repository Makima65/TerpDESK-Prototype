"use client";

import { motion } from "framer-motion";

export default function BillingPage() {
 return (
 <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-[1200px] mx-auto p-6 space-y-6 pb-24 antialiased">
 {/* Top Banner */}
 {/* Deferred Workflow Card */}
 <div className="bg-white rounded-2xl border border-gray-200 p-6 border border-gray-200 mt-6">
 <h2 className="text-lg font-semibold text-[var(--ink)] mb-3">This workflow is deferred</h2>
 <p className="text-gray-600 text-[15px] leading-relaxed max-w-4xl">
 This connected workspace supports appointments, offers, acceptance and private busy time. Billing, integrations and other workflows are not connected. The original demo remains available through the standard demo build.
 </p>
 </div>
 </motion.div>
 );
}
