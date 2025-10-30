import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="app-container">
          <main className="main-card">
            <h1 className="welcome-heading">Welcome, {user?.username}!</h1>
            <p className="welcome-message">
              We're thrilled to have you here! Explore the app and enjoy a seamless experience powered by AWS Amplify.
            </p>
            <button onClick={signOut} className="signout-button">
              Sign Out
            </button>
          </main>
        </div>
      )}
    </Authenticator>
  );
}

export default App;