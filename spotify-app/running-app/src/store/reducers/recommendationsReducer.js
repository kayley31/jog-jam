import { createSlice } from '@reduxjs/toolkit';

// Defining the initial state for the recommendations slice

const initialState = {
  recommendations: [], // To hold the list of genres fetched from the API
  status: 'idle', // Possible statuses: 'idle', 'loading', 'succeeded', 'failed'
  error: null, // To hold the error message when the API call fails
};

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    // Reducer to update the state with the loading status when the API call is made
    recommendationsLoading(state) {
      state.status = 'loading';
    },
    // Reducer to update the state with the fetched genres when the API call is successful
    recommendationsReceived(state, action) {
      state.status = 'succeeded';
      state.recommendations = action.payload; // The payload is the list of genres fetched from the API
    },
    // Reducer to update the state with the error message when the API call fails
    recommendationsError(state, action) {
      state.status = 'failed';
      state.error = action.payload; // The payload is the error message
    },
  },
});

export const { recommendationsLoading, recommendationsReceived, recommendationsError } = recommendationsSlice.actions;

export default recommendationsSlice.reducer;