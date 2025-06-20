import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate
} from "react-router-dom";

import { AuthProvider, AuthContext } from '../context/AuthContext';
import { ChatProvider } from '../context/ChatContext';
import HomePage from './pages/HomePage.jsx';
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { useContext } from 'react';

const AppRoutes = () => {
  const { authUser } = useContext(AuthContext);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<App />}>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

const Root = () => (
  <StrictMode>
    <AuthProvider>
      <ChatProvider>
        <AppRoutes />
      </ChatProvider>
    </AuthProvider>
  </StrictMode>
);

createRoot(document.getElementById('root')).render(<Root />);
