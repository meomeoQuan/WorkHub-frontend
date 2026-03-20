import { Link, useNavigate } from 'react-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import { User as UserIcon, Zap, LogOut, Settings, Briefcase, FileText, Calendar, ChevronDown, Inbox, Crown, Sparkles, Shield, Scale, Bell, X, ArrowLeft, ChevronRight, Trash2 } from 'lucide-react';
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
import type { UserModel } from '../types/User';

const API_URL = import.meta.env.VITE_API_URL;

interface NotificationItem {
  notificationId: string;
  isRead: boolean;
  readAt: string | null;
  title: string;
  message: string;
  type: string;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}



interface HeaderProps {
  isLoggedIn?: boolean;
  userType?: 'user' | 'admin';
  user?: UserModel | null;
  currentPath?: string;
}

export function Header({ isLoggedIn = false, user, currentPath = '/' }: HeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      const res = await fetch(`${API_URL}/api/Notification`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setNotifications(result.data);
        }
      }
    } catch (err) { console.error('Failed to fetch notifications', err); }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      const res = await fetch(`${API_URL}/api/Notification/unread-count`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success) setUnreadCount(result.data);
      }
    } catch (err) { console.error('Failed to fetch unread count', err); }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUnreadCount();
    }
  }, [isLoggedIn, fetchUnreadCount]);

  useEffect(() => {
    if (isNotifOpen && isLoggedIn) {
      fetchNotifications();
    }
  }, [isNotifOpen, isLoggedIn, fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotifOpen]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`${API_URL}/api/Notification/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n =>
        n.notificationId === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error('Failed to mark as read', err); }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`${API_URL}/api/Notification/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() })));
      setUnreadCount(0);
    } catch (err) { console.error('Failed to mark all as read', err); }
  };

  const handleDeleteNotification = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation(); // Prevent opening/selecting
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/Notification/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const deletedNotif = notifications.find(n => n.notificationId === notificationId);
        if (deletedNotif && !deletedNotif.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
        if (selectedNotif?.notificationId === notificationId) {
          setSelectedNotif(null);
        }
      }
    } catch (err) { console.error('Failed to delete notification', err); }
  };

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

            {isLoggedIn && (
              <>
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

                {user?.userType === 'admin' && (
                  <Link to="/admin">
                    <Button
                      variant="ghost"
                      className={`rounded-xl hover:bg-[#FF9800]/10 hover:text-[#FF9800] ${currentPath.startsWith('/admin') ? 'bg-[#FF9800]/10 text-[#FF9800]' : 'text-[#263238]/70'}`}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full w-10 h-10 text-[#263238]/60 hover:text-[#FF9800] hover:bg-[#FF9800]/10 transition"
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center bg-red-500 text-white text-[8px] font-bold rounded-full translate-x-1/4 -translate-y-1/4">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>

                  {/* Notification Dropdown Panel */}
                  {isNotifOpen && (
                    <div className="absolute right-0 top-12 w-[520px] h-[400px] flex flex-col bg-white rounded-2xl shadow-2xl border border-[#263238]/10 z-50 overflow-hidden">

                      {/* === Detail View === */}
                      {selectedNotif ? (
                        <>
                          {/* Detail Header */}
                          <div className="flex items-center gap-3 px-5 py-5 border-b border-[#263238]/10 bg-gradient-to-r from-[#FF9800]/5 to-[#4FC3F7]/5 shrink-0">
                            <button
                              onClick={() => setSelectedNotif(null)}
                              className="text-[#263238]/60 hover:text-[#FF9800] transition p-1 rounded-full hover:bg-[#FF9800]/10"
                            >
                              <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h3 className="font-semibold text-[#263238] text-base">Notification Detail</h3>
                            <div className="flex-1" />
                            <button
                              onClick={(e) => handleDeleteNotification(e, selectedNotif.notificationId)}
                              className="text-[#263238]/40 hover:text-red-500 transition p-1.5 rounded-full hover:bg-red-50"
                              title="Delete notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Detail Body */}
                          <div className="p-6 flex-1 overflow-y-auto">
                            <div className="flex items-center gap-2 mb-4">
                              <span className="text-[7.5px] font-bold uppercase tracking-widest text-[#FF9800] bg-[#FF9800]/10 px-1.5 py-0 border border-[#FF9800]/20 rounded-sm">
                                {selectedNotif.type || 'general'}
                              </span>
                              <span className="text-[#263238]/20 text-[10px]">•</span>
                              <p className="text-[10px] font-medium text-[#263238]/40">
                                {new Date(selectedNotif.createdAt).toLocaleString()}
                              </p>
                            </div>

                            <h4 className="text-lg font-bold text-[#263238] mb-3">
                              {selectedNotif.title}
                            </h4>
                            <p className="text-sm text-[#263238]/70 leading-relaxed whitespace-pre-wrap">
                              {selectedNotif.message}
                            </p>

                          </div>
                        </>
                      ) : (
                        /* === List View === */
                        <>
                          {/* Header */}
                          <div className="flex items-center justify-between px-2 py-3 border-b border-[#263238]/10 bg-gradient-to-r from-[#FF9800]/5 to-[#4FC3F7]/5 shrink-0">
                            <h3 className="font-semibold text-[#263238] text-base">Notifications</h3>
                            <div className="flex items-center gap-3">
                              {unreadCount > 0 && (
                                <button
                                  onClick={handleMarkAllAsRead}
                                  className="text-xs text-[#FF9800] hover:text-[#F57C00] font-medium flex items-center gap-1 transition"
                                >
                                  Mark all read
                                </button>
                              )}
                              <button onClick={() => setIsNotifOpen(false)} className="text-[#263238]/40 hover:text-[#263238]/70 transition">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* List */}
                          <div className="flex-1 overflow-y-auto px-2 pb-2">
                            {notifications.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-10 text-[#263238]/40 h-full">
                                <Bell className="w-8 h-8 mb-2 opacity-30" />
                                <p className="text-sm">No notifications yet</p>
                              </div>
                            ) : (
                              notifications.map((notif) => (
                                <button
                                  key={notif.notificationId}
                                  onClick={() => {
                                    if (!notif.isRead) handleMarkAsRead(notif.notificationId);
                                    setSelectedNotif(notif);
                                  }}
                                  className={`w-full text-left px-4 py-3 flex items-center gap-4 transition-all duration-200 cursor-pointer hover:bg-[#FF9800]/10 rounded-xl mb-1 last:mb-0 ${!notif.isRead ? 'bg-blue-50/60 border-l-[3px] border-l-[#4FC3F7]' : 'hover:shadow-sm'
                                    }`}
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm ${!notif.isRead ? 'font-semibold text-[#263238]' : 'font-normal text-[#263238]/70'}`}>
                                      {notif.title}
                                    </p>
                                    <p className="text-xs text-[#263238]/50 mt-0.5 truncate">
                                      {notif.message}
                                    </p>
                                  </div>
                                  <span className="text-[11px] text-[#263238]/40 whitespace-nowrap shrink-0">
                                    {timeAgo(notif.createdAt)}
                                  </span>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {!notif.isRead ? (
                                      <div className="w-2.5 h-2.5 rounded-full bg-[#4FC3F7]" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-[#263238]/20" />
                                    )}
                                    <button
                                      onClick={(e) => handleDeleteNotification(e, notif.notificationId)}
                                      className="p-1.5 text-[#263238]/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors group/del"
                                      title="Delete notification"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </button>
                              ))
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

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