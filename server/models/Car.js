const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
    {
        make: {
            type: String,
            required: true,
        },
        model: {
            type: String,
            required: true,
        },
        type: {
            type: String, // SUV, Sedan, EV
            required: true,
        },
        pricePerDay: {
            type: Number,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);


