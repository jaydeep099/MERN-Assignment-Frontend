import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (newToken,user) => {
     localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setIsAuthenticated(false);
  };

  const isLoggedIn = () => {
    const storedToken = localStorage.getItem("token");
    const loggedIn = !!storedToken;
    setIsAuthenticated(loggedIn);
    return loggedIn;
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      isAuthenticated, 
      login, 
      logout, 
      isLoggedIn 
    }}>
      {children}
    </AuthContext.Provider>
  );
};