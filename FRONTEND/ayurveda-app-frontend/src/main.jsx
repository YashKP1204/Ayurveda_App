import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from 'react-oidc-context';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/variables.css';

const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  post_logout_redirect_uri: import.meta.env.VITE_LOGOUT_URI,
  response_type: 'code',
  scope: 'email openid phone',
  automaticSilentRenew: true,
  onSigninCallback: () => {
    console.log('Sign-in callback triggered');
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider {...cognitoAuthConfig}>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);