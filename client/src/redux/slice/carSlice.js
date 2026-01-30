import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCars, fetchCarById, searchCarsApi } from "../../services/carService";

// Existing: Fetch car list by type (kept as-is)
export const getCars = createAsyncThunk("cars/getCars", async (type, thunkAPI) => {
  try {
    const data = await fetchCars(type);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// NEW: Search cars (runs ONLY on Search button click)
export const searchCars = createAsyncThunk("cars/searchCars", async (params, thunkAPI) => {
  try {
    // params = { type, location, pickupDate, returnDate }
    const data = await searchCarsApi(params);
    // backend returns { cars, meta }, we store only cars here
    return data?.cars || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Existing: Fetch single car by ID (kept as-is)
export const getCar = createAsyncThunk(
  "cars/getCar",
  async ({ id, params }, thunkAPI) => {
    try {
      const data = await fetchCarById(id, params);
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
      // getCars
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

      // searchCars (NEW)
      .addCase(searchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCars.fulfilled, (state, action) => {
        state.cars = action.payload;
        state.loading = false;
      })
      .addCase(searchCars.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // getCar
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
