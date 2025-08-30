import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import api from "../auth/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  
  const [token, setToken_] = useState(Cookies.get("token"));
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const setToken = (newToken) => {
    setToken_(newToken);
  };

  
  const getlogin = async (credentials) => {
    try {
      const response = await api.post("/login", credentials);
      const { token, user, role } = response.data;
      setToken(token);
      setUser(user);
      setRole(role);
      console.log("User:", user);
      console.log("User role:", role);

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  
  const getregister = async (userData) => {
    try {
      const response = await api.post("/registration", userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  
  const logout = () => {
    setToken(null);
    setUser(null);
    Cookies.remove("token");
    delete api.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    if (token) {
      
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      
      Cookies.set("token", token, {
        expires: 7, 
        secure: false, 
        sameSite: "strict",
      });

      
      const verifyToken = async () => {
        try {
          const response = await api.get("/me");
          setUser(response.data.user);
        } catch (error) {
          console.error("Token verification failed:", error);
          logout();
        } finally {
          setLoading(false);
        }
      };

      verifyToken();
    } else {
      delete api.defaults.headers.common["Authorization"];
      Cookies.remove("token");
      setLoading(false);
    }
  }, [token]);

  
  const contextValue = useMemo(
    () => ({
      token,
      user,
      loading,
      setToken,
      getlogin,
      getregister,
      logout,
    }),
    [token, user, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
