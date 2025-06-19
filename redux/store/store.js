// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers/rootReducer'; // Replace with your rootReducer
import thunk from 'redux-thunk'; // Import Redux Thunk

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk], // Add Redux Thunk middleware
});

export default store;
