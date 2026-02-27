import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { Zap, User, Building2, Mail, Lock, Briefcase, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

export function Register() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [role] = useState<number>(2); // 0 = admin, 1 = user
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');



  const handleUserRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError("");

    const payload = {
      email: userEmail,
      fullName: userName,          // ✅ matches FullName
      password: userPassword,
      confirmPassword: confirmPassword, // ✅ REQUIRED
      role: role,                  // 0 or 1
    };

    console.log("Register payload:", payload);

    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Register failed:", result);
      return;
    }

    // success → go confirm email
    navigate(`/email-confirmation?email=${encodeURIComponent(userEmail)}`);
  };





  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#263238]/70 hover:text-[#FF9800] mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <Card className="p-8 border-2 border-[#263238]/10 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF9800] to-[#4FC3F7] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-[#263238] mb-2">Join WorkHub</h1>
            <p className="text-[#263238]/70">Start earning with flexible jobs today</p>
          </div>


          <form onSubmit={handleUserRegister} className="space-y-5">
            <div>
              <Label htmlFor="candidate-name" className="text-[#263238]">Full Name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/40" />
                <Input
                  id="candidate-name"
                  placeholder="John Doe"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="pl-10 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="candidate-email" className="text-[#263238]">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/40" />
                <Input
                  id="candidate-email"
                  type="email"
                  placeholder="your@email.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="pl-10 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="candidate-password" className="text-[#263238]">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/40" />
                <Input
                  id="candidate-password"
                  type={showUserPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  className="pl-10 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/40"
                  onClick={() => setShowUserPassword(!showUserPassword)}
                >
                  {showUserPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirm-password" className="text-[#263238]">Confirm Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/40" />
                <Input
                  id="confirm-password"
                  type={showUserPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/40"
                  onClick={() => setShowUserPassword(!showUserPassword)}
                >
                  {showUserPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white h-12 rounded-xl shadow-lg shadow-[#FF9800]/30">
              <Zap className="w-4 h-4 mr-2" />
              Create Free Account
            </Button>

            <p className="text-xs text-center text-[#263238]/60">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>

          <p className="text-center mt-6 text-sm text-[#263238]/70">
            Already have an account?{' '}
            <Link to="/login" className="text-[#FF9800] hover:text-[#F57C00]">
              Sign in
            </Link>
          </p>
        </Card>

      </div>
    </div>
  );
}