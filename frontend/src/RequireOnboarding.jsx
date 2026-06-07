import { Navigate, Outlet, useLocation } from "react-router-dom";
import LandingPage from "./pages/onboarding/LandingPage";

export const RequireOnboarding = () => {
  const location = useLocation();
  const onboarded = localStorage.getItem("onboarded");
  const token = localStorage.getItem("token");

  // No token — show landing page at "/" for unauthenticated users
  // redirect to sign-in for all other protected routes
  if (!token) {
    if (location.pathname === "/") {
      return <LandingPage />;
    }
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  // Has token but not onboarded yet
  if (!onboarded) {
    if (location.pathname === "/") {
      return <LandingPage />;
    }
    return <Navigate to="/onboarding/set-budget" replace />;
  }

  return <Outlet />;
};
