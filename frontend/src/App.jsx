import "./globals.css";
import HomePageLayout from "./components/layout/HomePageLayout";
import HomePage from "./pages/HomePage";
import CookingFrequency from "./pages/onboarding/CookingFrequency";
import SetBudget from "./pages/onboarding/SetBudget";
import LandingPage from "./pages/onboarding/LandingPage";
import { Routes, Route, Navigate } from "react-router-dom";
import { RequireOnboarding } from "./RequireOnboarding";
// import Buffer from "./onboarding/Buffer";
import FoodPreferences from "./pages/onboarding/FoodPreferences";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import GeneratingPlan from "./pages/onboarding/GeneratingPlan";
import MealPlan from "./pages/onboarding/MealPlan";
import WeeklyPlan from "./pages/WeeklyPlan";
import Market from "./pages/Market";
import MenuPage from "./pages/MenuPage";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MealDetail from "./pages/MealDetail";
import SplashScreen from "./pages/onboarding/SplashScreen";
import { BudgetAlertProvider } from "./context/BudgetAlertProvider";

import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import OnboardingLayout from "./components/layout/OnboardingLayout";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // 2.5 seconds splash screen
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <BudgetAlertProvider>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        <Route
          path="/onboarding"
          element={<Navigate to="/onboarding/setbudget" replace />}
        />
        <Route element={<RequireOnboarding />}>
          <Route element={<HomePageLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/market" element={<Market />} />
            <Route path="/menu-page" element={<MenuPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/weekly-plan" element={<WeeklyPlan />} />
            <Route path="/meal/:id" element={<MealDetail />} />
          </Route>
        </Route>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding/set-budget" element={<SetBudget />} />
        <Route
          path="/onboarding/cooking-frequency"
          element={<CookingFrequency />}
        />
        <Route
          path="/onboarding/food-preferences"
          element={<FoodPreferences />}
        />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/onboarding/generating-plan"
          element={<GeneratingPlan />}
        />
        <Route
          path="/onboarding/meal-plan"
          element={
            <OnboardingLayout>
              <MealPlan />
            </OnboardingLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </BudgetAlertProvider>
  );
}

export default App;
