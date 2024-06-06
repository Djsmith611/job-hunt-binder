import "./App.css";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Nav from "./Nav/Nav";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Footer from "./Footer/Footer";
import { useDispatch } from "react-redux";
import BinderPage from "../Pages/BinderPage/BinderPage";
import AboutPage from "../Pages/AboutPage/AboutPage";
import DashboardPage from "../Pages/DashboardPage/DashboardPage";
import useUser from "../../modules/hooks/useUser";
import LandingPage from "../Pages/LandingPage/LandingPage";
import LoginPage from "../Pages/LoginPage/LoginPage";
import Resources from "../Pages/ResourcesPage/ResourcesPage";
import ProtectedRoute from "../Util/ProtectedRoute/ProtectedRoute";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import { fetchUserRequest } from "../../modules/actions/loginActions";

export default function App() {
  const dispatch = useDispatch();

  const user = useUser();

  useEffect(() => {
    dispatch(fetchUserRequest());
  }, [dispatch]);

  return (
    <Router>
      <div>
        <Nav />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
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
            path="/login"
            element={user.id ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={
              user.id ? <Navigate to="/dashboard" replace /> : <RegisterPage />
            }
          />
          <Route
            path="/home"
            element={
              user.id ? <Navigate to="/dashboard" replace /> : <LandingPage />
            }
          />
          <Route path="*" element={<h1>404 PAGE NOT FOUND</h1>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
