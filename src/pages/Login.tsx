import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Card } from '../components/ui/card';
import { Zap, Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

declare global {
  interface Window {
    google: any;
  }
}



export function Login() {
  const navigate = useNavigate();
  const { login , googleLogin  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

 useEffect(() => {
  const interval = setInterval(() => {
    if (window.google) {
      clearInterval(interval);

      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: "627355940500-p6ho8e6lovbq3glle03fevfsnedrbm61.apps.googleusercontent.com",
        scope: "openid email profile",
        ux_mode: "popup",
        callback: async (response: any) => {
          await googleLogin(response.code);

          toast.success('Welcome back! Login successful.', {
          style: {
            background: '#4ADE80',
            color: '#FFFFFF',
            border: '2px solid #22C55E',
            fontSize: '14px',
            fontWeight: '600',
          },
          duration: 3000,
        });

      navigate('/');
        },
      });

      (window as any).googleClient = client;
    }
  }, 200);

  return () => clearInterval(interval);
}, []);

  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
    var role = await login(email, password);

      toast.success('Welcome back, Admin! Login successful.', {
          style: {
            background: '#4ADE80',
            color: '#FFFFFF',
            border: '2px solid #22C55E',
            fontSize: '14px',
            fontWeight: '600',
          },
          duration: 3000,
        });

    if (role === 'admin') {
    
      navigate('/admin');
      return;

    }
      navigate('/');

    } catch (error) {
     toast.error('Invalid credentials. Please try again.', {
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          border: '2px solid #DC2626',
          fontSize: '14px',
          fontWeight: '600',
        },
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
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
            <h1 className="text-[#263238] mb-2">Welcome Back!</h1>
            <p className="text-[#263238]/70">Sign in to continue your job journey</p>
          </div>


          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-[#263238]">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-[#263238]">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/40" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/40"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked : boolean) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-[#263238]/70 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Link to="/forgot-password" className="text-sm text-[#FF9800] hover:text-[#F57C00]">
                  Forgot password?
                </Link>
                <Link to="/resend-confirmation" className="text-sm text-[#4FC3F7] hover:text-[#0288D1]">
                  Send email confirmation
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white h-12 rounded-xl shadow-lg shadow-[#FF9800]/30">
              Sign In
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#263238]/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#263238]/60">Or continue with</span>
              </div>
            </div>

            <Button type="button"
              variant="outline"
              onClick={() => (window as any).googleClient.requestCode()} 
              className="w-full h-12 border-2 border-[#263238]/20 hover:border-[#FF9800] hover:text-[#FF9800] rounded-xl">
                
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Login with Google
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-[#263238]/70">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#FF9800] hover:text-[#F57C00]">
              Sign up for free
            </Link>
          </p>
        </Card>

      </div>
    </div>
  );
}