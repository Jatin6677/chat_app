import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import assets from '../chat-app-assets/chat-app-assets/assets';
import { formatMessageTime } from '../lib/utils';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

function ChatContainer() {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  return selectedUser ? (
    <div className="w-full h-full flex flex-col p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-md text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt="Profile"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-sm">{selectedUser.fullName}</p>
            {onlineUsers.includes(selectedUser._id) && (
              <span className="text-xs text-green-400">Online</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <img
            src={assets.arrow_icon}
            alt="Back"
            className="h-5 w-5 cursor-pointer hover:scale-105 transition"
            onClick={() => setSelectedUser(null)}
          />
          <img
            src={assets.help_icon}
            alt="Help"
            className="h-5 w-5 cursor-pointer"
          />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scroll">
        {messages.map((msg, index) => {
          const isSender = msg.senderId === authUser._id;

          return (
            <div
              key={index}
              className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] flex flex-col ${isSender ? 'items-end' : 'items-start'} gap-1`}
              >
                {/* Message Bubble */}
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt="Message"
                    className="rounded-lg max-w-full"
                  />
                ) : (
                  <p
                    className={`p-3 rounded-xl text-sm ${isSender ? 'bg-purple-600' : 'bg-white/20'}`}
                  >
                    {msg.text}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
                  {!isSender && (
                    <img
                      src={assets.profile_martin}
                      alt="Avatar"
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  )}
                  <p>{formatMessageTime(msg.createdAt)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="mt-4 flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
        <input
          type="text"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
          placeholder="Send a message..."
          className="flex-1 bg-transparent outline-none text-white placeholder-white/60 text-sm"
        />
        <input
          type="file"
          id="image"
          accept="image/png, image/jpeg"
          onChange={handleSendImage}
          hidden
        />
        <label htmlFor="image" className="cursor-pointer">
          <img
            src={assets.gallery_icon}
            alt="Attach"
            className="h-5 w-5 opacity-80 hover:opacity-100"
          />
        </label>
        <img
          src={assets.send_button}
          onClick={handleSendMessage}
          alt="Send"
          className="h-6 w-6 cursor-pointer hover:scale-110 transition"
        />
      </div>
    </div>
  ) : (
    <div className="w-full h-full flex flex-col items-center justify-center text-white/60 backdrop-blur-md rounded-lg bg-white/5">
      <img src={assets.logo_icon} alt="Logo" className="h-12 w-12 mb-4" />
      <p className="text-lg font-medium">Chat anytime, anywhere</p>
    </div>
  );
}

export default ChatContainer;
