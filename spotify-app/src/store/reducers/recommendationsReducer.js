import { RECOMMENDATIONS_LOADING, RECOMMENDATIONS_RECEIVED, RECOMMENDATIONS_ERROR } from '../actions/recommendationsActions';

// Defining the initial state for the recommendations slice
const initialState = {
  recommendations: [], // To hold the list of recommendations fetched from the API
  status: 'idle', // Possible statuses: 'idle', 'loading', 'succeeded', 'failed'
  error: null, // To hold the error message when the API call fails
};

const recommendationsReducer = (state = initialState, action) => {
  // Checks the action type and updates the state accordingly
  switch (action.type) {
    case RECOMMENDATIONS_LOADING:
      return {
        ...state, // Copies the current state
        status: 'loading', // Sets the status to 'loading' indicating an API call is in progress
      };
    case RECOMMENDATIONS_RECEIVED:
      return {
        ...state,
        status: 'succeeded', // Sets the status to 'succeeded' indicating the API call was successful
        recommendations: action.payload, // Updates the recommendations array with the data fetched from the API
      };
    case RECOMMENDATIONS_ERROR:
      return {
        ...state,
        status: 'failed', // Sets the status to 'failed' indicating the API call failed
        error: action.payload, // Sets the error message to the value returned by the API
      };
    default: // If the action type does not match any of the above, the reducer returns the current state
      return state;
  }
};

export default recommendationsReducer;
