import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Button } from '../components/ui/button';
import { Zap, Mail, Send, CheckCircle, ArrowLeft, ExternalLink } from 'lucide-react';

export function EmailConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || 'your email';
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [showVerifyButton, setShowVerifyButton] = useState(false);

  // Simulate 2 second delay before showing verify button (emulating email arrival)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVerifyButton(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleResendEmail = () => {
    setIsResending(true);
    // TODO: Implement actual email resend logic
    setTimeout(() => {
      setIsResending(false);
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 bg-white">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-[#263238]/70 hover:text-[#FF9800] mb-8 group transition"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          <span>Back to Login</span>
        </button>

        {/* Confirmation Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#263238]/10 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#4FC3F7] to-[#4ADE80] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-[#263238] mb-2 text-2xl">Verify your email</h1>
            <p className="text-[#263238]/70">
              We've sent a verification link to
            </p>
            <p className="text-[#FF9800] mt-1">
              {email}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-[#4FC3F7]/10 border border-[#4FC3F7]/20 rounded-xl p-4 mb-6">
            <h3 className="text-[#263238] text-sm mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#4FC3F7]" />
              Next Steps:
            </h3>
            <ol className="text-sm text-[#263238]/70 space-y-1 ml-6 list-decimal">
              <li>Check your inbox for an email from WorkHub</li>
              <li>Click the verification link in the email</li>
              <li>You'll be redirected to complete your profile</li>
            </ol>
          </div>

          {/* Resend Section */}
          <div className="space-y-3 mb-6">
            {!showVerifyButton && (
              <div className="bg-[#4FC3F7]/10 border border-[#4FC3F7]/20 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-4 h-4 border-2 border-[#4FC3F7] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-[#4FC3F7] font-semibold">
                    Sending email...
                  </p>
                </div>
                <p className="text-xs text-[#263238]/60">
                  Please wait while we send your verification email
                </p>
              </div>
            )}

            {showVerifyButton && (
              <div className="bg-gradient-to-r from-[#4ADE80]/10 to-[#4FC3F7]/10 border-2 border-[#4ADE80]/30 rounded-xl p-4 text-center animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-[#4ADE80]" />
                  <p className="text-sm text-[#4ADE80] font-semibold">
                    Email sent! ✉️
                  </p>
                </div>
                <p className="text-xs text-[#263238]/70 mb-4">
                  Click the link below to simulate opening the verification email
                </p>
                <Button
                  onClick={() => navigate('/verify-email?token=test-success')}
                  className="w-full bg-gradient-to-r from-[#4FC3F7] to-[#4ADE80] hover:from-[#0288D1] hover:to-[#22C55E] text-white h-12 rounded-xl shadow-lg"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Click to Verify Email (Simulate)
                </Button>
              </div>
            )}

            <p className="text-sm text-[#263238]/70 text-center">
              Didn't receive the email? Check your spam folder.
            </p>
            
            {resent && (
              <div className="bg-[#4ADE80]/10 border border-[#4ADE80]/20 rounded-xl p-3 text-center">
                <p className="text-sm text-[#4ADE80] flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Email sent successfully!
                </p>
              </div>
            )}

            <Button
              onClick={handleResendEmail}
              disabled={isResending || resent}
              variant="outline"
              className="w-full border-2 border-[#263238]/20 hover:border-[#FF9800] hover:text-[#FF9800] rounded-xl h-12 disabled:opacity-50"
            >
              {isResending ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#FF9800] border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Resend Verification Email
                </>
              )}
            </Button>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link to="/login">
              <Button className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl h-12 shadow-md hover:shadow-lg transition">
                Return to Login
              </Button>
            </Link>
            
            <div className="text-center">
              <p className="text-sm text-[#263238]/70">
                Wrong email?{' '}
                <Link to="/register" className="text-[#FF9800] hover:text-[#F57C00] transition">
                  Sign up again
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-[#FF9800]/10 rounded-xl p-4 mt-6">
          <p className="text-sm text-[#263238]/70 text-center">
            <strong className="text-[#263238]">Need help?</strong> Contact our support team at{' '}
            <a href="mailto:support@workhub.com" className="text-[#FF9800] hover:text-[#F57C00] transition">
              support@workhub.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}