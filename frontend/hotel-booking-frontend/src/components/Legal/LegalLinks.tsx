import React from "react";

const LegalLinks: React.FC = () => (
  <div className="mt-6 text-center text-gray-400 text-xs">
    By continuing, you agree to our{" "}
    <a href="/stayMate/terms" className="underline text-gray-500 hover:text-gray-700">
      Terms of Service
    </a>{" "}
    and{" "}
    <a href="/stayMate/privacy" className="underline text-gray-500 hover:text-gray-700">
      Privacy Policy
    </a>.
  </div>
);

export default LegalLinks;