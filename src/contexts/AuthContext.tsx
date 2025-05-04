import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { User, AuthState, UserRole } from "@/types";
import { toast } from "sonner";

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    isLoading: true,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr) as User;
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to parse user data:", error);
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } else {
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = async (
    identifier: string,
    password: string,
    role: UserRole
  ) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      let response;

      if (role === "organizer") {
        response = await authService.organizerLogin(identifier, password);
      } else {
        response = await authService.voterLogin(identifier, password);
      }

      const { token, user } = response;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success(`Welcome back, ${user.name}!`);

      // Redirect based on role
      if (user.role === "organizer") {
        navigate("/organizer/voters");
      } else {
        navigate("/voter/polls");
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      // Toast error is handled by the API interceptor
    }
  };

  const logout = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await authService.logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      navigate("/login/organizer");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await authService.register(name, email, password);
      toast.success("Registration successful! You can now log in.");
      setState((prev) => ({ ...prev, isLoading: false }));
      navigate("/login/organizer");
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      // Toast error is handled by the API interceptor
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
