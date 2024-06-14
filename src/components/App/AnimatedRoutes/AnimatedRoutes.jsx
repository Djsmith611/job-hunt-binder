import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import BinderPage from "../../Pages/BinderPage/BinderPage.jsx";
import AboutPage from "../../Pages/AboutPage/AboutPage";
import DashboardPage from "../../Pages/DashboardPage/DashboardPage";
import LandingPage from "../../Pages/LandingPage/LandingPage";
import LoginPage from "../../Pages/LoginPage/LoginPage";
import AnalyticsPage from "../../Pages/AnalyticsPage/AnalyticsPage.jsx";
import ResourcesPage from "../../Pages/ResourcesPage/ResourcesPage.jsx";
import ProtectedRoute from "../../Util/ProtectedRoute/ProtectedRoute.jsx";
import RegisterPage from "../../Pages/RegisterPage/RegisterPage.jsx";
import useUser from "../../../modules/hooks/useUser.js";

export default function AnimatedRoutes() {
  const location = useLocation();
  const user = useUser();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route exact path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={
            user.id ? (
              <Navigate to={lastVisitedRoute} replace />
            ) : (
              <LandingPage />
            )
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/binder"
          element={
            <ProtectedRoute>
              <BinderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            user.id ? <Navigate to={lastVisitedRoute} replace /> : <LoginPage />
          }
        />
        <Route
          path="/register"
          element={
            user.id ? (
              <Navigate to={lastVisitedRoute} replace />
            ) : (
              <RegisterPage />
            )
          }
        />
        <Route path="*" element={<h1>404 PAGE NOT FOUND</h1>} />
      </Routes>
    </AnimatePresence>
  );
}
