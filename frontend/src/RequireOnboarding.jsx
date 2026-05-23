import { Navigate, Outlet, useLocation } from "react-router-dom";
import LandingPage from "./pages/onboarding/LandingPage";

export const RequireOnboarding = () => {
  const location = useLocation();
  const onboarded = localStorage.getItem("onboarded");

  if (!onboarded) {
    if (location.pathname === "/") {
      return <LandingPage />;
    }

    return <Navigate to="/onboarding/set-budget" replace />;
  }

  return <Outlet />;
};
