export default function BillingPage() {
  return (
    <div className="max-w-[1200px] mx-auto p-6 space-y-6 pb-24 antialiased">
      {/* Top Banner */}
      <div className="rounded-full bg-[#E6EFEA] px-6 py-3.5 text-sm font-medium text-[#385B52] mb-6">
        Test workspace — fictional information only
      </div>

      {/* Deferred Workflow Card */}
      <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">This workflow is deferred</h2>
        <p className="text-gray-600 text-[15px] leading-relaxed max-w-4xl">
          This connected workspace supports appointments, offers, acceptance and private busy time. Billing, integrations and other workflows are not connected. The original demo remains available through the standard demo build.
        </p>
      </div>
    </div>
  );
}
