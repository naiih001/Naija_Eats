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
import WeeklyPlan from "./pages/onboarding/WeeklyPlan";
import Market from "./pages/Market";
import MenuPage from "./pages/MenuPage";
import Profile from "./pages/Profile";
import MealDetail from "./pages/MealDetail";
import SplashScreen from "./pages/onboarding/SplashScreen";
import { BudgetAlertProvider } from "./context/BudgetAlertContext";

import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import { useState, useEffect } from "react";
import { Toaster } from "sonner";

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
          <Route
            path="/"
            element={
              <HomePageLayout>
                <HomePage />
              </HomePageLayout>
            }
          />
          <Route
            path="/market"
            element={
              <HomePageLayout>
                <Market />
              </HomePageLayout>
            }
          />
          <Route
            path="/menu-page"
            element={
              <HomePageLayout>
                <MenuPage />
              </HomePageLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <HomePageLayout>
                <Profile />
              </HomePageLayout>
            }
          />
          <Route path="/weekly-plan" element={<WeeklyPlan />} />
          <Route
            path="/meal/:id"
            element={
              <HomePageLayout>
                <MealDetail />
              </HomePageLayout>
            }
          />
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
        <Route path="/onboarding/meal-plan" element={<MealPlan />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BudgetAlertProvider>
  );
}

export default App;
