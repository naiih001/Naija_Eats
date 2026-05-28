import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import Header from "../../components/ui/Header";
import CustomCheckbox from "../../components/ui/CustomCheckbox";
import Button from "../../components/ui/Button";
import Footer from "../../components/ui/Footer";
import { authService } from "../../services/auth.api";

const SignUp = () => {
  const location = useLocation();
  const from = location.state?.from || "/onboarding/set-budget";

  const [showPassword, setShowPassword] = useState(false);
  const [isTerms, setTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(null);
  const [resending, setResending] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        phone_number: `+234${formData.phone_number}`,
      };
      await authService.signUp(payload);
      setRegisteredEmail(formData.email);
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authService.resendVerification(registeredEmail);
      toast.success("Verification email resent! Check your inbox.");
    } catch (err) {
      toast.error(err.message || "Failed to resend. Try again.");
    } finally {
      setResending(false);
    }
  };

  // ── Email sent screen ──────────────────────────────────────────
  if (registeredEmail) {
    return (
      <div className="min-h-screen bg-bg-background">
        <Header />
        <main className="flex items-center justify-center p-6 min-h-[80vh]">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center space-y-5 shadow-sm border border-text-muted/10">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9" />
                <path d="m2 6 10 7 10-7" />
                <path d="m16 19 2 2 4-4" />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold text-text-primary">
                Check your inbox
              </h2>
              <p className="text-sm text-text-muted leading-relaxed">
                We sent a verification link to{" "}
                <span className="font-semibold text-text-primary">
                  {registeredEmail}
                </span>
                . Click it to activate your account.
              </p>
              <p className="text-xs text-text-muted">
                The link expires in 24 hours.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                onClick={handleResend}
                variant="outline"
                className="w-full"
                disabled={resending}
              >
                {resending ? "Resending..." : "Resend verification email"}
              </Button>
              <Link
                to="/sign-in"
                className="block text-sm text-accent-orange font-semibold hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Registration form ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg-background">
      <Header />
      <main className="flex-1 h-full flex flex-col p-4 gap-6 lg:grid lg:grid-cols-2 lg:gap-4">
        <div className="relative rounded-xl overflow-hidden h-48 w-full shadow-lg shrink-0 hidden lg:block lg:w-full lg:h-full">
          <img
            src="/images/homepage-desktop-picture.jpeg"
            alt="Nigerian food"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-start justify-center px-4">
            <h1 className="text-white font-display text-3xl lg:text-[4rem] font-bold tracking-tight leading-tight lg:mb-6">
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
          <h1 className="font-display text-[2.2rem] text-text-primary font-extrabold mb-2 text-center tracking-tight">
            Join the Feast
          </h1>
          <p className="text-text-muted text-center text-base mb-8 px-2 leading-relaxed font-inter">
            Say goodbye to food decision paralysis!
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-base font-inter font-bold text-text-primary">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="border border-text-muted/25 font-inter rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-base font-inter font-bold text-text-primary">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@example.com"
                className="border border-text-muted/25 font-inter rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-base font-inter font-bold text-text-primary">
                Phone Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value="+234"
                  readOnly
                  className="w-[72px] border border-text-muted/25 font-inter bg-gray-50 rounded-lg px-2 py-3 text-sm text-center font-medium focus:outline-none"
                />
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="8012345678"
                  className="flex-1 border border-text-muted/25 font-inter rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-base font-bold font-inter text-text-primary">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  className="w-full border border-text-muted/25 font-inter rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all"
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

            <div className="flex items-start gap-3 mt-2">
              <button
                type="button"
                className="cursor-pointer mt-0.5"
                onClick={() => setTerms(!isTerms)}
              >
                <CustomCheckbox checked={isTerms} />
              </button>
              <label className="text-xs text-text-primary leading-tight">
                By signing up, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            <Button
              variant="primary"
              type="submit"
              className="mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
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
              <div className="h-px bg-text-muted/30 flex-1" />
              <span className="text-text-muted/40 text-[13px] font-medium">
                OR
              </span>
              <div className="h-px bg-text-muted/30 flex-1" />
            </div>

            <div className="text-center mt-3">
              <span className="text-text-muted text-base">
                Already have an account?{" "}
              </span>
              <Link
                to="/sign-in"
                state={{ from }}
                className="text-accent-orange font-bold hover:underline text-base"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
