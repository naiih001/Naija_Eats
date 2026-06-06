import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../ui/Header";
import BottomTabBar from "../ui/BottomTabBar";
import Sidebar from "../ui/Sidebar";
import BudgetAlertBanner from "../ui/BudgetAlertBanner";
import { useBudgetAlert } from "../../context/BudgetAlertContext";

const HomePageLayout = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const { shoppingListTotal, budgetLimit, showBudgetAlert } = useBudgetAlert();

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F8DF]">
      <BudgetAlertBanner
        shoppingListTotal={shoppingListTotal}
        budgetLimit={budgetLimit}
        isVisible={showBudgetAlert}
      />
      <Header toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} />
      <div className="flex flex-1 min-w-0">
        <Sidebar
          isExpanded={isSidebarExpanded}
        />
        <main className="flex-1 pb-32 lg:pb-12 overflow-x-hidden">
          {children || <Outlet />}
        </main>
      </div>
      <BottomTabBar />
    </div>
  );
};

export default HomePageLayout;
