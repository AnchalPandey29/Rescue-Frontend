// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./AuthContext";
import HomePage from "./component/HomePage";
import AppBarComponent from "./component/AppBarComponent";
import Footer from "./component/Footer";
import AboutUs from "./component/AboutUs";
import SignupPage from "./component/SignupPage";
import LoginPage from "./component/LoginPage";
import Dashboard from "./component/Dashboard";
import Layout from "./component/Layout";
import ReportEmergency from "./component/ReportEmergency";
import EmergencyMap from "./component/EmergencyMap";
import VolunteerDashboard from "./component/VolunteerDashboard";
import Profile from "./component/Profile";
import EmergencyTracking from "./component/EmergencyTracking";
import VolunteerHistory from "./component/VolunteerHistory";
import UserEmergencyReports from "./component/UserEmergencyReports";
import EmergencyContacts from "./component/EmergencyContacts";
import FirstAidGuide from "./component/FirstAidGuide";
import DisasterPreparednessTips from "./component/DisasterPreparednessTips";
import Chatbot from "./component/Chatbot"; // Import Chatbot
import DonationFrontPage from "./component/DonationFrontPage";
import DonationPaymentPage from "./component/DonationPayementPage";
import ThanksPage from "./component/ThanksPage";
import Notification from "./component/Notification";
import RedeemIntroduction from "./component/redeem/RedeemIntroduction";
import SelectWithdrawalMode from "./component/redeem/SelectWithdrawalMode";
import WithdrawBank from "./component/redeem/WithdrawBank";
import WithdrawWallet from "./component/redeem/WithdrawWallet";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// Public Route Component (blocks logged-in users)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppBarComponent />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <HomePage />
              </PublicRoute>
            }
          />
          <Route
            path="/aboutus"
            element={
              <PublicRoute>
                <AboutUs />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="report" element={<ReportEmergency />} />
            <Route path="emergency/:emergencyId" element={<EmergencyTracking />} />
            <Route path="myreports" element={<UserEmergencyReports />} />
            <Route path="map" element={<EmergencyMap />} />
            <Route path="volunteer" element={<VolunteerDashboard />} />
            <Route path="volunteer/history" element={<VolunteerHistory />} />
            <Route path="emergencycontacts" element={<EmergencyContacts />} />
            <Route path="firstaidguide" element={<FirstAidGuide />} />
            <Route path="preparednesstips" element={<DisasterPreparednessTips />} />
            {/* Removed Chatbot from here */}
            <Route path="donation" element={<DonationFrontPage />} />
            <Route path="payment" element={<DonationPaymentPage />} />
            <Route path="thanks" element={<ThanksPage />} />
            <Route path="notification" element={<Notification />} />
            <Route path="redeem" element={<RedeemIntroduction />} />
            <Route path="redeem/select-mode" element={<SelectWithdrawalMode />} />
            <Route path="redeem/withdraw-bank" element={<WithdrawBank />} />
            <Route path="redeem/withdraw-wallet" element={<WithdrawWallet />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<RedirectBasedOnAuth />} />
        </Routes>
        <Footer />
        <Chatbot /> {/* Added Chatbot here to appear on every page */}
      </BrowserRouter>
    </AuthProvider>
  );
}

const RedirectBasedOnAuth = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default App;