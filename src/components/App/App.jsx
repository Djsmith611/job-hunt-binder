import "./App.css";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Nav from "./Nav/Nav";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Footer from "./Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import BinderPage from "../Pages/BinderPage/BinderPage.jsx";
import AboutPage from "../Pages/AboutPage/AboutPage";
import DashboardPage from "../Pages/DashboardPage/DashboardPage";
import LandingPage from "../Pages/LandingPage/LandingPage";
import LoginPage from "../Pages/LoginPage/LoginPage";
import AnalyticsPage from "../Pages/AnalyticsPage/AnalyticsPage.jsx";
import Resources from "../Pages/ResourcesPage/ResourcesPage";
import ProtectedRoute from "../Util/ProtectedRoute/ProtectedRoute";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import { fetchUserRequest } from "../../modules/actions/loginActions";
import { AnimatePresence } from "framer-motion";

const AppContent = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const loading = useSelector((state) => state.loading);
  const location = useLocation();
  const [lastVisitedRoute, setLastVisitedRoute] = useState("/home");

  useEffect(() => {
    dispatch(fetchUserRequest());
  }, [dispatch]);

  useEffect(() => {
    const path = location.pathname;
    if ((path === "/login" || path === "/register") && user.id) {
      localStorage.setItem("lastVisitedRoute", "/dashboard");
    } else {
      localStorage.setItem("lastVisitedRoute", path);
    }
    console.log(path);
  }, [location, user.id]);

  useEffect(() => {
    const savedRoute = localStorage.getItem("lastVisitedRoute");
    if (
      savedRoute === "/dashboard" ||
      savedRoute === "/binder" ||
      savedRoute === "/analytics"
    ) {
      setLastVisitedRoute(user.id ? savedRoute : "/");
    } else {
      setLastVisitedRoute(savedRoute);
    }
  }, [user.id]);

  if (loading === true) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Nav />
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
          <Route path="/resources" element={<Resources />} />
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
              user.id ? (
                <Navigate to={lastVisitedRoute} replace />
              ) : (
                <LoginPage />
              )
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
      {user.id ? (
        <footer className="app-footer"> &copy; David Smith</footer>
      ) : (
        <Footer />
      )}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
