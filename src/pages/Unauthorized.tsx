import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ShieldX, ArrowLeft, Home, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Unauthorized() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <Card className="p-8 md:p-12 border-2 border-[#263238]/10 shadow-xl text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-[#FF9800]/20 to-[#FF9800]/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#FF9800]/30">
            <ShieldX className="w-12 h-12 text-[#FF9800]" />
          </div>

          {/* Title */}
          <h1 className="text-[#263238] mb-4">Access Denied</h1>

          {/* Message */}
          <p className="text-[#263238]/70 mb-2 text-lg">
            Oops! You don't have permission to access this page.
          </p>
          
          {isLoggedIn ? (
            <p className="text-[#263238]/60 mb-8">
              Your current account type ({user?.userType === 'candidate' ? 'Job Seeker' : 'Employer'}) doesn't have access to this resource.
            </p>
          ) : (
            <p className="text-[#263238]/60 mb-8">
              Please log in with the appropriate account to access this page.
            </p>
          )}

          {/* Illustration */}
          <div className="my-8">
            <svg
              className="w-64 h-48 mx-auto"
              viewBox="0 0 200 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Lock Body */}
              <rect x="70" y="80" width="60" height="50" rx="8" fill="#FF9800" opacity="0.2" />
              <rect x="70" y="80" width="60" height="50" rx="8" stroke="#FF9800" strokeWidth="3" fill="none" />
              
              {/* Lock Shackle */}
              <path
                d="M 85 80 L 85 60 Q 85 40, 100 40 Q 115 40, 115 60 L 115 80"
                stroke="#FF9800"
                strokeWidth="3"
                fill="none"
              />
              
              {/* Keyhole */}
              <circle cx="100" cy="95" r="6" fill="#FF9800" />
              <rect x="97" y="95" width="6" height="15" rx="3" fill="#FF9800" />
              
              {/* Prohibition Circle */}
              <circle cx="100" cy="75" r="60" stroke="#263238" strokeWidth="2" fill="none" opacity="0.3" />
              <line x1="60" y1="115" x2="140" y2="35" stroke="#263238" strokeWidth="3" opacity="0.3" />
            </svg>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-2 border-[#263238]/20 hover:border-[#4FC3F7] hover:text-[#4FC3F7] rounded-xl h-12 px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>

            <Button
              onClick={() => navigate('/')}
              className="bg-[#4FC3F7] hover:bg-[#0288D1] text-white rounded-xl shadow-lg h-12 px-6"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>

            {!isLoggedIn && (
              <Button
                onClick={() => navigate('/login')}
                className="bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl shadow-lg h-12 px-6"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-[#FAFAFA] rounded-xl border border-[#263238]/10">
            <p className="text-sm text-[#263238]/70">
              Need help? Contact our support team or check your account permissions.
            </p>
          </div>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#263238]/60">
            Error Code: 403 - Forbidden
          </p>
        </div>
      </div>
    </div>
  );
}
