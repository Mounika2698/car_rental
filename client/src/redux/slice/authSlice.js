import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, signupAPI } from '../../services/authService'

// Signup thunk
export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async (userData, { rejectWithValue }) => {
        try {
            return await signupAPI(userData);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// Login thunk
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) => {
        try {
            const data = await loginAPI(userData);
            localStorage.setItem("token", data.token); // store JWT
            return data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const initialState = {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
        }
    },
    extraReducers: (builder) => {
        builder
            // Signup
            .addCase(signupUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(signupUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; })
            .addCase(signupUser.rejected, (state, action) => { state.loading = false; state.error = action.payload.message; })
            // Login
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.token = action.payload.token; })
            .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload.message; });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
