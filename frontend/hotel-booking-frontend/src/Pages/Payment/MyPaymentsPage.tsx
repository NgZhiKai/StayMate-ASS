import React from "react";
import { HeroSection, LoadingSpinner } from "../../components/Misc";
import { Pagination } from "../../components/Pagination";
import { BookingPaymentCard } from "../../components/Payment";
import { useMyPayments, useSmartPagination } from "../../hooks";

const ITEMS_PER_PAGE = 3;

const MyPaymentsPage: React.FC = () => {
  const { loading, payments } = useMyPayments();

  const { currentPage, totalPages, paginatedData, goToPage, pages } =
    useSmartPagination({
      data: payments,
      itemsPerPage: ITEMS_PER_PAGE,
    });

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );

  const hasData = paginatedData.length > 0;

  return (
    <div className="min-h-full bg-gradient-to-tr from-purple-900 via-indigo-900 to-blue-900 select-none">

      <HeroSection
        title="My Payment History"
        highlight="Payment"
        description="View your complete booking payment history in one place."
        align="left"
      />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {!hasData ? (
          <p className="text-gray-300 text-center text-lg">No payments found.</p>
        ) : (
          <>
            <div className="grid gap-6">
              {paginatedData.map((group) => (
                <BookingPaymentCard key={group.bookingId} group={group} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pages={pages}
              goToPage={goToPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MyPaymentsPage;