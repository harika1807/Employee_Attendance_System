// src/store/slices/attendanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  records: [],
  today: null,
  summary: null,
  status: 'idle',
  loading: false,
  error: null
};

export const checkIn = createAsyncThunk('attendance/checkIn', async (_, {rejectWithValue}) => {
  try {
    const { data } = await api.post('/attendance/checkin');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});
export const checkOut = createAsyncThunk('attendance/checkOut', async (_, {rejectWithValue}) => {
  try {
    const { data } = await api.post('/attendance/checkout');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});
export const fetchMyHistory = createAsyncThunk('attendance/history', async (_, {rejectWithValue}) => {
  try {
    const { data } = await api.get('/attendance/my-history');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});
export const fetchToday = createAsyncThunk('attendance/today', async (_, {rejectWithValue}) => {
  try {
    const { data } = await api.get('/attendance/today');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const slice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError(state) { state.error = null; }
  },
  extraReducers(builder){
    builder
      .addCase(checkIn.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(checkIn.fulfilled, (state, action) => { state.today = action.payload; state.loading = false; })
      .addCase(checkIn.rejected, (state, action) => { state.loading = false; state.error = action.payload || 'Check-in failed'; })

      .addCase(checkOut.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(checkOut.fulfilled, (state, action) => { state.today = action.payload; state.loading = false; })
      .addCase(checkOut.rejected, (state, action) => { state.loading = false; state.error = action.payload || 'Check-out failed'; })

      .addCase(fetchMyHistory.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchMyHistory.fulfilled, (state, action) => { state.records = action.payload; state.status = 'succeeded'; })
      .addCase(fetchMyHistory.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(fetchToday.fulfilled, (state, action) => { state.today = action.payload; })
      .addCase(fetchToday.rejected, (state, action) => { state.error = action.payload; });
  }
});

export const { clearError } = slice.actions;
export default slice.reducer;
