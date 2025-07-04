import { ADD_PLAYLIST } from '../actions/playlistActions';

// Defining the initial state for the playlists slice
const initialState = {
  playlists: [],
};

// Reducer function for the playlists
const playlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PLAYLIST:
      return {
        ...state,
        playlists: [...state.playlists, action.payload], // Adds the new playlist to the playlists array
      };
    default:
      return state;
  }
};

export default playlistReducer;
