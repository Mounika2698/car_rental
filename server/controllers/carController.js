// controllers/carController.js

// Dummy car fleet data
const FLEET = [
    {
        _id: "1",
        name: "Tesla Model 3",
        type: "ev",
        price: 89,
        image:
            "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=400",
    },
    {
        _id: "2",
        name: "BMW X5",
        type: "luxury",
        price: 120,
        image:
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400",
    },
    {
        _id: "3",
        name: "Audi A4",
        type: "sedan",
        price: 75,
        image:
            "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=400",
    },
];

// GET /api/cars?type=all
exports.getCars = (req, res) => {
    try {
        const { type } = req.query; // read type query param

        if (type && type !== "all") {
            const filteredCars = FLEET.filter((car) => car.type === type);
            return res.json(filteredCars);
        }

        res.json(FLEET);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching cars" });
    }
};

// GET /api/cars/:id
exports.getCarById = (req, res) => {
    try {
        const { id } = req.params;
        const { location = "", pickupDate = "", returnDate = "" } = req.query;
        const car = FLEET.find((c) => c._id === id);

        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

       return res.json({
      ...car,
      location,
      pickupDate,
      returnDate,
    });
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching car" });
    }
};

exports.searchCars = (req, res) => {
  try {
    const { type = "all", location = "", pickupDate = "", returnDate = "" } = req.query;

    let cars = [...FLEET];
    if (type && type !== "all") cars = cars.filter((c) => c.type === type);

    return res.json({
      cars: cars.map((c) => ({ ...c, location, pickupDate, returnDate })),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while searching cars" });
  }
};

