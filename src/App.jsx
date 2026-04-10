import React from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom";

import Hero from "./pages/Hero";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import BookingPage from "./pages/BookingPage";
import MyBookings from "./pages/MyBookings";

import ManagerDashboard from "./pages/ManagerDashboard";
import AddTrip from "./pages/AddTrip";

import { ProtectedRoute } from "./components/ProtectedRoute";
import AuthProvider, { useAuth } from "./context/AuthContext.jsx";
import Header from "./components/Header.jsx";
import ContactUs from "./pages/ContactUs";
import OurDestinations from "./pages/OurDestinations";
import Footer from "./components/Footer";
import ManageTrips from "./pages/ManageTrips";
import EditTrip from "./pages/EditTrip";
import ForgotPassword from "./pages/ForgotPassword";
import { Toaster } from "sonner";

const AuthInitializer = ({ children }) => {
  const navigate = useNavigate();
  return <AuthProvider navigate={navigate}>{children}</AuthProvider>;
};

const AppContent = () => {
  const { user, hasRole, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-2xl text-primary-dark">
        جاري تحميل التطبيق...
      </div>
    );
  }

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && hasRole("manager") ? (
              <Navigate to="/manager-dashboard" replace />
            ) : (
              <Hero />
            )
          }
        />

        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              {isAuthenticated && hasRole("manager") ? (
                <Navigate to="/manager-dashboard" replace />
              ) : (
                <BookingPage />
              )}
            </ProtectedRoute>
          }
        />
        <Route path="/contact" element={<ContactUs />} />
        <Route
          path="/destinations"
          element={
            <ProtectedRoute>
              {isAuthenticated && hasRole("manager") ? (
                <Navigate to="/manager-dashboard" replace />
              ) : (
                <OurDestinations />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              {isAuthenticated && hasRole("manager") ? (
                <Navigate to="/manager-dashboard" replace />
              ) : (
                <MyBookings />
              )}
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset_password/:uid/:token" element={<ForgotPassword />} />
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute>
              {user && hasRole("manager") ? (
                <ManagerDashboard />
              ) : (
                <Navigate to="/" replace />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/add-trip"
          element={
            <ProtectedRoute>
              {user && hasRole("manager") ? (
                <AddTrip />
              ) : (
                <Navigate to="/manager-dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/manage-trips"
          element={
            <ProtectedRoute>
              {user && hasRole("manager") ? (
                <ManageTrips />
              ) : (
                <Navigate to="/manager-dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/edit-trip/:id"
          element={
            <ProtectedRoute>
              {user && hasRole("manager") ? (
                <EditTrip />
              ) : (
                <Navigate to="/manager-dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthInitializer>
        <AppContent />
      </AuthInitializer>
    </BrowserRouter>
  );
};

export default App;
