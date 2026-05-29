import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.api";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.userInfo();
        setUserData(data.data);
      } catch (err) {
        // fallback to localStorage if API fails
        const saved = localStorage.getItem("user");
        if (saved) {
          try {
            setUserData(JSON.parse(saved));
          } catch (parseErr) {
            console.error("Failed to parse user from localStorage", parseErr);
          }
        }
        // if token expired redirect to sign in
        if (err.message?.includes("token")) {
          navigate("/sign-in");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const settingsGroups = [
    {
      title: "Account Settings",
      items: [
        {
          icon: (
            <div className="w-10 h-10 bg-[#E8F5E9] rounded-xl flex items-center justify-center text-text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2.28A2 2 0 0 0 22 15V9a2 2 0 0 0-1-1.72V5a2 2 0 0 0-2-2zm0 2h14v2h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6v2H5zm8 4h7v6h-7zm3 1.5a1.5 1.5 0 0 0-1.5 1.5a1.5 1.5 0 0 0 1.5 1.5a1.5 1.5 0 0 0 1.5-1.5a1.5 1.5 0 0 0-1.5-1.5"
                />
              </svg>
            </div>
          ),
          label: "Budget Settings",
          sublabel: "Manage monthly food spend",
          type: "chevron",
        },
        {
          icon: (
            <div className="w-10 h-10 bg-[#FFF3E0] rounded-xl flex items-center justify-center text-accent-orange">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
          ),
          label: "Preferences",
          sublabel: "Dietary needs & allergens",
          type: "chevron",
        },
        {
          icon: (
            <div className="w-10 h-10 bg-[#F3E5F5] rounded-xl flex items-center justify-center text-[#7B1FA2]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9m4.3 13a2 2 0 0 0 3.4 0" />
              </svg>
            </div>
          ),
          label: "Notifications",
          sublabel: "Alerts for meals & offers",
          type: "chevron",
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: (
            <div className="w-10 h-10 bg-[#F5F5F5] rounded-xl flex items-center justify-center text-gray-500">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m0 4h.01" />
              </svg>
            </div>
          ),
          label: "Help Center",
          type: "external",
        },
        {
          icon: (
            <div className="w-10 h-10 bg-[#F5F5F5] rounded-xl flex items-center justify-center text-gray-500">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
          ),
          label: "Privacy Policy",
          type: "chevron",
        },
      ],
    },
  ];

  if (isLoading) {
    return (
      <main className="px-5 pt-12 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
        <div className="mt-6 h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="mt-2 h-4 w-32 bg-gray-200 rounded animate-pulse" />
      </main>
    );
  }

  const fullName =
    userData?.profile?.full_name || userData?.full_name || "NaijaEats User";
  const avatarUrl = userData?.profile?.avatar_url || null;
  const email = userData?.email || "";

  return (
    <main className="px-5 pt-12 flex flex-col items-center">
      {/* Avatar */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="/images/Avatar.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <button className="absolute bottom-1 right-1 bg-accent-orange w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#F8F8DF] text-white">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        </button>
      </div>

      {/* User Info */}
      <div className="text-center mt-6">
        <h1 className="text-4xl font-display font-extrabold text-text-primary">
          {fullName}
        </h1>
        <p className="text-sm font-medium text-gray-500 mt-1">{email}</p>
      </div>

      {/* Settings */}
      <div className="w-full mt-10 flex flex-col gap-8">
        {settingsGroups.map((group, gIdx) => (
          <div key={gIdx} className="flex flex-col gap-3">
            <h2 className="text-lg font-display font-bold text-text-primary">
              {group.title}
            </h2>
            <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
              {group.items.map((item, iIdx) => (
                <button
                  key={iIdx}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                    iIdx !== group.items.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  {item.icon}
                  <div className="flex-1 text-left">
                    <div className="text-sm font-bold text-text-primary">
                      {item.label}
                    </div>
                    {item.sublabel && (
                      <div className="text-[11px] text-text-muted/75 font-medium">
                        {item.sublabel}
                      </div>
                    )}
                  </div>
                  <div className="text-gray-300">
                    {item.type === "chevron" ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6v6m-11 5 11-11" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          authService.logout();
          navigate("/sign-in");
        }}
        className="w-full mt-10 border-2 border-[#D32F2F] text-[#D32F2F] py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#D32F2F]/5 transition-all"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9" />
        </svg>
        Logout
      </button>

      <div className="mt-6 mb-10 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
        Version 2.4.0
      </div>
    </main>
  );
};

export default Profile;
