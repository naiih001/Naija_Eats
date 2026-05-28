import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import Footer from "../../components/ui/Footer";
import { authService } from "../../services/auth.api";

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Handle redirect from backend when reset token is invalid/expired
  useEffect(() => {
    const status = searchParams.get("status");
    const message = searchParams.get("message");
    if (status === "error" && message) {
      toast.error(
        message || "Reset link is invalid or expired. Request a new one.",
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg-background">
        <Header />
        <main className="flex items-center justify-center p-6 min-h-[80vh]">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center space-y-5 shadow-sm border border-text-muted/10">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9" />
                <path d="m2 6 10 7 10-7" />
                <path d="m16 19 2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-bold text-text-primary">
              Check your email
            </h2>
            <p className="text-sm text-text-muted leading-relaxed">
              If an account exists for{" "}
              <span className="font-semibold text-text-primary">{email}</span>,
              we've sent a password reset link. It expires in 1 hour.
            </p>
            <Link
              to="/sign-in"
              className="block text-sm text-accent-orange font-semibold hover:underline"
            >
              Back to Sign In
            </Link>
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
              Forgot Password?
            </h2>
            <p className="text-sm text-text-muted">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-inter font-bold text-text-primary uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-text-muted/25 px-4 py-3.5 text-sm font-inter font-medium focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all rounded-lg"
                required
              />
            </div>

            <Button
              variant="primary"
              type="submit"
              className="mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
