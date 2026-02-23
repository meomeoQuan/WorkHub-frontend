import { Link, useNavigate } from 'react-router';
import { User as UserIcon, Zap, LogOut, Settings, Briefcase, FileText, Calendar, ChevronDown, Inbox, Crown, Sparkles, Shield, Scale } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '../contexts/AuthContext';
import type { UserModel, PaymentPlan } from '../types/User';

interface HeaderProps {
  isLoggedIn?: boolean;
  userType?: 'user' | 'admin';
  user?: UserModel | null;
  currentPath?: string;
}

export function Header({ isLoggedIn = false, user, currentPath = '/' }: HeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile/user');
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'silver':
        return 'text-gray-500';
      case 'gold':
        return 'text-yellow-500';
      default:
        return 'text-[#263238]';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'silver':
      case 'gold':
        return <Crown className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <header className="bg-white border-b border-[#263238]/10 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Navigation */}
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF9800] to-[#4FC3F7] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[#263238] block">WorkHub</span>
              <span className="text-xs text-[#263238]/60 hidden md:block">Quick Jobs, Fast Cash</span>
            </div>
          </Link>

          {/* Center Navigation */}
          {isLoggedIn && (
            <div className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
              <Link to="/jobs">
                <Button
                  variant="ghost"
                  className={`rounded-xl hover:bg-[#FF9800]/10 hover:text-[#FF9800] ${currentPath === '/jobs' ? 'bg-[#FF9800]/10 text-[#FF9800]' : 'text-[#263238]/70'
                    }`}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Browse Jobs
                </Button>
              </Link>

              {/* My Applications with Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`rounded-xl hover:bg-[#4FC3F7]/10 hover:text-[#4FC3F7] ${currentPath === '/my-applications' || currentPath === '/applications'
                      ? 'bg-[#4FC3F7]/10 text-[#4FC3F7]'
                      : 'text-[#263238]/70'
                      }`}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    My Applications
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/applications')}>
                    <Inbox className="mr-2 h-4 w-4" />
                    <span>Applications</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/my-applications')}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>My Applications</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/schedule">
                <Button
                  variant="ghost"
                  className={`rounded-xl hover:bg-[#4ADE80]/10 hover:text-[#4ADE80] ${currentPath === '/schedule' ? 'bg-[#4ADE80]/10 text-[#4ADE80]' : 'text-[#263238]/70'
                    }`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link to="/post-job/create">
                  <Button className="bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl shadow-md hover:shadow-lg transition">
                    Add New Job
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-2 border-[#263238]/20 hover:border-[#FF9800] hover:text-[#FF9800] w-10 h-10 overflow-hidden"
                    >
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#FF9800] to-[#4FC3F7] flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center">
                        {user?.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt="Profile"
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        ) : (
                          <UserIcon className="w-8 h-8 rounded-full mr-2" />
                        )}
                        <div>
                          <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Payment Plan Section */}
                    <div className="px-2 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={getPlanColor(user?.paymentPlan || 'free')}>
                            {getPlanIcon(user?.paymentPlan || 'free')}
                          </div>
                          <span className="text-sm font-medium capitalize">
                            {user?.paymentPlan || 'Free'} Plan
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => navigate('/pricing')}
                        size="sm"
                        className="w-full bg-gradient-to-r from-[#FF9800] to-[#4FC3F7] hover:from-[#F57C00] hover:to-[#4FC3F7] text-white"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Upgrade Plan
                      </Button>
                    </div>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleProfileClick}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/policy')}>
                      <Scale className="mr-2 h-4 w-4" />
                      <span>Policy</span>
                    </DropdownMenuItem>
                    {user?.userType === 'admin' && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Shield className="mr-2 h-4 w-4 text-[#FF9800]" />
                        <span className="text-[#FF9800] font-medium">Admin Dashboard</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-2 border-[#263238]/20 hover:border-[#FF9800] hover:text-[#FF9800] rounded-xl">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl shadow-md hover:shadow-lg transition">
                    Sign Up Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}