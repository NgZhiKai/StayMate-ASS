import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";

import MainLayout from "./layouts/MainLayout";
import HeaderOnlyLayout from "./layouts/HeaderOnlyLayout";

// Pages
import AdminPaymentsPage from "./Pages/AdminPaymentsPage";
import BookedHotelsPage from "./Pages/BookedHotelsPage";
import BookingPage from "./Pages/BookingPage";
import BookmarkedHotelsPage from "./Pages/BookmarkedHotelsPage";
import CreateBookingPage from "./Pages/CreateBookingPage";
import CreateUpdateHotelPage from "./Pages/CreateUpdateHotelPage";
import HomePage from "./Pages/HomePage";
import HotelDetailsPage from "./Pages/HotelDetailsPage";
import LoginPage from "./Pages/LoginPage";
import LogOutPage from "./Pages/LogoutPage";
import ManageBookingsPage from "./Pages/ManageBookingsPage";
import ManageUsersPage from "./Pages/ManageUsersPage";
import MyPaymentsPage from "./Pages/MyPaymentsPage";
import NearMePage from "./Pages/NearMePage";
import NotifcationsPage from "./Pages/NotificationPage";
import PaymentPage from "./Pages/PaymentPage";
import RegisterPage from "./Pages/RegisterPage";
import SignInPage from "./Pages/SignInPage";
import UserAccountSettings from "./Pages/UserAccountSettings";
import VerifyEmailPage from "./Pages/VerficationPage";

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  return (
    <AuthProvider>
      <NotificationProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <Routes>
            {/* Auth pages: standalone, header only */}
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

            {/* Main app pages with header + sidebar */}
            <Route
              path="/*"
              element={<MainLayout/>}
            >
              <Route index element={<HomePage />} />
              <Route path="hotel/:id" element={<HotelDetailsPage />} />
              <Route path="create-hotel/:id?" element={<CreateUpdateHotelPage />} />
              <Route path="create-bookings/:hotelId" element={<CreateBookingPage />} />
              <Route path="nearme" element={<NearMePage />} />
              <Route path="user-account-settings" element={<UserAccountSettings />} />
              <Route path="logout" element={<LogOutPage />} />
              <Route path="admin/users" element={<ManageUsersPage />} />
              <Route path="admin/bookings" element={<ManageBookingsPage />} />
              <Route path="bookings" element={<BookingPage />} />
              <Route path="booked-hotels" element={<BookedHotelsPage />} />
              <Route path="notifications" element={<NotifcationsPage />} />
              <Route path="my-payments" element={<MyPaymentsPage />} />
              <Route path="admin/payments" element={<AdminPaymentsPage />} />
              <Route path="payment" element={<PaymentPage />} />
              <Route path="bookmarked-hotels" element={<BookmarkedHotelsPage />} />
            </Route>
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;