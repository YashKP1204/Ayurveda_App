const User = require('../models/User');

// POST /api/user/complete-info
exports.completeInfo = async (req, res) => {
  try {
    console.log("inside the completeInfo function");
    console.log("user info", req.user);
    console.log("Received complete info request:", req.body);
    const cognitoId = req.user.sub; // Assuming user ID is stored in JWT token
    const {
     name,
      age,
      gender,
      height,
      weight,
      physicalAttributes,  // Object: { skinType, appetite, etc. }
      biologicalAttributes // Object: { sleep, digestion, etc. }
    } = req.body;

    if (!cognitoId || !name || !age || !gender || !height || !weight) {
 
      return res.status(400).json({ message: "Required fields missing." });
    }

    let user = await User.findOne({ cognitoId });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update user with additional info
    user.name = name || user.name;
    user.age = age;
    user.gender = gender;
    user.height = height;
    user.weight = weight;
    user.physicalAttributes = physicalAttributes || {};
    user.biologicalAttributes = biologicalAttributes || {};
    user.updatedAt = new Date();

    await user.save();

    res.status(200).json({
       message: "Profile updated successfully",
        user: {
    name: user.name,
    age: user.age,
    gender: user.gender,
    height: user.height,
    weight: user.weight,
    physicalAttributes: user.physicalAttributes,
    biologicalAttributes: user.biologicalAttributes
  }
       });

  } catch (error) {
    console.error("Error completing user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


