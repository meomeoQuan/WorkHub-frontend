import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Mail,
  ArrowRight,
} from "lucide-react";

type VerificationStatus =
  | "success"
  | "error"
  | "invalid";

export function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] =
    useState<VerificationStatus>("success");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("invalid");
      setErrorMessage("No verification token provided");
      return;
    }

    // Simulate API call to verify email
    verifyEmailToken(token);
  }, [searchParams]);

  // Countdown and redirect on success
  useEffect(() => {
    if (status === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, navigate]);

  const verifyEmailToken = async (token: string) => {
    try {
      // TODO: Replace with actual API call to your backend
      // const response = await fetch(`/api/verify-email?token=${token}`);
      // const data = await response.json();

      // For demo purposes, simulate success for any token
      // In production, check the actual response from backend
      if (token === "expired") {
        setStatus("error");
        setErrorMessage(
          "This verification link has expired. Please request a new one.",
        );
      } else if (token === "invalid") {
        setStatus("error");
        setErrorMessage(
          "Invalid verification token. Please check your email for the correct link.",
        );
      } else {
        // Success!
        setStatus("success");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        "Something went wrong. Please try again later.",
      );
    }
  };

  const handleResendEmail = () => {
    // TODO: Implement resend verification email
    alert(
      "Resend verification email feature - connect to backend",
    );
  };

  // Success State
  if (status === "success") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center border-2 border-[#4ADE80]/30 shadow-xl">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-[#4ADE80]/20 to-[#22C55E]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#4ADE80]" />
          </div>

          <h2 className="text-[#263238] mb-3 text-2xl font-bold">
            Email Verified! 🎉
          </h2>
          <p className="text-[#263238]/70 mb-6 text-base">
            Your email has been successfully verified. You can
            now access all WorkHub features!
          </p>

          {/* Success Info */}
          <div className="bg-gradient-to-r from-[#4ADE80]/10 to-[#22C55E]/10 border-2 border-[#4ADE80]/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3 text-left">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                <Mail className="w-5 h-5 text-[#4ADE80]" />
              </div>
              <div>
                <p className="text-sm text-[#263238] font-semibold mb-1">
                  What's Next?
                </p>
                <p className="text-xs text-[#263238]/70 leading-relaxed">
                  Complete your profile and start browsing
                  thousands of job opportunities tailored for
                  you.
                </p>
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div className="mb-6">
            <p className="text-sm text-[#263238]/60">
              Redirecting to login in{" "}
              <span className="font-bold text-[#FF9800]">
                {countdown}
              </span>{" "}
              seconds...
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-[#4ADE80] hover:bg-[#22C55E] text-white h-12 rounded-xl shadow-lg shadow-[#4ADE80]/30"
            >
              Go to Login
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full h-12 border-2 border-[#263238]/20 hover:border-[#263238] rounded-xl"
            >
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Error State (invalid or expired)
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 text-center border-2 border-red-500/30 shadow-xl">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-100">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>

        <h2 className="text-[#263238] mb-3 text-2xl font-bold">
          {status === "invalid"
            ? "Invalid Link"
            : "Verification Failed"}
        </h2>
        <p className="text-[#263238]/70 mb-6 text-base">
          {errorMessage ||
            "We couldn't verify your email address."}
        </p>

        {/* Error Details */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm text-[#263238] font-semibold mb-2">
            Possible reasons:
          </p>
          <ul className="text-xs text-[#263238]/70 space-y-1.5 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-red-500 flex-shrink-0">
                •
              </span>
              <span>
                The verification link has expired (links are
                valid for 24 hours)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 flex-shrink-0">
                •
              </span>
              <span>
                The link was already used to verify your email
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 flex-shrink-0">
                •
              </span>
              <span>
                The link was copied incorrectly from your email
              </span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleResendEmail}
            className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white h-12 rounded-xl shadow-lg shadow-[#FF9800]/30"
          >
            <Mail className="w-4 h-4 mr-2" />
            Resend Verification Email
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/login")}
            className="w-full h-12 border-2 border-[#263238]/20 hover:border-[#263238] rounded-xl"
          >
            Go to Login
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full h-12 border-2 border-[#263238]/20 hover:border-[#263238] rounded-xl"
          >
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}