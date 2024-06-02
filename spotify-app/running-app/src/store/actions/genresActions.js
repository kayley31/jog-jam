// Action types
export const GENRES_LOADING = 'genres/loading';
export const GENRES_RECEIVED = 'genres/received';
export const GENRES_ERROR = 'genres/error';

// Action creators
export const genresLoading = () => ({
  type: GENRES_LOADING,
});

export const genresReceived = (genres) => ({
  type: GENRES_RECEIVED,
  payload: genres,
});

export const genresError = (error) => ({
  type: GENRES_ERROR,
  payload: error,
});
