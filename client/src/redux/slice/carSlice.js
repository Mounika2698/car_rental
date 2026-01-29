import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCars, fetchCarById } from "../../services/carService";

// Fetch car list
export const getCars = createAsyncThunk(
    "cars/getCars",
    async (type, thunkAPI) => {
        try {
            const data = await fetchCars(type);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Fetch single car by ID
export const getCar = createAsyncThunk(
    "cars/getCar",
    async (id, thunkAPI) => {
        try {
            const data = await fetchCarById(id);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const carSlice = createSlice({
    name: "cars",
    initialState: {
        cars: [],
        selectedCar: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCars.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCars.fulfilled, (state, action) => {
                state.cars = action.payload;
                state.loading = false;
            })
            .addCase(getCars.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(getCar.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCar.fulfilled, (state, action) => {
                state.selectedCar = action.payload;
                state.loading = false;
            })
            .addCase(getCar.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export default carSlice.reducer;
