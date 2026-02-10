import { Outlet, useLocation } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { useAuth } from '../contexts/AuthContext';
import { Toaster } from './ui/sonner';

export function Layout() {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  // Hide header and footer on admin dashboard and admin user profile
  const isAdminPage = location.pathname === '/admin' || location.pathname === '/admin/user-profile';

  // Don't show footer on jobs page
  const showFooter = location.pathname !== '/jobs' && !isAdminPage;

  // If admin page, render without layout
  if (isAdminPage) {
    return (
      <>
        <ScrollToTop />
        <Outlet />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ScrollToTop />
      <Header 
        isLoggedIn={isLoggedIn} 
        user={user}
        currentPath={location.pathname}
      />
      
      <main className="flex-1">
        <Outlet />
      </main>

      {showFooter && <Footer />}
      <Toaster position="top-right" />
    </div>
  );
}