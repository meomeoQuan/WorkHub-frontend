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


// Queue for requests while token is being refreshed
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Global fetch interceptor for session expiry and automatic refresh
const originalFetch = window.fetch;
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  // 1. Ensure credentials: 'include' is set for all relative or API-bound calls
  // This allows the browser to send/receive the HttpOnly refresh cookie
  const modifiedInit: RequestInit = {
    ...init,
    credentials: init?.credentials || 'include',
  };

  const response = await originalFetch(input, modifiedInit);

  // 2. Handle 401 Unauthorized (unless it's the refresh call itself failing)
  if (response.status === 401 && !input.toString().includes('/api/auth/refresh')) {

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        // Retry with new token
        if (modifiedInit.headers) {
          const headers = new Headers(modifiedInit.headers);
          headers.set('Authorization', `Bearer ${token}`);
          modifiedInit.headers = headers;
        }
        return originalFetch(input, modifiedInit);
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    isRefreshing = true;
    const oldAccessToken = localStorage.getItem("access_token");

    try {
      console.log("Token expired. Attempting refresh...");
      const refreshRes = await originalFetch(`${API}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: oldAccessToken }),
        credentials: 'include' // CRITICAL: Send HttpOnly refresh cookie
      });

      if (refreshRes.ok) {
        const refreshResult: ApiResponse<LoginResponseDTO> = await refreshRes.json();
        const newToken = refreshResult.data?.token;

        if (newToken) {
          console.log("Token refreshed successfully.");
          localStorage.setItem("access_token", newToken);

          isRefreshing = false;
          processQueue(null, newToken);

          // Retry the original request
          if (modifiedInit.headers) {
            const headers = new Headers(modifiedInit.headers);
            headers.set('Authorization', `Bearer ${newToken}`);
            modifiedInit.headers = headers;
          }
          return originalFetch(input, modifiedInit);
        }
      }

      // If refresh failed (e.g. refresh token expired)
      console.warn("Refresh failed. Logging out...");
      processQueue(new Error("Refresh failed"), null);

      // Clear auth data and redirect
      localStorage.removeItem("workhub_user");
      localStorage.removeItem("access_token");
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
      return response;

    } catch (err) {
      isRefreshing = false;
      processQueue(err, null);
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
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
      credentials: 'include' // Receive HttpOnly refresh cookie
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
      credentials: 'include' // Receive HttpOnly refresh cookie
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
