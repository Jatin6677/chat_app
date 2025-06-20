import React, { useContext } from 'react';
import assets from '../chat-app-assets/chat-app-assets/assets';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

function RightSideBar({ selectedUser }) {
  const { mediaFiles } = useContext(ChatContext);
  const { logout } = useContext(AuthContext);

  return (
    selectedUser && (
      <div className="w-full h-full p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-md text-white flex flex-col gap-4">
        {/* User Info */}
        <div className="flex flex-col items-center text-center gap-2">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt="User"
            className="h-20 w-20 rounded-full object-cover shadow-lg"
          />
          <h1 className="text-lg font-semibold">{selectedUser.fullName}</h1>
          <p className="text-sm text-white/70">{selectedUser.bio}</p>
        </div>

        <hr className="border-white/20" />

        {/* Media Section */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold">Shared Media</p>
          {mediaFiles.length === 0 ? (
            <p className="text-xs text-white/50">No media shared yet</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 overflow-y-auto custom-scroll max-h-40">
              {mediaFiles.map((url, index) => (
                <div
                  key={index}
                  onClick={() => window.open(url, '_blank')}
                  className="cursor-pointer"
                >
                  <img
                    src={url}
                    alt="media"
                    className="h-20 w-full object-cover rounded-md hover:scale-105 transition"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="mt-auto bg-fuchsia-500 hover:bg-fuchsia-600 text-white text-sm px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    )
  );
}

export default RightSideBar;
