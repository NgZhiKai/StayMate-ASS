import React from "react";

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Sticky header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md shadow-md z-10 p-4">
        <h1 className="text-xl font-bold text-gray-800 text-center">Terms of Service</h1>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-4">
          <p className="text-gray-600">
            Welcome to StayMate. By using our services, you agree to the following terms and conditions.
          </p>

          <p className="text-gray-600">
            <strong>1. Use of Service:</strong> You must follow all rules and policies of StayMate when using our platform.
          </p>

          <p className="text-gray-600">
            <strong>2. Accounts:</strong> You are responsible for keeping your account secure and accurate.
          </p>

          <p className="text-gray-600">
            <strong>3. Payments:</strong> All payments are final and subject to our payment policies.
          </p>

          <p className="text-gray-600">
            <strong>4. Liability:</strong> StayMate is not responsible for indirect or unforeseen damages resulting from the use of our services.
          </p>

          <p className="text-gray-600">
            For full terms and updates, please visit our website or contact support.
          </p>
        </div>
      </main>
    </div>
  );
};

export default TermsOfServicePage;