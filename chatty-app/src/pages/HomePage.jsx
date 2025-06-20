import React, { useContext } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import RightSideBar from '../components/RightSideBar.jsx';
import ChatContainer from '../components/ChatContainer.jsx';
import { ChatContext } from '../../context/ChatContext';

function HomePage() {
  const { selectedUser, setSelectedUser } = useContext(ChatContext);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/10 w-[90%] h-[80%] flex flex-row gap-4 transition-all duration-500 ease-in-out">
        
        {/* Sidebar */}
        <div
          className={`h-full transition-all duration-500 ease-in-out ${
            selectedUser ? 'basis-1/4' : 'basis-2/5'
          }`}
        >
          <Sidebar />
        </div>

        {/* Chat Container */}
        <div
          className={`h-full transition-all duration-500 ease-in-out ${
            selectedUser ? 'basis-2/4' : 'basis-3/5'
          }`}
        >
          <ChatContainer />
        </div>

        {/* Right Sidebar (only shown if selectedUser exists) */}
        {selectedUser && (
          <div className="basis-1/4 h-full transition-all duration-500 ease-in-out">
            <RightSideBar
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
