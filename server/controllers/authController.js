const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require('bcrypt')

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        normalizedEmail = (email || "").trim().toLowerCase();
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ 
                code: "EMAIL_EXISTS",
                message: "This email is already registered. Please log in." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email :normalizedEmail,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Signup successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: error.message,
    });
  }
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({code: "INVALID_EMAIL",
                message: "Email does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({code: "INVALID_PASS",
                message: "Password is incorrect" }); // email exists but password is incorrect
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET /api/auth/users
 * (Example GET API)
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Forgot Password - Check if email exists
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            // Email doesn't exist - ask user to sign up
            return res.status(400).json({
                success: false,
                code: "EMAIL_NOT_FOUND",
                message: "Email not found. Please sign up to create an account."
            });
        }

        // Email exists - allow user to reset password
        res.status(200).json({
            success: true,
            message: "Email verified. You can now reset your password."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error processing password reset request"
        });
    }
};

// Reset Password - Update password using email
exports.resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Update password (remove old password, set new hashed password)
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password has been reset successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error resetting password"
        });
    }
};
