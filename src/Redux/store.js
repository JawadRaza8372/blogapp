// import {configureStore} from '@reduxjs/toolkit';
// import rootReducer from './reducers'; // Import your root reducer

// const store = configureStore({
//   reducer: rootReducer,
//   //   middleware: getDefaultMiddleware => getDefaultMiddleware(), // Add any additional middleware here
// });

// export default store;
import {configureStore} from '@reduxjs/toolkit';
import counterReducer from './counterSlice.js';

const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export default store;
