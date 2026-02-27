import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Zap, Mail, ArrowLeft, Send } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

export function ResendEmailConfirmation() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`${API}/api/auth/resend-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });


    console.log("Resend email response:", response);
    if (!response.ok) {
      // Handle error (e.g., show a notification)
      setIsSubmitting(false);
      return;
    }


    setIsSubmitting(true);

    // TODO: Implement actual email resend logic
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect to email confirmation page with the email parameter
      navigate(`/email-confirmation?email=${encodeURIComponent(email)}`);
    }, 1000);
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

        {/* Resend Email Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#263238]/10 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#4FC3F7] to-[#4ADE80] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Send className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-[#263238] mb-2 text-2xl">Resend Email Confirmation</h1>
            <p className="text-[#263238]/70">
              Enter your email address and we'll send you a new verification link.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-[#4FC3F7]/10 border border-[#4FC3F7]/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-[#263238]/70">
              <strong className="text-[#263238]">Haven't received your confirmation email?</strong>
              <br />
              Check your spam folder first, or request a new verification link below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-[#263238]">Email Address</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#263238]/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-[#263238]/20 rounded-xl h-12 focus-visible:ring-[#4FC3F7]"
                  required
                />
              </div>
              <p className="text-xs text-[#263238]/60 mt-2">
                This should be the email you used to register your account.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#4FC3F7] hover:bg-[#0288D1] text-white rounded-xl h-12 shadow-md hover:shadow-lg transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Resend Confirmation Email
                </>
              )}
            </Button>

            <div className="text-center pt-2">
              <p className="text-sm text-[#263238]/70">
                Already verified?{' '}
                <Link to="/login" className="text-[#FF9800] hover:text-[#F57C00] transition">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="bg-[#FF9800]/10 rounded-xl p-4 mt-6">
          <p className="text-sm text-[#263238]/70 text-center">
            <strong className="text-[#263238]">Still having trouble?</strong>
            <br />
            Contact us at{' '}
            <a href="mailto:support@workhub.com" className="text-[#FF9800] hover:text-[#F57C00] transition">
              support@workhub.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}