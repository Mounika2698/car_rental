import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCars = createAsyncThunk(
    "cars/fetchCars",
    async ({ location, pickupDate, returnDate, type }) => {
        const query = new URLSearchParams({ location, pickupDate, returnDate, type }).toString();
        const response = await fetch(`http://localhost:5000/api/cars?${query}`);
        const data = await response.json();
        return data;
    }
);

const carSlice = createSlice({
    name: "cars",
    initialState: {
        cars: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCars.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCars.fulfilled, (state, action) => {
                state.loading = false;
                state.cars = action.payload;
            })
            .addCase(fetchCars.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default carSlice.reducer;
