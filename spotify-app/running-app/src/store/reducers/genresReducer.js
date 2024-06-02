import { createSlice } from '@reduxjs/toolkit';

// Defining the initial state for the genres slice
const initialState = {
  genres: [], // To hold the list of genres fetched from the API
  status: 'idle', // Possible statuses: 'idle', 'loading', 'succeeded', 'failed'
  error: null, // To hold the error message when the API call fails
};

const genreSlice = createSlice({
  name: 'genres',
  initialState,
  reducers: {
    // Reducer to update the state with the loading status when the API call is made
    genresLoading(state) {
      state.status = 'loading';
    },
    // Reducer to update the state with the fetched genres when the API call is successful
    genresReceived(state, action) {
      state.status = 'succeeded';
      state.genres = action.payload; // The payload is the list of genres fetched from the API
    },
    // Reducer to update the state with the error message when the API call fails
    genresError(state, action) {
      state.status = 'failed';
      state.error = action.payload; // The payload is the error message
    },
  },
});


export const { genresLoading, genresReceived, genresError } = genreSlice.actions;


export default genreSlice.reducer;