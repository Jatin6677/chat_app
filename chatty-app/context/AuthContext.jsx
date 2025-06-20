import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const AuthContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // ✅ Check authentication status
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check", {
        headers: { token: token },
      });
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      setAuthUser(null);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // ✅ Login or Signup handler
  const login = async (type, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${type}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["token"] = data.token;
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    socket?.disconnect();
    toast.success("Logged out successfully");
  };

  // ✅ Update Profile
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body, {
        headers: { token: token },
      });
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // ✅ Socket setup
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });

    setSocket(newSocket);
  };

  useEffect(() => {
    axios.defaults.headers.common["token"] = token;
    if (token) checkAuth();
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
        checkAuth, // ✅ Expose this for ProfilePage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
