import { useAuth } from 'react-oidc-context';

function Signup() {
  const auth = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-primary mb-6">Ayurveda App - Sign Up</h1>
      <button
        onClick={() => auth.signinRedirect()}
        className="p-4 bg-primary text-white rounded-lg shadow-md hover:bg-secondary transition-colors"
      >
        Sign Up with Cognito
      </button>
    </div>
  );
}

export default Signup;