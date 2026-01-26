import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
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
    status: {
        type: String,
        enum: ["confirmed", "cancelled"],
        default: "confirmed",
    },
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
