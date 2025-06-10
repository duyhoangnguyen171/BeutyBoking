// import React, { createContext, useEffect, useState } from "react";

// export const AppContext = createContext();

// export const AppContextProvider = (props) => {
//   // Lấy token từ localStorage
//   const [user, setUser] = useState({});

//   // Đọc token từ localStorage khi khởi tạo
//   const [token, setToken] = useState(() => {
//     const storedToken = localStorage.getItem("token");
//     return storedToken ? JSON.parse(storedToken) : null;
//   });

//   const updateToken = (newToken) => {
//     if (newToken) {
//       localStorage.setItem("token", JSON.stringify(newToken));
//     } else {
//       localStorage.removeItem("token");
//     }
//     setToken(newToken);
//   };
//   // Thêm useEffect để đọc token khi mount
//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       setToken(JSON.parse(storedToken));
//     }
//   }, []);

//   useEffect(() => {
//     if (token) {
//       try {
//         // getUserById(user.nameid);
//         // Decode JWT để lấy role từ token
//         const decoded = JSON.parse(atob(token.split(".")[1]));
//         if (decoded.exp * 1000 < Date.now()) {
//           throw new Error("Token đã hết hạn");
//         }
//         if (decoded.unique_name) {
//           decoded.unique_name = decodeURIComponent(escape(decoded.unique_name));
//         }
//         console.log("Decoded payload:", decoded);
//         setUser(decoded);
//       } catch (error) {
//         console.error("Token không hợp lệ:", error);
//         setToken(null); // Xóa token nếu không hợp lệ
//         localStorage.removeItem("token");
//       }
//     }
//   }, [token]);

//   const value = {
//     user,
//     token,
//     setToken: updateToken,
//     setUser,
//   };

//   return (
//     <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
//   );
// };
import React, { createContext, useEffect, useState } from "react";

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
