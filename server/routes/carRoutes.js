const express = require("express");
const router = express.Router();
const { getCars, getCarById, searchCars } = require("../controllers/carController");

router.get("/", getCars);           // GET /api/cars?type=all
router.get("/search", searchCars);  // ✅ must come BEFORE /:id
router.get("/:id", getCarById);     // GET /api/cars/:id

module.exports = router;


