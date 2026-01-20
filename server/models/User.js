const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },
    resetToken: String,
    resetTokenExpiry: Date
});

module.exports = mongoose.model("User", userSchema);