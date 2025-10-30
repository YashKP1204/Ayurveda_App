import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const auth = useAuth();

  const handleSignOut = () => {
    console.log('Initiating sign-out with redirect URI:', import.meta.env.VITE_LOGOUT_URI);
    try {
      auth.signoutRedirect({
        post_logout_redirect_uri: import.meta.env.VITE_LOGOUT_URI,
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Manual fallback to ensure /logout endpoint
      const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
      const logoutUri = import.meta.env.VITE_LOGOUT_URI;
      const cognitoDomain = `https://ap-south-11pifl8vpt.auth.ap-south-1.amazoncognito.com`;
      window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    }
  };

  console.log('Auth state:', { isAuthenticated: auth.isAuthenticated, user: auth.user, pathname: window.location.pathname });

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            auth.isAuthenticated ? (
              <Dashboard signOutRedirect={handleSignOut} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            auth.isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="*"
          element={
            auth.isLoading ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
            ) : auth.error ? (
              <div style={{ textAlign: 'center', padding: '50px', color: 'var(--error)' }}>
                Error: {auth.error.message}
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;