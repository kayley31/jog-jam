export const RECOMMENDATIONS_LOADING = 'recommendations/loading';
export const RECOMMENDATIONS_RECEIVED = 'recommendations/received';
export const RECOMMENDATIONS_ERROR = 'recommendations/error';

// Action creators
export const recommendationsLoading = () => ({
    type: RECOMMENDATIONS_LOADING,
  });
  
  export const recommendationsReceived = (recommendations) => ({
    type: RECOMMENDATIONS_RECEIVED,
    payload: recommendations,
  });
  
  export const recommendationsError = (error) => ({
    type: RECOMMENDATIONS_ERROR,
    payload: error,
  });