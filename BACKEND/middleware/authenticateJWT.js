const { CognitoJwtVerifier } = require("aws-jwt-verify");

// Initialize your verifier with your User Pool and App Client ID
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,  // e.g., 'ap-south-1_XXXX'
  tokenUse: "access",                            // or "id" if you want to verify ID tokens
  clientId: process.env.COGNITO_CLIENT_ID,       // Your App Client ID from Cognito
});

// Middleware function
const authenticateJWT = async (req, res, next) => {
  try {
    console.log("inside the authenticateJWT middleware");


    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Missing or malformed authorization header");

      return res.status(401).json({ message: "Missing or malformed authorization header" });
    }
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      console.error("No token provided in authorization header");
      return res.status(401).json({ message: "No token provided" });
    }


    // Verify token
    const payload = await verifier.verify(token);
    console.log("JWT payload:", payload);
    if (!payload) {
      console.error("Invalid token payload");
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach payload info to req.user for use in routes
    req.user = payload;
    console.log("Authenticated user:", req.user);
    
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateJWT;
