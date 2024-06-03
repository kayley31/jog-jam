import { combineReducers } from '@reduxjs/toolkit';
import genresReducer from './genresReducer';
import recommendationsReducer from './recommendationsReducer';
import playlistReducer from './playlistReducer';

const rootReducer = combineReducers({
  genres: genresReducer,
  recommendations: recommendationsReducer,
  playlists: playlistReducer,
});

export default rootReducer;