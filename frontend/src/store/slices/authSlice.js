import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  status: 'idle',
  error: null
};

export const login = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', creds);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    }
  },
  extraReducers(builder) {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        state.status = 'succeeded';
      })
      .addCase(register.fulfilled, (state, action) => {
        // backend returns same shape as login: { token, _id, name, ... }
        state.user = action.payload;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        state.status = 'succeeded';
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
