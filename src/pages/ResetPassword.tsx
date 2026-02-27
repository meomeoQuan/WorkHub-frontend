import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle2, XCircle, Loader2, Lock, Eye, EyeOff, ArrowRight, Mail } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

type ResetStatus = 'validating' | 'valid' | 'success' | 'error' | 'invalid';

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<ResetStatus>('validating');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('invalid');
      setErrorMessage('No reset token provided');
      return;
    }

    // Validate token
    validateResetToken(token);
  }, [searchParams]);

  // Countdown and redirect on success
  useEffect(() => {
    if (status === 'success') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, navigate]);

  const validateResetToken = async (token: string) => {
    try {
      const res = await fetch(
        `${API}/api/auth/validate-reset-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );

      const result = await res.json();

      if (!result.success) {
        setStatus("error");

        switch (result.message) {
          case "TOKEN_EXPIRED":
            setErrorMessage(
              "This password reset link has expired. Please request a new one."
            );
            break;

          case "TOKEN_INVALID":
            setErrorMessage(
              "Invalid reset link. Please check your email."
            );
            break;

          default:
            setErrorMessage("Reset link is not valid.");
        }
        return;
      }

      setStatus("valid");
    } catch {
      setStatus("error");
      setErrorMessage("Server error. Please try again later.");
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }



    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${API}/api/auth/password-reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            newPassword,
          }),
        }
      );

      const result = await res.json();

      if (!result.success) {
        alert(result.message);
        return;
      }

      setStatus("success");
    } catch {
      alert("Failed to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const getPasswordStrength = (password: string) => {
    if (!password) return { label: '', color: '', width: '0%' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return { label: 'Weak', color: '#EF4444', width: '33%' };
    if (strength <= 3) return { label: 'Medium', color: '#FF9800', width: '66%' };
    return { label: 'Strong', color: '#4ADE80', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  // Success State
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center border-2 border-[#4ADE80]/30 shadow-xl">
          {/* Success Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#4ADE80]/20 to-[#22C55E]/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-[#4ADE80]" />
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#4ADE80]/20 rounded-full animate-ping" />
          </div>

          <h2 className="text-[#263238] mb-3 text-2xl font-bold">Password Reset! 🎉</h2>
          <p className="text-[#263238]/70 mb-6 text-base">
            Your password has been successfully updated. You can now login with your new password.
          </p>

          {/* Success Info */}
          <div className="bg-gradient-to-r from-[#4ADE80]/10 to-[#22C55E]/10 border-2 border-[#4ADE80]/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3 text-left">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                <Lock className="w-5 h-5 text-[#4ADE80]" />
              </div>
              <div>
                <p className="text-sm text-[#263238] font-semibold mb-1">Security Tip</p>
                <p className="text-xs text-[#263238]/70 leading-relaxed">
                  Make sure to keep your password safe and never share it with anyone.
                </p>
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div className="mb-6">
            <p className="text-sm text-[#263238]/60">
              Redirecting to login in <span className="font-bold text-[#FF9800]">{countdown}</span> seconds...
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate('/login')}
              className="w-full bg-[#4ADE80] hover:bg-[#22C55E] text-white h-12 rounded-xl shadow-lg shadow-[#4ADE80]/30"
            >
              Go to Login
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full h-12 border-2 border-[#263238]/20 hover:border-[#263238] rounded-xl"
            >
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Error/Invalid State
  if (status === 'error' || status === 'invalid') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center border-2 border-red-500/30 shadow-xl">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-100">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>

          <h2 className="text-[#263238] mb-3 text-2xl font-bold">Invalid Reset Link</h2>
          <p className="text-[#263238]/70 mb-6 text-base">
            {errorMessage || 'This password reset link is no longer valid.'}
          </p>

          {/* Error Details */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-[#263238] font-semibold mb-2">Possible reasons:</p>
            <ul className="text-xs text-[#263238]/70 space-y-1.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-red-500 flex-shrink-0">•</span>
                <span>The reset link has expired (links are valid for 1 hour)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 flex-shrink-0">•</span>
                <span>The link was already used to reset your password</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 flex-shrink-0">•</span>
                <span>A newer reset request was made, invalidating this link</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate('/forgot-password')}
              className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white h-12 rounded-xl shadow-lg shadow-[#FF9800]/30"
            >
              <Lock className="w-4 h-4 mr-2" />
              Request New Reset Link
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="w-full h-12 border-2 border-[#263238]/20 hover:border-[#263238] rounded-xl"
            >
              Back to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Valid - Show Reset Form
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full p-8 border-2 border-[#4FC3F7]/30 shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#4FC3F7] to-[#0288D1] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#4FC3F7]/30">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-[#263238] mb-2 text-2xl font-bold">Set New Password</h2>
          <p className="text-[#263238]/70 text-sm">
            Create a strong password to secure your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm text-[#263238] mb-2 font-medium">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-12 px-4 pl-12 border-2 border-[#263238]/20 rounded-xl focus:border-[#4FC3F7] focus:outline-none transition"
                required
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#263238]/50">
                <Mail className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm text-[#263238] mb-2 font-medium">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full h-12 px-4 pr-12 border-2 border-[#263238]/20 rounded-xl focus:border-[#4FC3F7] focus:outline-none transition"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#263238]/50 hover:text-[#263238] transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#263238]/60">Password strength</span>
                  <span className="text-xs font-semibold" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-1.5 bg-[#263238]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 rounded-full"
                    style={{
                      width: passwordStrength.width,
                      backgroundColor: passwordStrength.color,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-[#263238] mb-2 font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full h-12 px-4 pr-12 border-2 border-[#263238]/20 rounded-xl focus:border-[#4FC3F7] focus:outline-none transition"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#263238]/50 hover:text-[#263238] transition"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Match Indicator */}
            {confirmPassword && (
              <p className={`mt-2 text-xs flex items-center gap-1.5 ${newPassword === confirmPassword ? 'text-[#4ADE80]' : 'text-red-500'
                }`}>
                {newPassword === confirmPassword ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Passwords match
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    Passwords do not match
                  </>
                )}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-[#4FC3F7]/5 border border-[#4FC3F7]/20 rounded-xl p-4">
            <p className="text-xs text-[#263238] font-semibold mb-2">Password requirements:</p>
            <ul className="text-xs text-[#263238]/70 space-y-1">
              <li className="flex items-center gap-2">
                <span className={newPassword.length >= 8 ? 'text-[#4ADE80]' : 'text-[#263238]/40'}>
                  {newPassword.length >= 8 ? '✓' : '○'}
                </span>
                At least 8 characters
              </li>
              <li className="flex items-center gap-2">
                <span className={/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? 'text-[#4ADE80]' : 'text-[#263238]/40'}>
                  {/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? '✓' : '○'}
                </span>
                Mix of uppercase and lowercase letters
              </li>
              <li className="flex items-center gap-2">
                <span className={/\d/.test(newPassword) ? 'text-[#4ADE80]' : 'text-[#263238]/40'}>
                  {/\d/.test(newPassword) ? '✓' : '○'}
                </span>
                At least one number
              </li>
              <li className="flex items-center gap-2">
                <span className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-[#4ADE80]' : 'text-[#263238]/40'}>
                  {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? '✓' : '○'}
                </span>
                At least one special character
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            className="w-full bg-[#4FC3F7] hover:bg-[#0288D1] text-white h-12 rounded-xl shadow-lg shadow-[#4FC3F7]/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Resetting Password...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-2" />
                Reset Password
              </>
            )}
          </Button>

          {/* Cancel */}
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/login')}
            className="w-full h-12 border-2 border-[#263238]/20 hover:border-[#263238] rounded-xl"
          >
            Cancel
          </Button>
        </form>
      </Card>
    </div>
  );
}