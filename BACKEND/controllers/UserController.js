const User = require('../models/User');
const {
  CognitoIdentityProviderClient,
  DeleteUserCommand
}= require("@aws-sdk/client-cognito-identity-provider");
const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
// Get user profile by Cognito ID or user ID
exports.getUserProfile = async (req, res) => {
  try {
    const cognitoId = req.user.sub  // assuming you pass authenticated user info in req.user
    if (!cognitoId) return res.status(400).json({ message: 'User identifier is required' });

    const user = await User.findOne({ cognitoId }).populate('analysisResult');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile data
exports.updateUserProfile = async (req, res) => {
  try {
    const cognitoId = req.user.cognitoId || req.params.cognitoId;
    if (!cognitoId) return res.status(400).json({ message: 'User identifier is required' });

    const updateData = req.body;  // expect profile fields like age, height, etc.

    const user = await User.findOneAndUpdate({ cognitoId }, updateData, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      return res.status(401).json({ message: "Access token missing" });
    }

    // Delete from Cognito
    await client.send(new DeleteUserCommand({
      AccessToken: accessToken
    }));

    // Delete from MongoDB
    await User.deleteOne({ cognitoSub: req.user.sub });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ message: "Failed to delete account" });
  }
};



