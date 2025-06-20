import React, { useContext } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import RightSideBar from '../components/RightSideBar.jsx';
import ChatContainer from '../components/ChatContainer.jsx';
import { ChatContext } from '../../context/ChatContext';

function HomePage() {
  const { selectedUser, setSelectedUser } = useContext(ChatContext);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/10 w-[90%] h-[80%] flex gap-4">
        
        {/* Sidebar - 25% */}
        <div className="basis-1/4 h-full overflow-hidden">
          <Sidebar />
        </div>

        {/* ChatContainer - 50% */}
        <div className="basis-2/4 h-full overflow-hidden">
          <ChatContainer />
        </div>

        {/* RightSidebar - 25%, visible if selectedUser */}
        <div className="basis-1/4 h-full overflow-hidden">
          {selectedUser ? (
            <RightSideBar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
          ) : (
            // Placeholder to preserve layout
            <div className="w-full h-full bg-transparent" />
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
