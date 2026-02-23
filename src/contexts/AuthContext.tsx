import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { ApiResponse } from '../types/ApiResponse';
import type { LoginResponseDTO } from '../types/DTOs/AuthDTOs/LoginResponseDTO';
import type { UserModel } from '../types/User';
import { mapUserDTOToUser } from '../mappers/MappingUser';

const API = import.meta.env.VITE_API_URL;

console.log("AuthContext using API URL:", API);
export type PaymentPlan = 'free' | 'silver' | 'gold';


interface AuthContextType {
  user: UserModel | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<string>;
  logout: () => void;
  updateUser: (userData: Partial<UserModel>) => void;
  upgradePlan: (plan: PaymentPlan) => void;
  fetchPlan: () => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


// Global fetch interceptor for session expiry
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  if (response.status === 401) {
    // Clear auth data
    localStorage.removeItem("workhub_user");
    localStorage.removeItem("access_token");

    // Force redirect to login
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login?expired=true';
    }
  }
  return response;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserModel | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('workhub_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure paymentPlan exists for backward compatibility
        if (!parsedUser.paymentPlan) {
          parsedUser.paymentPlan = 'free';
        }
        setUser(parsedUser);
        // Fetch latest plan to sync
        fetchPlan();
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('workhub_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<string> => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result: ApiResponse<LoginResponseDTO> = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || "Login failed");
    }

    const data = result.data;

    if (!data || !data.token || !data.userDTO) {
      throw new Error("Invalid login response");
    }

    localStorage.setItem("access_token", data.token);

    console.log("Incoming UserDTO:", data.userDTO);
    const mappedUser = mapUserDTOToUser(data.userDTO);

    setUser(mappedUser);
    localStorage.setItem("workhub_user", JSON.stringify(mappedUser));
    return mappedUser.userType; // 👈 return role
  };

  const googleLogin = async (authCode: string): Promise<void> => {
    const res = await fetch(`${API}/api/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authCode),
    });

    const result: ApiResponse<LoginResponseDTO> = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || "Google login failed");
    }

    const data = result.data;

    if (!data || !data.token || !data.userDTO) {
      throw new Error("Invalid login response");
    }

    localStorage.setItem("access_token", data.token);

    const mappedUser = mapUserDTOToUser(data.userDTO);

    setUser(mappedUser);
    localStorage.setItem("workhub_user", JSON.stringify(mappedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("workhub_user");
    localStorage.removeItem("access_token"); // IMPORTANT
  };


  const updateUser = (userData: Partial<UserModel>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('workhub_user', JSON.stringify(updatedUser));
    }
  };

  const upgradePlan = (plan: PaymentPlan) => {
    if (user) {
      const updatedUser = { ...user, paymentPlan: plan };
      setUser(updatedUser);
      localStorage.setItem('workhub_user', JSON.stringify(updatedUser));
    }
  };

  const fetchPlan = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API}/api/PayOs/get-subscription`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const result: ApiResponse<any> = await res.json();
        if (result.success && result.data) {
          const planData = result.data;
          updateUser({
            paymentPlan: planData.plan,
            subscription: {
              plan: planData.plan,
              isActive: planData.isActive,
              startAt: planData.startAt,
              endAt: planData.endAt
            }
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch subscription plan:", error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn: !!user,
      login, logout, updateUser, upgradePlan, googleLogin, fetchPlan
    }}>
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
