import React, { useState } from "react";
import { HeroSection, LoadingSpinner } from "../../components/Misc";
import { Pagination } from "../../components/Pagination";
import { AdminPaymentCard } from "../../components/Payment/AdminPaymentCard";
import { useGroupedPayments } from "../../hooks/useGroupedPayments";

const ITEMS_PER_PAGE = 6;

const AdminPaymentsPage: React.FC = () => {
  const { groupedPayments, loading, error } = useGroupedPayments();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(groupedPayments.length / ITEMS_PER_PAGE);
  const currentPayments = groupedPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-full p-6 text-red-500">
        {error}
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-purple-50 via-pink-50 to-white min-h-full text-gray-900 select-none">
      <HeroSection
        title="All Payments Overview"
        highlight="Payments"
        description="View and monitor all booking payments made by users."
        align="left"
      />

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        {currentPayments.length === 0 ? (
          <p className="text-gray-400 text-center text-lg">No payments found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPayments.map((g) => (
              <AdminPaymentCard key={g.bookingId} group={g} formatDate={formatDate} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pages={Array.from({ length: totalPages }, (_, i) => i + 1)}
            goToPage={goToPage}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPaymentsPage;