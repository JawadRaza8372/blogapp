import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchValue = createAsyncThunk('counter/fetchValue', async () => {
  try {
    const value = await AsyncStorage.getItem('user_session');
    if (value !== null) {
      // Handle the retrieved value if needed
      // const parsedValue = JSON.parse(value);
      // setSavedData(parsedValue);
      // console.log(value);
      return value;
    } else {
      return false;
    }
  } catch (error) {
    console.log('Error fetching value from AsyncStorage:', error);
    return false;
  }
});

const initialState = {
  value: null,
  username: '',
  email: '',
  IMageUrl: '',
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    setusername: (state, action) => {
      state.username = action.payload;
    },
    setemail: (state, action) => {
      // console.log(action.payload);
      state.email = action.payload;
    },
    setImageUrl: (state, action) => {
      state.IMageUrl = action.payload;
    },
  },
  // extraReducers: builder => {
  //   builder.addCase(fetchValue.fulfilled, (state, action) => {
  //     // Handle the fetched value in the Redux store
  //     state.username = JSON.parse(action.payload).username;
  //     state.email = JSON.parse(action.payload).email;
  //     state.value = action.payload;
  //   });
  // },
});

export const {increment, decrement, setusername, setemail, setImageUrl} =
  counterSlice.actions;

export default counterSlice.reducer;
