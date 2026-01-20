const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
        success: true,
        message: "Signup successful"
    });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({
        success: true,
        token
    });
};

// Forgot Password - Generate reset token/OTP
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            // For security, don't reveal if email exists
            return res.status(200).json({
                success: true,
                message: "If the email exists, a password reset link has been sent."
            });
        }

        // Generate reset token (OTP-like 6-digit code or token)
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now

        // Save reset token to user
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // In production, send email with reset link
        // For now, we'll return the token (in production, this should be sent via email)
        // Reset link format: /reset-password?token=RESET_TOKEN
        const resetLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

        // TODO: Send email with resetLink using nodemailer or similar
        // For development, log the link
        console.log("Password reset link:", resetLink);

        res.status(200).json({
            success: true,
            message: "If the email exists, a password reset link has been sent.",
            // Remove this in production - only for development
            resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error processing password reset request"
        });
    }
};

// Reset Password - Verify token and update password
exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: "Token and password are required"
            });
        }

        // Find user with valid reset token
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() } // Token not expired
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        // Update password
        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
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
