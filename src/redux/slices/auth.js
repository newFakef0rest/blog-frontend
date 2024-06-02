import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (params) => {
    const { data } = await axios.post("/auth/login", params);
    return data;
  }
);

export const fetchRegister = createAsyncThunk(
  "auth/fetchRegister",
  async (params) => {
    try {
      const { data } = await axios.post("/auth/register", params);
      return data;
    } catch (err) {
      return err;
    }
  }
);

export const fetchLoginMe = createAsyncThunk("auth/fetchLoginMe", async () => {
  const { data } = await axios.get("/auth/me");
  return data;
});

const initialState = {
  data: null,
  status: "loading",
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      window.localStorage.removeItem("token");
    },
  },
  extraReducers: {
    [fetchUserData.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchUserData.fulfilled]: (state, action) => {
      state.status = "success";
      state.data = action.payload;
    },
    [fetchUserData.rejected]: (state) => {
      state.status = "failed";
      state.data = null;
    },
    [fetchLoginMe.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchLoginMe.fulfilled]: (state, action) => {
      state.status = "success";
      state.data = action.payload;
    },
    [fetchLoginMe.rejected]: (state) => {
      state.status = "failed";
      state.data = null;
    },
    [fetchRegister.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.status = "success";
      if ("token" in action.payload) {
        state.data = action.payload;
      }
    },
    [fetchRegister.rejected]: (state) => {
      state.status = "failed";
      state.data = null;
    },
  },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const authReducer = AuthSlice.reducer;

export const { logout } = AuthSlice.actions;
