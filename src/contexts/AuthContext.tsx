import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { ApiResponse } from '../types/ApiResponse';
import type { LoginResponseDTO } from '../types/DTOs/LoginResponseDTO';
import type { UserDTO } from '../types/DTOs/UserDTO ';
import type { UserModel } from '../types/User';
import { mapUserDTOToUser as originalMapUserDTOToUser } from '../mappers/MappingUser';

const mapUserDTOToUser = (dto: UserDTO): UserModel => ({
  id: dto.id,
  email: dto.email,
  fullName: dto.fullName,
  userType:
    dto.role === 0
      ? "admin"
      : dto.role === 1
      ? "employer"
      : dto.role === 2
      ? "jobseeker"
      : "jobseeker", // fallback (important)
});


interface AuthContextType {
  user: UserModel | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<UserModel>) => void;
  googleLogin: (idToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserModel | null>(null);

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
  const res = await fetch("http://localhost:5222/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const result: ApiResponse<LoginResponseDTO> = await res.json();

   console.log("Login response:", result);
  if (!res.ok || !result.success) {
    console.log("Login failed:", result.message);
    throw new Error(result.message || "Login failed");
  }

  const data = result.data;
 

if (!data || !data.token || !data.userDTO) {
  throw new Error("Invalid login response");
}

  console.log("Login data:", data);

  // store JWT
  localStorage.setItem("access_token", data.token);

  // TEMP user (until /me endpoint)
const userData = data.userDTO;

  const mappedUser = mapUserDTOToUser(userData);
   console.log("Mapped User:", mappedUser);
setUser(mappedUser);
localStorage.setItem("workhub_user", JSON.stringify(mappedUser));

};


const googleLogin = async (authCode: string) => {
  const res = await fetch("http://localhost:5222/api/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authCode), // raw string ✔
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

  const mappedUser = originalMapUserDTOToUser(data.userDTO);

  setUser(mappedUser);
  localStorage.setItem("workhub_user", JSON.stringify(mappedUser));
};




  const logout = () => {
    setUser(null);
    localStorage.removeItem('workhub_user');
  };

  const updateUser = (userData: Partial<UserModel>) => {
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
        googleLogin,
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