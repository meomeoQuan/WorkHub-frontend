import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  DollarSign,
  Users,
  Briefcase,
  TrendingUp,
  Crown,
  Shield,
  Settings,
  BarChart3,
  UserCog,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  Unlock,
  LogOut,
  Home,
  Activity,
  Database,
  Zap,
  Target,
  Layers,
  Terminal,
  Lock,
  Star,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { PaymentPlan } from '../contexts/AuthContext';

// Mock data for admin analytics
const revenueData = {
  total: 45678.50,
  monthly: 12340.00,
  growth: 23.5,
  transactions: 156,
  daily: [1200, 1900, 1500, 2200, 1800, 2400, 2100],
  monthly_data: [8500, 9200, 10100, 9800, 11200, 10500, 11800, 12100, 11500, 12800, 11900, 12340],
};

const userStats = {
  total: 2456,
  active: 1834,
  premium: 423,
  newThisMonth: 145,
  growth: [1850, 1920, 2010, 2100, 2180, 2250, 2320, 2380, 2420, 2456],
};

const jobStats = {
  total: 1234,
  active: 987,
  filled: 247,
  pendingApproval: 15,
};

// Mock user accounts data
const mockUsers = [
  {
    id: '1',
    email: 'jobseeker@gmail.com',
    fullName: 'John Doe',
    userType: 'user' as const,
    paymentPlan: 'free' as PaymentPlan,
    status: 'active' as const,
    revenue: 0,
    joinDate: '2024-01-15',
    lastActive: '2024-02-08',
    rating: 4.2,
  },
  {
    id: '2',
    email: 'employer@gmail.com',
    fullName: 'Company HR',
    userType: 'user' as const,
    paymentPlan: 'gold' as PaymentPlan,
    status: 'active' as const,
    revenue: 19.99,
    joinDate: '2024-01-10',
    lastActive: '2024-02-09',
    rating: 4.9,
  },
  {
    id: '3',
    email: 'sarah.wilson@gmail.com',
    fullName: 'Sarah Wilson',
    userType: 'user' as const,
    paymentPlan: 'silver' as PaymentPlan,
    status: 'active' as const,
    revenue: 9.99,
    joinDate: '2024-01-20',
    lastActive: '2024-02-07',
    rating: 4.5,
  },
  {
    id: '4',
    email: 'mike.tech@gmail.com',
    fullName: 'Mike Johnson',
    userType: 'user' as const,
    paymentPlan: 'gold' as PaymentPlan,
    status: 'active' as const,
    revenue: 49.99,
    joinDate: '2024-01-05',
    lastActive: '2024-02-09',
    rating: 4.8,
  },
  {
    id: '5',
    email: 'lisa.marketing@gmail.com',
    fullName: 'Lisa Anderson',
    userType: 'user' as const,
    paymentPlan: 'gold' as PaymentPlan,
    status: 'suspended' as const,
    revenue: 19.99,
    joinDate: '2024-02-01',
    lastActive: '2024-02-05',
    rating: 3.8,
  },
  {
    id: '6',
    email: 'david.smith@gmail.com',
    fullName: 'David Smith',
    userType: 'user' as const,
    paymentPlan: 'free' as PaymentPlan,
    status: 'active' as const,
    revenue: 0,
    joinDate: '2024-02-03',
    lastActive: '2024-02-09',
    rating: 4.3,
  },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [users, setUsers] = useState(mockUsers);
  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'users' | 'revenue' | 'jobs' | 'settings'>('dashboard');
  const revenueChartRef = useRef<HTMLCanvasElement>(null);
  const userGrowthChartRef = useRef<HTMLCanvasElement>(null);
  const planDistributionRef = useRef<HTMLCanvasElement>(null);

  // Redirect if not admin
  useEffect(() => {
    if (user?.userType !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Initialize Chart.js charts
  useEffect(() => {
    const loadCharts = async () => {
      const Chart = (await import('chart.js/auto')).default;

      // Revenue Chart
      if (revenueChartRef.current) {
        const ctx = revenueChartRef.current.getContext('2d');
        if (ctx) {
          // Destroy existing chart
          const existingChart = Chart.getChart(revenueChartRef.current);
          if (existingChart) existingChart.destroy();

          new Chart(ctx, {
            type: 'line',
            data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              datasets: [{
                label: 'Monthly Revenue',
                data: revenueData.monthly_data,
                borderColor: '#A855F7',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#A855F7',
                pointBorderColor: '#000',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  backgroundColor: '#1a1a1a',
                  borderColor: '#A855F7',
                  borderWidth: 2,
                  titleColor: '#A855F7',
                  bodyColor: '#fff',
                  padding: 12,
                  displayColors: false,
                  callbacks: {
                    label: (context) => `$${context.parsed.y.toLocaleString()}`
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(168, 85, 247, 0.1)',
                  },
                  ticks: {
                    color: '#A855F7',
                    callback: (value) => '$' + value
                  }
                },
                x: {
                  grid: {
                    color: 'rgba(168, 85, 247, 0.1)',
                  },
                  ticks: {
                    color: '#A855F7',
                  }
                }
              }
            }
          });
        }
      }

      // User Growth Chart
      if (userGrowthChartRef.current) {
        const ctx = userGrowthChartRef.current.getContext('2d');
        if (ctx) {
          const existingChart = Chart.getChart(userGrowthChartRef.current);
          if (existingChart) existingChart.destroy();

          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10'],
              datasets: [{
                label: 'Total Users',
                data: userStats.growth,
                backgroundColor: 'rgba(168, 85, 247, 0.8)',
                borderColor: '#A855F7',
                borderWidth: 2,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  backgroundColor: '#1a1a1a',
                  borderColor: '#A855F7',
                  borderWidth: 2,
                  titleColor: '#A855F7',
                  bodyColor: '#fff',
                  padding: 12,
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(168, 85, 247, 0.1)',
                  },
                  ticks: {
                    color: '#A855F7',
                  }
                },
                x: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    color: '#A855F7',
                  }
                }
              }
            }
          });
        }
      }

      // Plan Distribution Chart
      if (planDistributionRef.current) {
        const ctx = planDistributionRef.current.getContext('2d');
        if (ctx) {
          const existingChart = Chart.getChart(planDistributionRef.current);
          if (existingChart) existingChart.destroy();

          new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ['Gold', 'Silver', 'Free'],
              datasets: [{
                data: [168, 255, 2033],
                backgroundColor: [
                  'rgba(234, 179, 8, 0.8)',
                  'rgba(156, 163, 175, 0.8)',
                  'rgba(100, 116, 139, 0.8)',
                ],
                borderColor: ['#eab308', '#9ca3af', '#64748b'],
                borderWidth: 2,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    color: '#A855F7',
                    padding: 15,
                    font: {
                      size: 12,
                    }
                  }
                },
                tooltip: {
                  backgroundColor: '#1a1a1a',
                  borderColor: '#A855F7',
                  borderWidth: 2,
                  titleColor: '#A855F7',
                  bodyColor: '#fff',
                  padding: 12,
                }
              }
            }
          });
        }
      }
    };

    if (selectedTab === 'dashboard' || selectedTab === 'revenue') {
      loadCharts();
    }
  }, [selectedTab]);

  if (user?.userType !== 'admin') {
    return null;
  }

  const handleSuspendUser = (userId: string) => {
    setUsers(users.map(u =>
      u.id === userId
        ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' as const }
        : u
    ));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getPlanBadge = (plan: PaymentPlan) => {
    const styles: Record<string, string> = {
      gold: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      silver: 'bg-gray-400/20 text-gray-300 border-gray-400',
      free: 'bg-slate-500/20 text-slate-300 border-slate-500',
    };
    return styles[plan] || styles.free;
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Cyberpunk Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Left Sidebar */}
      <aside className="w-72 bg-black/50 backdrop-blur-xl border-r border-purple-500/30 relative z-10">
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-purple-500/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-lg flex items-center justify-center relative">
                <Shield className="w-7 h-7 text-white" />
                <div className="absolute inset-0 bg-purple-500 rounded-lg blur-xl opacity-50"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
                  ADMIN PANEL
                </h1>
                <p className="text-xs text-purple-400/60">System Control v2.0</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-purple-500/30">
            <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{user?.fullName.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-purple-300 truncate">{user?.fullName}</p>
                <p className="text-xs text-purple-400/60 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setSelectedTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${selectedTab === 'dashboard'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-lg shadow-purple-500/20'
                : 'text-purple-400/60 hover:bg-purple-500/10 hover:text-purple-300'
                }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => setSelectedTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${selectedTab === 'users'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-lg shadow-purple-500/20'
                : 'text-purple-400/60 hover:bg-purple-500/10 hover:text-purple-300'
                }`}
            >
              <UserCog className="w-5 h-5" />
              <span className="font-medium">User Management</span>
            </button>

            <button
              onClick={() => setSelectedTab('revenue')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${selectedTab === 'revenue'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-lg shadow-purple-500/20'
                : 'text-purple-400/60 hover:bg-purple-500/10 hover:text-purple-300'
                }`}
            >
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Revenue Analytics</span>
            </button>

            <button
              onClick={() => setSelectedTab('jobs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${selectedTab === 'jobs'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-lg shadow-purple-500/20'
                : 'text-purple-400/60 hover:bg-purple-500/10 hover:text-purple-300'
                }`}
            >
              <Briefcase className="w-5 h-5" />
              <span className="font-medium">Job Listings</span>
            </button>

            <button
              onClick={() => setSelectedTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${selectedTab === 'settings'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-lg shadow-purple-500/20'
                : 'text-purple-400/60 hover:bg-purple-500/10 hover:text-purple-300'
                }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>

            <div className="border-t border-purple-500/30 my-4"></div>

            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-purple-400/60 hover:bg-purple-500/10 hover:text-purple-300 transition-all"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Back to Site</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400/60 hover:bg-red-500/10 hover:text-red-300 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-purple-500/30">
            <div className="flex items-center justify-between text-xs text-purple-400/40">
              <span>© 2024 WorkHub</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10">
        {/* Dashboard Tab */}
        {selectedTab === 'dashboard' && (
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 mb-2">
                System Overview
              </h2>
              <p className="text-purple-400/60">Real-time analytics and monitoring</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Revenue */}
              <div className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 relative overflow-hidden group hover:border-purple-500/50 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                      <DollarSign className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-xs text-green-400 flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/30">
                      <TrendingUp className="w-3 h-3" />
                      +{revenueData.growth}%
                    </span>
                  </div>
                  <p className="text-purple-400/60 text-sm mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-purple-300">${revenueData.total.toLocaleString()}</p>
                  <p className="text-xs text-purple-400/40 mt-2">${revenueData.monthly.toLocaleString()} this month</p>
                </div>
              </div>

              {/* Total Users */}
              <div className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 relative overflow-hidden group hover:border-purple-500/50 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl group-hover:bg-fuchsia-500/20 transition-all"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-fuchsia-500/20 rounded-lg flex items-center justify-center border border-fuchsia-500/30">
                      <Users className="w-6 h-6 text-fuchsia-400" />
                    </div>
                    <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-full border border-cyan-500/30">
                      +{userStats.newThisMonth} new
                    </span>
                  </div>
                  <p className="text-purple-400/60 text-sm mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-purple-300">{userStats.total.toLocaleString()}</p>
                  <p className="text-xs text-purple-400/40 mt-2">{userStats.active.toLocaleString()} active</p>
                </div>
              </div>

              {/* Premium Users */}
              <div className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 relative overflow-hidden group hover:border-purple-500/50 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/30">
                      <Crown className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                  <p className="text-purple-400/60 text-sm mb-1">Premium Users</p>
                  <p className="text-3xl font-bold text-purple-300">{userStats.premium}</p>
                  <p className="text-xs text-purple-400/40 mt-2">{((userStats.premium / userStats.total) * 100).toFixed(1)}% conversion</p>
                </div>
              </div>

              {/* Total Jobs */}
              <div className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 relative overflow-hidden group hover:border-purple-500/50 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
                      <Briefcase className="w-6 h-6 text-cyan-400" />
                    </div>
                    <span className="text-xs text-orange-400 bg-orange-500/10 px-2 py-1 rounded-full border border-orange-500/30">
                      {jobStats.pendingApproval} pending
                    </span>
                  </div>
                  <p className="text-purple-400/60 text-sm mb-1">Total Jobs</p>
                  <p className="text-3xl font-bold text-purple-300">{jobStats.total.toLocaleString()}</p>
                  <p className="text-xs text-purple-400/40 mt-2">{jobStats.active.toLocaleString()} active</p>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Chart */}
              <div className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Revenue Trend
                </h3>
                <div className="h-64">
                  <canvas ref={revenueChartRef}></canvas>
                </div>
              </div>

              {/* User Growth Chart */}
              <div className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  User Growth
                </h3>
                <div className="h-64">
                  <canvas ref={userGrowthChartRef}></canvas>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-purple-300 mb-6 flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                System Activity
              </h3>
              <div className="space-y-3">
                {[
                  { icon: CheckCircle, text: 'New user registration: david.smith@gmail.com', time: '5 min ago', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
                  { icon: DollarSign, text: 'Payment received: $19.99 (Gold Plan)', time: '12 min ago', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
                  { icon: AlertCircle, text: 'Job post flagged for review', time: '23 min ago', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
                  { icon: CheckCircle, text: 'User upgraded to Gold Plan', time: '1 hour ago', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
                  { icon: XCircle, text: 'Account suspended: policy violation', time: '2 hours ago', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
                ].map((activity, index) => (
                  <div key={index} className={`flex items-start gap-3 p-4 ${activity.bg} border ${activity.border} rounded-lg hover:scale-[1.02] transition-all`}>
                    <activity.icon className={`w-5 h-5 ${activity.color} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1">
                      <p className="text-sm text-purple-300">{activity.text}</p>
                      <p className="text-xs text-purple-400/60 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {selectedTab === 'users' && (
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 mb-2">
                User Management
              </h2>
              <p className="text-purple-400/60">Monitor and control user accounts</p>
            </div>

            <div className="space-y-4">
              {users.map((userAccount) => (
                <div key={userAccount.id} className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center text-white font-bold text-lg relative">
                        {userAccount.fullName.charAt(0)}
                        <div className="absolute inset-0 bg-purple-500 rounded-xl blur-xl opacity-30"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-purple-300 text-lg">{userAccount.fullName}</span>
                          <span className={`text-xs px-3 py-1 rounded-full border ${getPlanBadge(userAccount.paymentPlan)} font-bold uppercase`}>
                            {userAccount.paymentPlan}
                          </span>
                          {userAccount.status === 'suspended' && (
                            <span className="text-xs px-3 py-1 rounded-full border bg-red-500/20 text-red-400 border-red-500/30 font-bold uppercase">
                              Suspended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-purple-400/70 mb-2 flex items-center gap-2">
                          {userAccount.email}
                          <span className="flex items-center gap-1 text-yellow-400">
                            <Star className="w-3.5 h-3.5 fill-yellow-400" />
                            <span className="font-semibold text-sm">{userAccount.rating}</span>
                          </span>
                        </p>
                        <div className="flex items-center gap-4 text-xs text-purple-400/50">
                          <span>Joined: {userAccount.joinDate}</span>
                          <span>•</span>
                          <span>Last active: {userAccount.lastActive}</span>
                          <span>•</span>
                          <span className="text-green-400 font-semibold">
                            Revenue: ${userAccount.revenue.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/admin/user-profile?userId=${userAccount.id}`)}
                        className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition-all flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleSuspendUser(userAccount.id)}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${userAccount.status === 'suspended'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                          }`}
                      >
                        {userAccount.status === 'suspended' ? (
                          <>
                            <Unlock className="w-4 h-4" />
                            Activate
                          </>
                        ) : (
                          <>
                            <Ban className="w-4 h-4" />
                            Suspend
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {selectedTab === 'revenue' && (
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 mb-2">
                Revenue Analytics
              </h2>
              <p className="text-purple-400/60">Financial insights and metrics</p>
            </div>

            {/* Revenue Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6">
                <h3 className="text-sm text-purple-400/60 mb-2">Monthly Revenue</h3>
                <p className="text-3xl font-bold text-purple-300 mb-2">
                  ${revenueData.monthly.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{revenueData.growth}% from last month</span>
                </div>
              </div>

              <div className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6">
                <h3 className="text-sm text-purple-400/60 mb-2">Total Transactions</h3>
                <p className="text-3xl font-bold text-purple-300 mb-2">
                  {revenueData.transactions}
                </p>
                <p className="text-sm text-purple-400/60">This month</p>
              </div>

              <div className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6">
                <h3 className="text-sm text-purple-400/60 mb-2">Average Transaction</h3>
                <p className="text-3xl font-bold text-purple-300 mb-2">
                  ${(revenueData.monthly / revenueData.transactions).toFixed(2)}
                </p>
                <p className="text-sm text-purple-400/60">Per transaction</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-300 mb-4">Revenue Trend</h3>
                <div className="h-80">
                  <canvas ref={revenueChartRef}></canvas>
                </div>
              </div>

              <div className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-300 mb-4">Plan Distribution</h3>
                <div className="h-80 flex items-center justify-center">
                  <canvas ref={planDistributionRef}></canvas>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-purple-300 mb-6">Recent Transactions</h3>
              <div className="space-y-3">
                {[
                  { user: 'Mike Johnson', plan: 'Gold', amount: 19.99, date: '2024-02-09', status: 'completed' },
                  { user: 'Company HR', plan: 'Gold', amount: 19.99, date: '2024-02-08', status: 'completed' },
                  { user: 'Sarah Wilson', plan: 'Silver', amount: 9.99, date: '2024-02-08', status: 'completed' },
                  { user: 'Lisa Anderson', plan: 'Gold', amount: 19.99, date: '2024-02-07', status: 'completed' },
                  { user: 'Robert Chen', plan: 'Gold', amount: 19.99, date: '2024-02-06', status: 'pending' },
                ].map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg hover:bg-purple-500/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {transaction.user.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-purple-300">{transaction.user}</p>
                        <p className="text-sm text-purple-400/60">{transaction.plan} Plan • {transaction.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-purple-300 text-lg">${transaction.amount}</span>
                      <span className={`text-xs px-3 py-1 rounded-full border font-bold uppercase ${transaction.status === 'completed'
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                        }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {selectedTab === 'jobs' && (
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 mb-2">
                Job Listings
              </h2>
              <p className="text-purple-400/60">Manage and moderate job posts</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Database className="w-8 h-8 text-purple-400" />
                  <span className="text-2xl font-bold text-purple-300">{jobStats.total}</span>
                </div>
                <p className="text-sm text-purple-400/60">Total Jobs</p>
              </div>

              <div className="bg-black/50 backdrop-blur-xl border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <span className="text-2xl font-bold text-green-300">{jobStats.active}</span>
                </div>
                <p className="text-sm text-purple-400/60">Active Jobs</p>
              </div>

              <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-8 h-8 text-cyan-400" />
                  <span className="text-2xl font-bold text-cyan-300">{jobStats.filled}</span>
                </div>
                <p className="text-sm text-purple-400/60">Filled</p>
              </div>

              <div className="bg-black/50 backdrop-blur-xl border border-orange-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="w-8 h-8 text-orange-400" />
                  <span className="text-2xl font-bold text-orange-300">{jobStats.pendingApproval}</span>
                </div>
                <p className="text-sm text-purple-400/60">Pending Review</p>
              </div>
            </div>

            <div className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Layers className="w-16 h-16 text-purple-400/40 mx-auto mb-4" />
                  <p className="text-purple-400/60">Job management interface coming soon</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {selectedTab === 'settings' && (
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 mb-2">
                System Settings
              </h2>
              <p className="text-purple-400/60">Configure system preferences</p>
            </div>

            <div className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Lock className="w-16 h-16 text-purple-400/40 mx-auto mb-4" />
                  <p className="text-purple-400/60">Settings panel under development</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}