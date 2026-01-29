const Booking = require("../models/Booking");
const Car = require("../models/Car");

// Create Booking
exports.createBooking = async (req, res) => {
    try {
        const {
            user,
            car,
            pickupLocation,
            pickupDate,
            returnDate,
            totalPrice,
        } = req.body;

        // Check car availability for selected dates
        const overlappingBooking = await Booking.findOne({
            car,
            status: "Booked",
            $or: [
                {
                    pickupDate: { $lte: returnDate },
                    returnDate: { $gte: pickupDate },
                },
            ],
        });

        if (overlappingBooking) {
            return res
                .status(400)
                .json({ message: "Car not available for selected dates" });
        }

        const booking = await Booking.create({
            user,
            car,
            pickupLocation,
            pickupDate,
            returnDate,
            totalPrice,
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get User Bookings
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId })
            .populate("car")
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking)
            return res.status(404).json({ message: "Booking not found" });

        booking.status = "Cancelled";
        await booking.save();

        res.json({ message: "Booking cancelled successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
