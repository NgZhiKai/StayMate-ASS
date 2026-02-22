import React from "react";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Sticky header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md shadow-md z-10 p-4">
        <h1 className="text-xl font-bold text-gray-800 text-center">Privacy Policy</h1>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-4">
          <p className="text-gray-600">
            Your privacy is important to us. StayMate collects, stores, and uses personal information responsibly.
          </p>

          <p className="text-gray-600">
            <strong>1. Information Collection:</strong> We collect information to provide better service.
          </p>

          <p className="text-gray-600">
            <strong>2. Use of Data:</strong> Your data is used for bookings, notifications, and improving our services.
          </p>

          <p className="text-gray-600">
            <strong>3. Data Sharing:</strong> We do not share your personal data with third parties without consent.
          </p>

          <p className="text-gray-600">
            <strong>4. Cookies & Tracking:</strong> We may use cookies to enhance user experience.
          </p>

          <p className="text-gray-600">
            For any concerns regarding privacy, please contact our support team.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;