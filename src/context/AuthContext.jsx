import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children, navigate }) => {
  const [authToken, setAuthToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [user, setUser] = useState(null);

  const API_BASE_URL =
    import.meta.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/userManagement/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      logout();
      return null;
    }
  };

  const login = async (username, password, rememberMe) => {
    setIsAuthenticating(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/userManagement/login/`,
        { username, password }
      );
      const { access, refresh } = response.data;

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", access);
      storage.setItem("refreshToken", refresh);
      setAuthToken(access);
      setRefreshToken(refresh);

      const fetchedUserDuringLogin = await fetchUserProfile(access);

      if (navigate) {
        if (
          fetchedUserDuringLogin &&
          fetchedUserDuringLogin.role === "manager"
        ) {
          navigate("/manager-dashboard");
        } else {
          navigate("/");
        }
      }
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      setAuthToken(null);
      setRefreshToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refreshToken");
      setUser(null);
      if (error.response && error.response.status === 401) {
        throw new Error("اسم المستخدم أو كلمة المرور غير صحيحة.");
      } else {
        throw new Error(
          "حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى."
        );
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    if (navigate) {
      navigate("/login");
    }
  };

  const refreshAuthToken = async () => {
    if (!refreshToken) {
      console.warn("No refresh token available. Logging out.");
      logout();
      return false;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
        refresh: refreshToken,
      });
      const { access } = response.data;
      const storage = localStorage.getItem("token")
        ? localStorage
        : sessionStorage;
      storage.setItem("token", access);
      setAuthToken(access);
      return true;
    } catch (error) {
      console.error("Token refresh failed, logging out:", error);
      logout();
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const storedRefreshToken =
        localStorage.getItem("refreshToken") ||
        sessionStorage.getItem("refreshToken");

      if (token && storedRefreshToken) {
        setAuthToken(token);
        setRefreshToken(storedRefreshToken);
        await fetchUserProfile(token);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const hasRole = (roleName) => {
    return user && user.role === roleName;
  };

  const contextValue = {
    authToken,
    refreshToken,
    user,
    isLoading,
    isAuthenticating,
    isAuthenticated: !!authToken,
    login,
    logout,
    refreshAuthToken,
    hasRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
