import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore, 
  persistReducer, // Used for persisting state across sessions (like localStorage)
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers';

// Defining the configuration for redux-persist
const persistConfig = {
  key: 'root', // Used to store the state in localStorage
  storage, // Defaults to localStorage
  whitelist: ['playlists'], // Only persist the playlists slice of state
};

// This sets up the Redux store with the logic to save/load the state based on the persistedReducer
const persistedReducer = persistReducer(persistConfig, rootReducer); 

// Create the store with the persisted reducer
// The persistor manages the process of saving and loading the state
const store = configureStore({
  reducer: persistedReducer,
  // This is needed to get rid of the non-serializable error in the console
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], 
      },
    }),
})

export const persistor = persistStore(store);
export default store;
