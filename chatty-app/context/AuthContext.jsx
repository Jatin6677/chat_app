import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const AuthContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL; // ⚠️ Must be set in Vercel

// ✅ Set Axios default base URL
axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // ✅ Check if token is valid and fetch user
  const checkAuth = async () => {
    try {
      axios.defaults.headers.common["token"] = token; // ✅ Set before request

      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      setAuthUser(null);
      toast.error(error?.response?.data?.message || error.message);
      console.error("Auth check failed:", error);
    }
  };

  // ✅ Login or Signup
  const login = async (type, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${type}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);
        setToken(data.token);

        // Store token in localStorage
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["token"] = data.token;

        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.error("Login error:", error);
    }
  };

  // ✅ Logout and disconnect socket
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    socket?.disconnect();
    toast.success("Logged out successfully");
  };

  // ✅ Update user profile
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body, {
        headers: {
          token: token,
        },
      });
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.error("Update profile error:", error);
    }
  };

  // ✅ Socket connection
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
      transports: ["websocket"], // More stable
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    setSocket(newSocket);
  };

  // ✅ Recheck auth when token changes
  useEffect(() => {
    axios.defaults.headers.common["token"] = token;
    if (token) {
      checkAuth();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
        checkAuth, // Exposed for profile update
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
