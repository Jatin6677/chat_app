import React, { useContext, useEffect, useState } from 'react';
import assets from '../chat-app-assets/chat-app-assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

function Sidebar() {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages } = useContext(ChatContext);
  const { onlineUsers, logout } = useContext(AuthContext);

  const [input, setInput] = useState('');
  const [menuOpen, setMenuOpen] = useState(false); // 👈 Toggle menu dropdown
  const navigate = useNavigate();

  const filteredUsers = input
    ? users.filter(user => user.fullName.toLowerCase().includes(input.toLowerCase()))
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div
      className={`${selectedUser ? 'max-md:hidden' : ''} w-full h-full bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-md flex flex-col text-white relative`}
    >
      {/* Header: Logo + Menu */}
      <div className="flex items-center justify-between mb-4">
        <img src={assets.logo} alt="Logo" className="h-10" />

        {/* Menu Icon + Dropdown (Click Toggle) */}
        <div className="relative">
          <img
            src={assets.menu_icon}
            alt="Menu"
            className="h-6 cursor-pointer"
            onClick={() => setMenuOpen(prev => !prev)}
          />
          {menuOpen && (
            <div
              className="absolute top-8 right-0 bg-black/80 backdrop-blur-lg p-4 rounded-md shadow-lg flex flex-col gap-2 text-white text-sm z-10 min-w-[150px]"
              onMouseLeave={() => setMenuOpen(false)} // 👈 Optional: close on mouse leave
            >
              <p
                onClick={() => {
                  navigate('/profile');
                  setMenuOpen(false);
                }}
                className="cursor-pointer hover:text-blue-400 transition"
              >
                Edit Profile
              </p>
              <hr className="border-white/20" />
              <p
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="cursor-pointer hover:text-red-400 transition"
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-md shadow-sm w-full mb-4">
        <img src={assets.search_icon} alt="Search" className="h-4 w-4 opacity-70" />
        <input
          type="text"
          placeholder="Search User..."
          onChange={e => setInput(e.target.value)}
          className="bg-transparent outline-none text-white placeholder-white/60 w-full text-sm"
        />
      </div>

      {/* User List */}
      <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scroll">
        {filteredUsers.map(user => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/10 transition ${
              selectedUser?._id === user._id ? 'bg-white/20' : ''
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt="User"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <p className="font-medium text-sm">{user.fullName}</p>
              <span
                className={`text-xs ${
                  onlineUsers.includes(user._id) ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
              </span>
            </div>

            {unseenMessages[user._id] > 0 && (
              <div className="ml-auto h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-semibold text-white">
                {unseenMessages[user._id]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
