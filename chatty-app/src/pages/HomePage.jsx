// ✅ Updated HomePage.jsx
import React, { useContext } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import RightSideBar from '../components/RightSideBar.jsx';
import ChatContainer from '../components/ChatContainer.jsx';
import { ChatContext } from '../../context/ChatContext';

function HomePage() {
  const { selectedUser, setSelectedUser } = useContext(ChatContext);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/10 w-[90%] h-[80%] flex flex-row gap-4">
        
        {/* Sidebar */}
        <div className={`${selectedUser ? 'basis-2/7' : 'basis-2/5'} h-full`}>
          <Sidebar />
        </div>

        {/* Chat Container */}
        <div className={`${selectedUser ? 'basis-3/7' : 'basis-3/5'} h-full`}>
          <ChatContainer />
        </div>

        {/* Right Sidebar */}
        {selectedUser && (
          <div className="basis-2/7 h-full">
            <RightSideBar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
