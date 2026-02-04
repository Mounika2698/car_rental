const DUMMY_BOOKINGS = [
  {
    id: 101,
    reservationNumber: "DF123456",
    lastName: "Johnson",
    zipCode: "77001",
    pickupLocation: "Houston, TX 77001",
    returnLocation: "Houston, TX 77001",
    pickupDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    returnDate: new Date(Date.now() + 6 * 86400000).toISOString(),
    status: "UPCOMING",
    paymentStatus: "PAID",
    car: { makeModel: "Tesla Model 3", type: "Electric", imageUrl: "" },
    costBreakdown: { base: 240, fees: 27, total: 267 },
  },
  {
    id: 102,
    reservationNumber: "DF888222",
    lastName: "Sanchez",
    zipCode: "77002",
    pickupLocation: "Houston, TX 77002",
    returnLocation: "Houston, TX 77002",
    pickupDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    returnDate: new Date(Date.now() - 7 * 86400000).toISOString(),
    status: "PAST",
    paymentStatus: "UNPAID",
    car: { makeModel: "Audi A4", type: "Sedan", imageUrl: "" },
    costBreakdown: { base: 210, fees: 15, total: 225 },
  },
];


exports.findReservationByNumber = async (req, res) => {
  try {
    const { lastName, reservationNumber, location } = req.body || {};

    const ln = String(lastName || "").trim().toLowerCase();
    const rn = String(reservationNumber || "").trim().toUpperCase();
    const zip = String(location?.zip || "").trim();

    if (!ln || rn.length < 4 || !/^\d{5}$/.test(zip)) {
      return res.status(400).json({ message: "Invalid inputs." });
    }

    const results = DUMMY_BOOKINGS.filter((b) =>
      b.lastName.toLowerCase() === ln &&
      b.reservationNumber.toUpperCase() === rn &&
      b.zipCode === zip
    );

    return res.json({ results });
  } catch (err) {
    console.error("findReservationByNumber error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};
