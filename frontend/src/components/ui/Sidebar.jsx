/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ForkAndKnife,
  ShoppingCartIcon,
  UserIcon,
} from "../../constants/icons";
import { authService } from "../../services/auth.api";

const Sidebar = ({ isExpanded }) => {
  const location = useLocation();
  const [userName, setUserName] = useState("John Doe");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.full_name) {
          setUserName(user.full_name);
        }
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  useEffect(() => {
    const savedUser = async () => {
      const data = await authService.userInfo();
      console.log("User info data in Sidebar:", data);
      if (data.data?.user?.full_name) {
        setUserName(data.data.user.full_name);
      }
    };
    savedUser();
  }, [location.pathname]);

  const navItems = [
    { label: "Home", icon: HomeIcon, path: "/" },
    { label: "Menu", icon: ForkAndKnife, path: "/menu-page" },
    { label: "Shopping", icon: ShoppingCartIcon, path: "/market" },
    { label: "Profile", icon: UserIcon, path: "/profile" },
  ];

  return (
    <aside
      className={`fixed lg:static top-0 left-0 h-screen bg-bg-background border-r border-text-muted/10 transition-all duration-300 z-50 flex flex-col ${
        isExpanded ? "w-54" : "w-20"
      } ${!isExpanded && "lg:w-20"} hidden lg:flex`}
    >
      {/* User Profile Info */}
      <div
        className={`p-6 mb-4 flex items-center gap-3 overflow-hidden transition-all duration-300`}
      >
        <div className="w-10 h-10 rounded-full overflow-hidden bg-text-muted/60 shrink-0">
          <img
            src="/images/Avatar.png"
            alt={userName}
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className={`flex flex-col transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`}
        >
          <span className="text-sm font-bold text-text-primary whitespace-nowrap">
            {userName}
          </span>
          <span className="text-[10px] text-text-muted whitespace-nowrap">
            Premium Member
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 px-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all group ${
                isActive
                  ? "bg-text-primary text-white"
                  : "text-text-muted hover:bg-text-muted/5 hover:text-text-primary"
              }`}
            >
              <div className="shrink-0">
                <Icon
                  className={`w-6 h-6 ${isActive ? "text-accent-orange" : "text-text-muted group-hover:text-text-primary"}`}
                />
              </div>
              <span
                className={`text-sm font-bold whitespace-nowrap transition-opacity duration-300 ${
                  isExpanded ? "opacity-100" : "opacity-0 w-0"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
