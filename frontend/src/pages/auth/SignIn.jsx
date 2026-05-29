import { useState, useEffect } from "react";
import {
  useNavigate,
  Link,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { toast } from "sonner";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import Footer from "../../components/ui/Footer";
import { authService } from "../../services/auth.api";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from = location.state?.from;

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const [resending, setResending] = useState(false);

  const [formData, setFormData] = useState({ email: "", password: "" });

  // Handle redirect from backend after email verification
  useEffect(() => {
    const status = searchParams.get("status");
    const message = searchParams.get("message");
    const verified = searchParams.get("verified");

    if (status === "success" && verified === "true") {
      toast.success(message || "Email verified! You can now sign in.");
    } else if (status === "error" && message) {
      toast.error(message || "Verification failed.");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authService.resendVerification(unverifiedEmail);
      toast.success("Verification email resent! Check your inbox.");
    } catch (err) {
      toast.error(err.message || "Failed to resend. Try again.");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setUnverifiedEmail(null);

    try {
      await authService.signIn(formData.email, formData.password);
      toast.success("Signed in successfully.");
      const isOnboarded = localStorage.getItem("onboarded") === "true";
      navigate(isOnboarded ? from || "/" : "/onboarding/set-budget", {
        replace: true,
      });
    } catch (err) {
      if (err.status === 403) {
        setUnverifiedEmail(formData.email);
      } else {
        toast.error(err.message || "Invalid email or password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-background">
      <Header />
      <main className="flex-1 h-full flex flex-col p-4 gap-6 lg:grid lg:grid-cols-2 lg:gap-4">
        <div className="relative rounded-xl overflow-hidden h-48 w-full shadow-lg shrink-0 lg:w-full lg:h-full">
          <img
            src="/images/sign-in-hero.webp"
            alt="Nigerian food"
            className="w-full h-full object-cover block lg:hidden"
          />
          <img
            src="/images/homepage-desktop-picture.jpeg"
            alt="Nigerian food"
            className="w-full h-full object-cover hidden lg:block"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-start justify-center px-4">
            <h1 className="text-white font-display text-3xl lg:text-[4rem] font-bold tracking-tight lg:text-left leading-tight lg:mb-6">
              Heritage Flavors,
              <br /> Modern Convenience.
            </h1>
            <p className="hidden lg:block text-base text-white font-semibold">
              Build a personalized Nigerian meal plan with flavors you love,
              goals you choose, and a weekly rhythm that fits your life.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-sm lg:rounded-xl p-6 border border-text-muted/25 pb-8">
          <h2 className="text-3xl text-text-primary font-extrabold mb-1.5">
            Welcome Back
          </h2>
          <p className="text-text-muted text-base mb-6">
            Sign in to explore Nigeria's premium tastes.
          </p>

          {/* unverified email banner */}
          {unverifiedEmail && (
            <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 space-y-1.5">
              <p className="text-sm font-bold text-amber-800">
                Email not verified
              </p>
              <p className="text-xs text-amber-700">
                Check your inbox for the verification link sent to{" "}
                <span className="font-semibold">{unverifiedEmail} </span> <br />
                <span className="text-xs font-bold pt-4 ">
                  (Check Your spam folder also)
                </span>
              </p>
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-xs font-bold text-accent-orange hover:underline"
              >
                {resending ? "Resending..." : "Resend verification email →"}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-inter font-bold text-text-primary uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full border border-text-muted/25 px-4 py-3.5 text-sm font-inter font-medium focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[13px] font-bold font-inter text-text-primary uppercase">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-accent-orange text-sm font-inter font-semibold hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full border border-text-muted/25 px-4 py-3.5 text-sm font-inter font-medium focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all"
                  required
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

            <Button
              variant="primary"
              type="submit"
              className="mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
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

            <div className="flex items-center gap-4 my-2">
              <div className="h-px bg-text-muted flex-1" />
              <span className="text-gray-400 text-[13px] font-medium">OR</span>
              <div className="h-px bg-text-muted flex-1" />
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={() => navigate("/onboarding/set-budget")}
            >
              Continue as Guest
            </Button>

            <div className="text-center mt-3">
              <span className="text-body text-base font-inter">
                New to NaijaEats?{" "}
              </span>
              <Link
                to="/sign-up"
                state={{ from }}
                className="text-accent-orange font-semibold hover:underline text-base font-inter"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
