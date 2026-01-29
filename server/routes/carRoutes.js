const express = require("express");
const router = express.Router();
const { getCars, getCarById } = require("../controllers/carController");

router.get("/", getCars);           // GET /api/cars?type=all
router.get("/:id", getCarById);     // GET /api/cars/:id

module.exports = router;


