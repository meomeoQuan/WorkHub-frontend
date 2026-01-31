import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Zap, Mail, ArrowLeft, Send } from 'lucide-react';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual password reset logic
    setIsSubmitted(true);
  };

  if (isSubmitted) {
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

          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#263238]/10 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#4ADE80] to-[#4FC3F7] rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-[#263238] mb-3 text-2xl">Check your email</h1>
            
            <p className="text-[#263238]/70 mb-6">
              We've sent password reset instructions to <strong className="text-[#263238]">{email}</strong>
            </p>

            <div className="bg-[#4FC3F7]/10 border border-[#4FC3F7]/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-[#263238]/70">
                Didn't receive the email? Check your spam folder or click below to resend.
              </p>
            </div>

            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="w-full border-2 border-[#263238]/20 hover:border-[#FF9800] hover:text-[#FF9800] rounded-xl mb-3"
            >
              Resend Email
            </Button>

            <Link to="/login">
              <Button className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl shadow-md hover:shadow-lg transition">
                Return to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Reset Password Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#263238]/10 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF9800] to-[#4FC3F7] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-[#263238] mb-2 text-2xl">Forgot Password?</h1>
            <p className="text-[#263238]/70">
              No worries! Enter your email and we'll send you reset instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-[#263238]">Email</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#263238]/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-[#263238]/20 rounded-xl h-12 focus-visible:ring-[#FF9800]"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl h-12 shadow-md hover:shadow-lg transition"
            >
              Send Reset Link
            </Button>

            <div className="text-center">
              <p className="text-sm text-[#263238]/70">
                Remember your password?{' '}
                <Link to="/login" className="text-[#FF9800] hover:text-[#F57C00] transition">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Security Badge */}
        <div className="text-center mt-6">
          <p className="text-sm text-[#263238]/60">
            🔒 Secure password reset • Your data is protected
          </p>
        </div>
      </div>
    </div>
  );
}
