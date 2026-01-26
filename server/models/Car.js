const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    make: String,
    model: String,
    type: String, // e.g., SUV, Sedan
    location: String,
    availableFrom: Date,
    availableTo: Date,
    pricePerDay: Number,
});

module.exports = mongoose.model("Car", carSchema);
