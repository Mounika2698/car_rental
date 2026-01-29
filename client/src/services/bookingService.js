import axios from "axios";

const API_URL = "http://localhost:5001/api/bookings";

export const createBooking = async (bookingData) => {
    const response = await axios.post(API_URL, bookingData);
    return response.data;
};

export const getBookings = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const cancelBooking = async (bookingId) => {
    const response = await axios.put(`${API_URL}/${bookingId}/cancel`);
    return response.data;
};
