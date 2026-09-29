export default function WebsiteRequestsPage() {
  return (
    <div className="max-w-[1200px] mx-auto p-6 space-y-6 pb-24 antialiased">
      {/* Top Banner */}
      <div className="rounded-full bg-[#E6EFEA] px-6 py-3.5 text-sm font-medium text-[#385B52] mb-6">
        Test workspace — fictional information only
      </div>

      {/* Header Section */}
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Website requests</h1>
        <p className="text-[15px] text-gray-500 max-w-2xl mt-2 mb-8">
          Guest requests awaiting agency review. No interpreter is confirmed until staff create and staff the appointment.
        </p>
      </div>

      {/* Empty State Card */}
      <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm">
        <svg className="w-8 h-8 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        <h3 className="font-medium text-gray-900 mt-4 text-base">No website requests yet</h3>
        <p className="text-gray-500 text-sm mt-1">
          New requests from the gated ASL Professionals site will appear here.
        </p>
      </div>
    </div>
  );
}
