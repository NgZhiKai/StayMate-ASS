import React, { useState } from "react";
import { HeroSection, LoadingSpinner } from "../../components/Misc";
import { Pagination } from "../../components/Pagination";
import { AdminPaymentCard } from "../../components/Payment/AdminPaymentCard";
import { useGroupedPayments } from "../../hooks/useGroupedPayments";

const ITEMS_PER_PAGE = 5;

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
    <div className="min-h-full bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50 select-none">
      <HeroSection
        title="All Payments Overview"
        highlight="Payments"
        description="View and monitor all booking payments made by users."
        align="left"
      />

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        {currentPayments.length === 0 ? (
          <p className="text-gray-300 text-center text-lg">No payments found.</p>
        ) : (
          currentPayments.map((g) => (
            <AdminPaymentCard key={g.bookingId} group={g} formatDate={formatDate} />
          ))
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