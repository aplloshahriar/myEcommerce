const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Function to handle user signup
const signupController = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if all required fields are provided
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check user already exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email Already Exists" });
    }
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to handle user login
const signInController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if all required fields are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, "jwtsecret", {
      expiresIn: "10d",
    });

    res.status(200).json({ user, token });
    console.log(user, token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get user by id
const getUserProfile = async (req, res) => {
  try {
    const userId = req.query.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = undefined;
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signupController,
  signInController,
  getUserProfile,
};
