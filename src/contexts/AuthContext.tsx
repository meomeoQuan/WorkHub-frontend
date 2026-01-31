import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
  userType: 'candidate' | 'employer';
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('workhub_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('workhub_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Hardcoded credentials check
    const validAccounts = [
      { email: 'jobseeker@gmail.com', password: '123', userType: 'candidate' as const, fullName: 'Job Seeker' },
      { email: 'employer@gmail.com', password: '123', userType: 'employer' as const, fullName: 'Employer' }
    ];

    const account = validAccounts.find(acc => acc.email === email && acc.password === password);

    if (!account) {
      throw new Error('Invalid credentials');
    }

    // Create user data based on matched account
    const userData: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: account.email,
      fullName: account.fullName,
      userType: account.userType,
      profileImage: undefined,
    };

    setUser(userData);
    localStorage.setItem('workhub_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('workhub_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('workhub_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}