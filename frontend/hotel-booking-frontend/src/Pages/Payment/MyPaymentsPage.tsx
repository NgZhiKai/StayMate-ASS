import React from "react";
import { LoadingSpinner } from "../../components/Misc";
import { BookingPaymentCard, PaymentsPagination } from "../../components/Payment";
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
    <div className="min-h-full py-10 px-6 bg-gradient-to-tr from-purple-900 via-indigo-900 to-blue-900 select-none">
      <h2 className="text-white text-4xl font-bold text-center mb-10">
        My Payment History
      </h2>

      {!hasData ? (
        <p className="text-gray-300 text-center text-lg">
          No payments found.
        </p>
      ) : (
        <>
          <div className="grid gap-6">
            {paginatedData.map((group) => (
              <BookingPaymentCard key={group.bookingId} group={group} />
            ))}
          </div>

          <PaymentsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pages={pages}
            goToPage={goToPage}
          />
        </>
      )}
    </div>
  );
};

export default MyPaymentsPage;