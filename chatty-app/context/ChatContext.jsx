import { createContext, useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { axios, socket, authUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [mediaFiles, setMediaFiles] = useState([]);

  // ✅ Fixed endpoint for getting users + unseen messages
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      setUsers(data.users);
      setUnseenMessages(data.unseenMessages || {});
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const getMessages = async (receiverId) => {
    try {
      const { data } = await axios.get(`/api/messages/${receiverId}`);
      setMessages(data.messages || []);
      fetchMediaFromMessages(data.messages);
    } catch (error) {
      toast.error("Error loading messages");
    }
  };

  const sendMessage = async (body) => {
    try {
      const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, body);
      setMessages((prev) => [...prev, data.newMessage]);

      if (data.newMessage.image) {
        setMediaFiles((prev) => [...prev, data.newMessage.image]);
      }

      socket?.emit("sendMessage", data.newMessage);
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const fetchMediaFromMessages = (messages) => {
    const media = messages
      .filter((msg) => msg.image)
      .map((msg) => msg.image);
    setMediaFiles(media);
  };

  useEffect(() => {
    socket?.on("newMessage", (msg) => {
      if (msg.senderId === selectedUser?._id) {
        setMessages((prev) => [...prev, msg]);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [msg.senderId]: (prev[msg.senderId] || 0) + 1,
        }));
      }
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [socket, selectedUser]);

  return (
    <ChatContext.Provider
      value={{
        users,
        messages,
        selectedUser,
        unseenMessages,
        mediaFiles,
        setSelectedUser,
        getUsers,
        getMessages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
