import axios from "axios";

const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5001/api/cars";

export const fetchCars = async (type = "all") => {
    const res = await axios.get(`${API_URL}?type=${type}`);
    return res.data;
};

export const fetchCarById = async (id, params = {}) => {
  const qs = new URLSearchParams();
  if (params.location) qs.set("location", params.location);
  if (params.pickupDate) qs.set("pickupDate", params.pickupDate);
  if (params.returnDate) qs.set("returnDate", params.returnDate);

  const url = qs.toString() ? `${API_URL}/${id}?${qs.toString()}` : `${API_URL}/${id}`;
  const response = await axios.get(url);
  return response.data; // now includes location if provided
};

export const searchCarsApi = async ({ type, location, pickupDate, returnDate }) => {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (location) params.set("location", location);
  if (pickupDate) params.set("pickupDate", pickupDate);
  if (returnDate) params.set("returnDate", returnDate);

  // API_URL already points to http://localhost:5001/api/cars
  const res = await axios.get(`${API_URL}/search?${params.toString()}`);
  return res.data; // { cars, meta }
};