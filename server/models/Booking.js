const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        car: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car",
            required: true,
        },
        pickupLocation: {
            type: String,
            required: true,
        },
        pickupDate: {
            type: Date,
            required: true,
        },
        returnDate: {
            type: Date,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Booked", "Cancelled", "Completed"],
            default: "Booked",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
