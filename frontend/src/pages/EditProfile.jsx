import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "../services/auth.api";
import Button from "../components/ui/Button";

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const EditProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.userInfo();
        const user = data.data;
        const fullName = user?.profile?.full_name || "";
        const parts = fullName.split(" ");
        setFormData({
          first_name: parts[0] || "",
          last_name: parts.slice(1).join(" ") || "",
          email: user?.email || "",
          phone_number: user?.phone_number?.replace("+234", "") || "",
        });
      } catch {
        const saved = localStorage.getItem("user");
        if (saved) {
          try {
            const user = JSON.parse(saved);
            const fullName = user?.profile?.full_name || user?.full_name || "";
            const parts = fullName.split(" ");
            setFormData({
              first_name: parts[0] || "",
              last_name: parts.slice(1).join(" ") || "",
              email: user?.email || "",
              phone_number: user?.phone_number?.replace("+234", "") || "",
            });
          } catch (parseErr) {
            console.error("Failed to parse user from localStorage", parseErr);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    if (!formData.first_name.trim()) {
      toast.error("First name is required.");
      return;
    }

    setIsSaving(true);
    try {
      const full_name =
        `${formData.first_name.trim()} ${formData.last_name.trim()}`.trim();
      await authService.updateProfile({
        full_name,
        phone_number: formData.phone_number.trim()
          ? `+234${formData.phone_number.trim()}`
          : undefined,
      });
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.message || "Failed to update profile. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent-orange/30 border-t-accent-orange rounded-full animate-spin" />
      </main>
    );
  }

  const fullName = `${formData.first_name} ${formData.last_name}`.trim();
  const initials = getInitials(fullName);

  return (
    <main className="min-h-screen bg-bg-background px-5 pt-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-black/5"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-2xl font-display font-extrabold text-text-primary">
          Edit Profile
        </h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 flex flex-col gap-6">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-text-primary border-4 border-accent-orange/30 flex items-center justify-center">
              <span className="text-2xl font-display font-bold text-white">
                {initials}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-accent-orange rounded-full flex items-center justify-center border-2 border-white">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>
          </div>
        </div>

        {/* First Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-text-primary">
            First Name
          </label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) =>
              setFormData((p) => ({ ...p, first_name: e.target.value }))
            }
            placeholder="Enter your first name"
            className="w-full border border-text-muted/25 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all"
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-text-primary">
            Last Name
          </label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) =>
              setFormData((p) => ({ ...p, last_name: e.target.value }))
            }
            placeholder="Enter your last name"
            className="w-full border border-text-muted/25 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all"
          />
        </div>

        {/* Email — read only */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-text-primary">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            readOnly
            className="w-full border border-text-muted/25 rounded-xl px-4 py-3.5 text-sm font-medium bg-gray-50 text-text-muted cursor-not-allowed"
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-text-primary">
            Phone Number
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value="+234"
              readOnly
              className="w-18 border border-text-muted/25 bg-gray-50 rounded-xl px-2 py-3.5 text-sm text-center font-medium focus:outline-none"
            />
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData((p) => ({ ...p, phone_number: e.target.value }))
              }
              placeholder="8012345678"
              className="flex-1 border border-text-muted/25 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 border-2 border-text-primary text-text-primary py-4 rounded-xl font-bold text-sm hover:bg-text-primary hover:text-white transition-all"
          >
            Cancel
          </button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default EditProfile;
