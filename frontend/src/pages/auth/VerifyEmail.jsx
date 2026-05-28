import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../../services/auth.api";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import Footer from "../../components/ui/Footer";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState(token ? "verifying" : "error");

  const [message, setMessage] = useState(
    token
      ? ""
      : "No verification token found. Please use the link from your email.",
  );

  useEffect(() => {
    if (!token) return;

    const verifyUserEmail = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setMessage(
          err.message || "Verification failed. The link may have expired.",
        );
      }
    };

    verifyUserEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-bg-background">
      <Header />

      <main className="flex items-center justify-center p-6 min-h-[80vh]">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center space-y-5 shadow-sm border border-text-muted/10">
          {status === "verifying" && (
            <>
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                <div className="w-8 h-8 border-4 border-accent-orange/30 border-t-accent-orange rounded-full animate-spin" />
              </div>

              <h2 className="text-2xl font-display font-bold text-text-primary">
                Verifying your email...
              </h2>

              <p className="text-sm text-text-muted">Please wait a moment.</p>
            </>
          )}

          {status === "success" && (
            <>
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
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>

              <h2 className="text-2xl font-display font-bold text-text-primary">
                Email verified!
              </h2>

              <p className="text-sm text-text-muted">
                Your account is now active. You can sign in and start your
                NaijaEats journey.
              </p>

              <Button onClick={() => navigate("/sign-in")} className="w-full">
                Sign In Now
              </Button>
            </>
          )}

          {status === "error" && (
            <>
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
                Verification failed
              </h2>

              <p className="text-sm text-text-muted">{message}</p>

              <div className="space-y-3">
                <Button onClick={() => navigate("/sign-in")} className="w-full">
                  Go to Sign In
                </Button>

                <Button
                  onClick={() => navigate("/sign-up")}
                  variant="outline"
                  className="w-full"
                >
                  Create new account
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VerifyEmail;
