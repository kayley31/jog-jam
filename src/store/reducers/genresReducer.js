import { GENRES_LOADING, GENRES_RECEIVED, GENRES_ERROR } from '../actions/genresActions';

// Defining the initial state for the genres slice
const initialState = {
  genres: [], // To hold the list of genres fetched from the API
  status: 'idle', // Possible statuses: 'idle', 'loading', 'succeeded', 'failed'
  error: null, // To hold the error message when the API call fails
};

// Reducer function for the genres slice
const genresReducer = (state = initialState, action) => {
  // Checks the action type and updates the state accordingly
  switch (action.type) {
    case GENRES_LOADING:
      return {
        ...state, // Copies the current state
        status: 'loading', // Sets the status to 'loading' indicating an API call is in progress
      };
    case GENRES_RECEIVED:
      return {
        ...state,
        status: 'succeeded', // Sets the status to 'succeeded' indicating the API call was successful
        genres: action.payload, // Updates the genres array with the data fetched from the API
      };
    case GENRES_ERROR:
      return {
        ...state,
        status: 'failed', // Sets the status to 'failed' indicating the API call failed
        error: action.payload, // Updates the error message with the error received from the API
      };
    default: // If the action type does not match any of the above, the reducer returns the current state
      return state;
  }
};

export default genresReducer;

