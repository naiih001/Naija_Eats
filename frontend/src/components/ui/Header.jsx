import { Link, useLocation, useNavigate } from "react-router-dom";
import { HamburgerIcon, SidebarIcon } from "../../constants/icons";

const getInitials = (name, email) => {
  if (name && name.trim()) {
    return name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  // Fallback to first letter of email
  if (email && email.trim()) return email[0].toUpperCase();
  return "?";
};

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const saved = localStorage.getItem("user");
  const user = saved ? JSON.parse(saved) : null;
  const fullName = user?.profile?.full_name || user?.full_name || "";
  const email = user?.email || "";
  const initials = getInitials(fullName, email);

  return (
    <header className="flex items-center justify-between pl-2 pr-4 py-2.5 sticky top-0 left-0 w-full bg-bg-background z-400 lg:px-8 border-b border-text-muted/5">
      {location.pathname.includes("/onboarding") ? (
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-text-muted/5 rounded-lg transition-colors cursor-pointer"
        >
          <HamburgerIcon className="text-text-primary w-6 h-6 block lg:hidden" />
        </button>
      ) : (
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-text-muted/5 rounded-lg transition-colors hidden lg:block cursor-pointer"
        >
          <SidebarIcon className="text-text-primary w-6 h-6 hidden lg:block" />
        </button>
      )}

      <Link to="/" className="w-20 block ml-4 lg:mr-auto">
        <img
          src="/images/naijaeats.webp"
          alt="Naija Eats Logo"
          className="w-full object-cover"
        />
      </Link>

      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate("/profile")}
          className="w-8 h-8 rounded-full bg-text-primary flex items-center justify-center border-2 border-accent-orange/20 cursor-pointer shrink-0"
        >
          <span className="text-xs font-bold text-white">{initials}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
