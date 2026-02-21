import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";

import HeaderOnlyLayout from "./layouts/HeaderOnlyLayout";
import MainLayout from "./layouts/MainLayout";

// Pages
import AdminPaymentsPage from "./Pages/AdminPaymentsPage";
import BookedHotelsPage from "./Pages/BookedHotelsPage";
import BookingPage from "./Pages/Booking/BookingPage";
import BookmarkedHotelsPage from "./Pages/BookmarkedHotelsPage";
import CreateBookingPage from "./Pages/Booking/CreateBookingPage";
import HomePage from "./Pages/HomePage";
import CreateUpdateHotelPage from "./Pages/Hotel/CreateUpdateHotelPage";
import HotelDetailsPage from "./Pages/Hotel/HotelDetailsPage";
import ManageBookingsPage from "./Pages/ManageBookingsPage";
import MyPaymentsPage from "./Pages/MyPaymentsPage";
import NearMePage from "./Pages/NearMe/NearMePage";
import NotifcationsPage from "./Pages/Notification/NotificationPage";
import PaymentPage from "./Pages/PaymentPage";
import LoginPage from "./Pages/SignIn/LoginPage";
import LogOutPage from "./Pages/SignIn/LogoutPage";
import RegisterPage from "./Pages/SignIn/RegisterPage";
import SignInPage from "./Pages/SignIn/SignInPage";
import VerifyEmailPage from "./Pages/SignIn/VerficationPage";
import SearchResultsPage from "./Pages/Hotel/SearchResultsPage";
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
              <Route path="search" element={<SearchResultsPage />} />
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