const User = require('../models/User');

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const userPool = require('../config/awscognito');

const signUp = (req, res) => {
  console.log("inside the signupUser function");
  console.log("Received signup request with body:", req.body);
  const { email, password } = req.body;

  const attributeList = [
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'email',
      Value: email,
    }),
  ];

  userPool.signUp(email, password, attributeList, null, (err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message || JSON.stringify(err) });
    }
    console.log('User registration successful:', result.user.getUsername());
    console.log(result.user);

    return res.status(200).json({ message: 'User registered successfully', user: result.user.getUsername() });
  });
}

const login =  (req, res) => {
  console.log("inside the loginUser function");
  console.log("Received login request with body:", req.body);
  const { email, password } = req.body;

  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: email,
    Password: password,
  });

  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      console.log('User logged in successfully:', cognitoUser.getUsername());
      console.log('Access Token:', result.getAccessToken().getJwtToken());
      res.status(200).json({
        accessToken: result.getAccessToken().getJwtToken(),
        idToken: result.getIdToken().getJwtToken(),
        refreshToken: result.getRefreshToken().getToken(),
      });
    },
    onFailure: (err) => {
      res.status(400).json({ error: err.message || JSON.stringify(err) });
    },
  });
}

const confirm = async (req, res) => {
  const { email, code, password } = req.body; // Password needed to sign in after confirmation

  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  // Step 1: Confirm registration
  cognitoUser.confirmRegistration(code, true, async function (err, result) {
    if (err) {
      return res.status(400).json({ error: err.message || JSON.stringify(err) });
    }

    // Step 2: Authenticate user to get tokens and user sub
    const authDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: email,
      Password: password,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: async (session) => {
        const idToken = session.getIdToken().getJwtToken();

        // Decode token to extract Cognito user sub (unique ID)
        const decoded = JSON.parse(
          Buffer.from(idToken.split('.')[1], 'base64').toString('utf8')
        );
        const cognitoId = decoded.sub;

        // Step 3: Save to your DB
        try {
          const user = await User.create({
            email,
            cognitoId
          });

          return res.status(200).json({
            message: 'User confirmed and saved to DB',
            userId: user._id,
            cognitoId,
          });
        } catch (dbErr) {
          return res.status(500).json({
            error: 'Confirmation succeeded but saving to DB failed.',
            details: dbErr.message,
          });
        }
      },

      onFailure: (authErr) => {
        return res.status(401).json({ error: 'Confirmed but failed to authenticate.', details: authErr.message });
      },
    });
  });
};


const resendConfirmationCode = (req, res) => {
  const { email } = req.body;

  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.resendConfirmationCode((err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message || JSON.stringify(err) });
    }

    return res.status(200).json({ message: 'Confirmation code resent successfully', result });
  });
};

const changePassword = (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: email,
    Password: oldPassword,
  });

  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      cognitoUser.changePassword(oldPassword, newPassword, (err, changed) => {
        if (err) {
          return res.status(400).json({ error: err.message || JSON.stringify(err) });
        }
        res.status(200).json({ message: 'Password changed successfully.' });
      });
    },
    onFailure: (err) => {
      res.status(400).json({ error: 'Authentication failed. ' + (err.message || JSON.stringify(err)) });
    },
  });
}

const forgotPassword = (req, res) => {
  const { email } = req.body;

  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.forgotPassword({
    onSuccess: (data) => {
      res.status(200).json({ message: 'Password reset code sent.', data });
    },
    onFailure: (err) => {
      res.status(400).json({ error: err.message || JSON.stringify(err) });
    },
  });
}

module.exports = {signUp,login, confirm,resendConfirmationCode ,changePassword, forgotPassword};