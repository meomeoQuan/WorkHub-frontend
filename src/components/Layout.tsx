import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { useAuth } from '../contexts/AuthContext';
import { Toaster } from './ui/sonner';

export function Layout() {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ScrollToTop />
      <Header isLoggedIn={isLoggedIn} userType={user?.userType || 'candidate'} user={user} />
      
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}