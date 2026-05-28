import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import Footer from "../../components/ui/Footer";
import { authService } from "../../services/auth.api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tokenError = !token;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, formData.newPassword);
      toast.success("Password reset successfully!");
      navigate("/sign-in");
    } catch (err) {
      toast.error(err.message || "Reset failed. The link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenError) {
    return (
      <div className="min-h-screen bg-bg-background">
        <Header />
        <main className="flex items-center justify-center p-6 min-h-[80vh]">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center space-y-5 shadow-sm border border-text-muted/10">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-bold text-text-primary">
              Invalid reset link
            </h2>
            <p className="text-sm text-text-muted">
              This link is invalid or has expired. Please request a new one.
            </p>
            <Button
              onClick={() => navigate("/forgot-password")}
              className="w-full"
            >
              Request New Link
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-background">
      <Header />
      <main className="flex items-center justify-center p-6 min-h-[80vh]">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-sm border border-text-muted/10">
          <div className="mb-6">
            <h2 className="text-3xl font-display font-extrabold text-text-primary mb-2">
              Reset Password
            </h2>
            <p className="text-sm text-text-muted">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-inter font-bold text-text-primary uppercase tracking-wide">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, newPassword: e.target.value }))
                  }
                  placeholder="Min. 8 characters"
                  className="w-full border border-text-muted/25 px-4 py-3.5 text-sm font-inter font-medium focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all rounded-lg"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-inter font-bold text-text-primary uppercase tracking-wide">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    confirmPassword: e.target.value,
                  }))
                }
                placeholder="Repeat your password"
                className="w-full border border-text-muted/25 px-4 py-3.5 text-sm font-inter font-medium focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all rounded-lg"
                required
              />
              {formData.confirmPassword &&
                formData.newPassword !== formData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    Passwords do not match
                  </p>
                )}
            </div>

            <Button
              variant="primary"
              type="submit"
              className="mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
              {!isLoading && (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              )}
            </Button>

            <div className="text-center mt-2">
              <Link
                to="/sign-in"
                className="text-accent-orange text-sm font-semibold hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
