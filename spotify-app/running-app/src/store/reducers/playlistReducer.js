import { createSlice } from '@reduxjs/toolkit';

// Defining the initial state for the playlists slice

const initialState = {
  playlists: [],
};


const playlistSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    // Reducer for adding a new playlist
    addPlaylist(state, action) {
      state.playlists.push(action.payload); // Pushes the new playlist to the playlists array
    },
  },
});

export const { addPlaylist } = playlistSlice.actions;

export default playlistSlice.reducer;