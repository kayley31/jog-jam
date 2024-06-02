import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist'; // Used for persisting state across sessions (like localStorage)
import storage from 'redux-persist/lib/storage'; // Using localStorage for persistence
import rootReducer from './reducers';

// Defining the configuration for redux-persist
const persistConfig = {
  key: 'root', // Used to store the state in localStorage
  storage, // Defaults to localStorage

};

// This sets up the Redux store with the logic to save/load the state based on the persistedReducer
const persistedReducer = persistReducer(persistConfig, rootReducer); 

// Create the store with the persisted reducer
// The persistor manages the process of saving and loading the state
const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
