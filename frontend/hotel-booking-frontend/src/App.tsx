import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { BookingProvider } from "./contexts/BookingContext";
import { NotificationProvider } from "./contexts/NotificationContext";

import HeaderOnlyLayout from "./layouts/HeaderOnlyLayout";
import MainLayout from "./layouts/MainLayout";

// Pages
import AdminPaymentsPage from "./Pages/AdminPaymentsPage";
import LoginPage from "./Pages/Auth/LoginPage";
import LogOutPage from "./Pages/Auth/LogoutPage";
import RegisterPage from "./Pages/Auth/RegisterPage";
import ResetPasswordPage from "./Pages/Auth/ResetPasswordPage";
import SignInPage from "./Pages/Auth/SignInPage";
import VerifyEmailPage from "./Pages/Auth/VerifyEmailPage";
import VerifyResetTokenPage from "./Pages/Auth/VerifyResetTokenPage";
import BookingPage from "./Pages/Booking/BookingPage";
import CreateBookingPage from "./Pages/Booking/CreateBookingPage";
import BookmarkedHotelsPage from "./Pages/BookmarkedHotels/BookmarkedHotelsPage";
import HomePage from "./Pages/Home/HomePage";
import CreateUpdateHotelPage from "./Pages/Hotel/CreateUpdateHotelPage";
import HotelDetailsPage from "./Pages/Hotel/HotelDetailsPage";
import PrivacyPolicyPage from "./Pages/Legal/PrivacyPolicyPage";
import TermsOfServicePage from "./Pages/Legal/TermsOfServicePage";
import ManageBookingsPage from "./Pages/ManageBookingsPage";
import NearMePage from "./Pages/NearMe/NearMePage";
import NotifcationsPage from "./Pages/Notification/NotificationPage";
import MyPaymentsPage from "./Pages/Payment/MyPaymentsPage";
import PaymentPage from "./Pages/Payment/PaymentPage";
import SelectPaymentPage from "./Pages/Payment/SelectPaymentPage";
import SearchResultsPage from "./Pages/SearchResults/SearchResultsPage";
import ManageUsersPage from "./Pages/User/ManageUsersPage";
import UserAccountSettings from "./Pages/User/UserAccountSettings";

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  const userIdStr = sessionStorage.getItem("userId");
  const userId = userIdStr ? Number(userIdStr) : null;

  return (
    <AuthProvider>
      {/* Always wrap BookingProvider even if userId is null */}
      <BookingProvider userId={userId}>
        <NotificationProvider>
          <Router basename={import.meta.env.BASE_URL}>
            <AppRoutes />
          </Router>
        </NotificationProvider>
      </BookingProvider>
    </AuthProvider>
  );
};

const AppRoutes: React.FC = () => (
  <Routes>
    {/* Auth-only pages */}
    <Route
      path="/signin"
      element={
        <HeaderOnlyLayout>
          <SignInPage />
        </HeaderOnlyLayout>
      }
    />
    <Route
      path="/login"
      element={
        <HeaderOnlyLayout>
          <LoginPage />
        </HeaderOnlyLayout>
      }
    />
    <Route
      path="/register"
      element={
        <HeaderOnlyLayout>
          <RegisterPage />
        </HeaderOnlyLayout>
      }
    />
    <Route
      path="/verify"
      element={
        <HeaderOnlyLayout>
          <VerifyEmailPage />
        </HeaderOnlyLayout>
      }
    />
    <Route
      path="/terms"
      element={
        <HeaderOnlyLayout>
          <TermsOfServicePage />
        </HeaderOnlyLayout>
      }
    />
    <Route
      path="/privacy"
      element={
        <HeaderOnlyLayout>
          <PrivacyPolicyPage />
        </HeaderOnlyLayout>
      }
    />
    <Route
      path="/verify-reset-token"
      element={
        <HeaderOnlyLayout>
          <VerifyResetTokenPage />
        </HeaderOnlyLayout>
      }
    />
    <Route
      path="/reset-password"
      element={
        <HeaderOnlyLayout>
          <ResetPasswordPage />
        </HeaderOnlyLayout>
      }
    />

    {/* Main app pages */}
    <Route path="/*" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="hotel/:id" element={<HotelDetailsPage />} />
      <Route path="create-hotel/:id?" element={<CreateUpdateHotelPage />} />
      <Route path="create-bookings/:hotelId" element={<CreateBookingPage />} />
      <Route path="nearme" element={<NearMePage />} />
      <Route path="user-account-settings" element={<UserAccountSettings />} />
      <Route path="search" element={<SearchResultsPage />} />
      <Route path="logout" element={<LogOutPage />} />
      <Route path="admin/users" element={<ManageUsersPage />} />
      <Route path="admin/bookings" element={<ManageBookingsPage />} />
      <Route path="bookings" element={<BookingPage />} />
      <Route path="notifications" element={<NotifcationsPage />} />
      <Route path="my-payments" element={<MyPaymentsPage />} />
      <Route path="admin/payments" element={<AdminPaymentsPage />} />
      <Route path="payments/:bookingId" element={<PaymentPage />} />
      <Route path="bookmarked-hotels" element={<BookmarkedHotelsPage />} />
      <Route path="select-payment" element={<SelectPaymentPage />} />
    </Route>
  </Routes>
);

export default App;