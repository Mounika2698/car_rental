import axios from "axios";

const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5001/api/cars";

export const fetchCars = async (type = "all") => {
    const res = await axios.get(`${API_URL}?type=${type}`);
    return res.data;
};

export const fetchCarById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
