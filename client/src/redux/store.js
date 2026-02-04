import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slice/authSlice'
import carReducer from "./slice/carSlice";
import bookingReducer from "./slice/bookingSlice";
import manageBookingReducer from "./slice/manageBookingSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cars: carReducer,
        bookings: bookingReducer,
        manageBooking: manageBookingReducer,
    }
})