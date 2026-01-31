import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { LoadingPage } from './LoadingPage';

export function ScrollToTop() {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Start loading
    setIsLoading(true);
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // End loading after a brief moment (simulating page load)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return isLoading ? <LoadingPage /> : null;
}