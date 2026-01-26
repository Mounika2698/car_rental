import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

export const searchAvailableCars = async (req, res) => {
    try {
        const { location, pickupDate, returnDate, type } = req.query;

        if (!location || !pickupDate || !returnDate) {
            return res.status(400).json({
                message: "Missing required search parameters",
            });
        }

        const pickup = new Date(pickupDate);
        const drop = new Date(returnDate);

        // 1️⃣ Find overlapping bookings
        const overlappingBookings = await Booking.find({
            status: "confirmed",
            pickupDate: { $lt: drop },
            returnDate: { $gt: pickup },
        }).select("carId");

        const bookedCarIds = overlappingBookings.map(
            (booking) => booking.carId
        );

        // 2️⃣ Find cars NOT in bookedCarIds
        const query = {
            location,
            _id: { $nin: bookedCarIds },
        };

        if (type) {
            query.type = type;
        }

        const availableCars = await Car.find(query);

        return res.status(200).json({
            total: availableCars.length,
            cars: availableCars,
        });

    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({
            message: "Server error while searching cars",
        });
    }
};
