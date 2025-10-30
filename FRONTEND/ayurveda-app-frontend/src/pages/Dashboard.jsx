import { useAuth } from 'react-oidc-context';

function Dashboard({ signOutRedirect }) {
  const auth = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-primary mb-6">Welcome to Ayurveda Dashboard</h1>
      <p className="text-lg text-gray-700 mb-4">
        Hello: {auth.user?.profile.email || 'User'}
      </p>
      <pre className="bg-gray-200 p-4 rounded-lg shadow-md mb-6 overflow-auto max-w-md">
        Access Token: {auth.user?.access_token}
      </pre>
      <button
        onClick={signOutRedirect}
        className="p-4 bg-primary text-white rounded-lg shadow-md hover:bg-secondary transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}

export default Dashboard;