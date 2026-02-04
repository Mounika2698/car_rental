const router = require("express").Router();
const { findReservationByNumber } = require("../controllers/manageBookingController");

router.post("/reservation-number", findReservationByNumber);
module.exports = router;
