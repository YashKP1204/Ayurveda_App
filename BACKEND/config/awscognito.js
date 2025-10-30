const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
require('dotenv').config();

const poolData = {
  UserPoolId: process.env.COGNITO_USER_POOL_ID,
  ClientId: process.env.COGNITO_CLIENT_ID,
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

module.exports = userPool;
