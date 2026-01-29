import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createBooking, getBookings, cancelBooking } from "../../services/bookingService";

// Create booking
export const addBooking = createAsyncThunk(
    "bookings/addBooking",
    async (bookingData, thunkAPI) => {
        try {
            const data = await createBooking(bookingData);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Get user bookings
export const fetchUserBookings = createAsyncThunk(
    "bookings/fetchUserBookings",
    async (_, thunkAPI) => {
        try {
            const data = await getBookings(); // returns user bookings
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
// Cancel booking
export const removeBooking = createAsyncThunk(
    "bookings/removeBooking",
    async (bookingId, thunkAPI) => {
        try {
            const data = await cancelBooking(bookingId);
            return { bookingId, data };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const bookingSlice = createSlice({
    name: "bookings",
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addBooking.pending, (state) => { state.loading = true; })
            .addCase(addBooking.fulfilled, (state, action) => {
                state.list.push(action.payload);
                state.loading = false;
            })
            .addCase(addBooking.rejected, (state, action) => { state.error = action.payload; state.loading = false; })

            .addCase(fetchUserBookings.pending, (state) => { state.loading = true; })
            .addCase(fetchUserBookings.fulfilled, (state, action) => {
                state.list = action.payload;
                state.loading = false;
            })
            .addCase(fetchUserBookings.rejected, (state, action) => { state.error = action.payload; state.loading = false; })

            .addCase(removeBooking.pending, (state) => { state.loading = true; })
            .addCase(removeBooking.fulfilled, (state, action) => {
                state.list = state.list.filter(b => b._id !== action.payload.bookingId);
                state.loading = false;
            })
            .addCase(removeBooking.rejected, (state, action) => { state.error = action.payload; state.loading = false; });
    }
});

export default bookingSlice.reducer;
