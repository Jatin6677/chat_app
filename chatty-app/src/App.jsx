import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import bgImage from './pexels-lilartsy-1213447.jpg';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <Toaster />

      {/* ✅ Wrap outlet in error boundary */}
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}

export default App;
