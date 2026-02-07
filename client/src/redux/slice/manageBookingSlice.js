import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { findReservationByNumber } from "../../services/manageBookingService";

export const searchReservation = createAsyncThunk(
  "manageBooking/searchReservation",
  async (payload, thunkAPI) => {
    try {
      return await findReservationByNumber(payload); // { results: [...] }
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

const manageBookingSlice = createSlice({
  name: "manageBooking",
  initialState: { results: [], loading: false, error: null },
  reducers: {
    clearResults: (s) => { s.results = []; s.error = null; },
  },
  extraReducers: (b) => {
    b.addCase(searchReservation.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(searchReservation.fulfilled, (s, a) => { s.loading = false; s.results = a.payload?.results || []; })
     .addCase(searchReservation.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Search failed"; });
  },
});

export const { clearResults } = manageBookingSlice.actions;
export default manageBookingSlice.reducer;
