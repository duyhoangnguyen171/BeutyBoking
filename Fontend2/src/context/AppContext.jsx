import React, { createContext, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

const decodeJWT = (token) => {
  if (!token?.split) return null;
  try {
    const payload = token.split(".")[1];
    return JSON.parse(decodeURIComponent(escape(atob(payload))));
  } catch {
    return null;
  }
};

const isTokenValid = (decoded) => {
  if (!decoded?.exp) return false;
  return decoded.exp * 1000 > Date.now() - 30000;
};

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, _setToken] = useState(() => {
    const stored = localStorage.getItem("token");
    return stored ? JSON.parse(stored) : null;
  });
  // const baseURL = "https://localhost:7169/api";

  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", JSON.stringify(newToken));
    } else {
      localStorage.removeItem("token");
    }
    _setToken(newToken);
  };

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    const decoded = decodeJWT(token);
    if (!decoded || !isTokenValid(decoded)) {
      setToken(null);
      return;
    }

    setUser(decoded);
  }, [token]);

  const value = {
    user,
    token,
    setToken,
    setUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
