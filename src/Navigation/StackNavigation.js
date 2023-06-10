import * as React from 'react';
import {ActivityIndicator, Easing, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from '../Screens/Auth/Login';
import Signup from '../Screens/Auth/Signup';
import EventDetails from '../Screens/Dashbord/EventDetails';
import Notification from '../Screens/Dashbord/Notification';
import Addevent from '../Screens/Dashbord/Addevent';
import BlogDetails from '../Screens/Dashbord/BlogDetails';
import MyPost from '../Screens/Dashbord/MyPost';
import MyEvents from '../Screens/Dashbord/MyEvents';
import GeneralInformation from '../Screens/Dashbord/GeneralInformation';
import AddBlog from '../Screens/Dashbord/AddBlog';
import Forget from '../Screens/Auth/Forget';

import TabNavigation from './TabNavigation';
import {useDispatch, useSelector} from 'react-redux';
import {fetchValue, setemail, setusername} from '../Redux/counterSlice';
import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyEvents2 from '../Screens/Dashbord/MyEvent2';
import EventDetails2 from '../Screens/Dashbord/EventDetails2';
const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  // const counterSelector = state => state.counter;
  // const counter = useSelector(counterSelector);
  // const count = useSelector(state => state.counter);
  const [loader, setloader] = React.useState(true);
  const [initialRouteName, setinitialRouteName] = React.useState('Login');
  const dispatch = useDispatch();
  const fetchData = async () => {
    try {
      const value = await AsyncStorage.getItem('user_session');
      if (value != null) {
        // console.log(value.email);
        // Handle the retrieved value if needed
        // const parsedValue = JSON.parse(value);
        // setSavedData(parsedValue);
        dispatch(setusername(JSON.parse(value).username));
        dispatch(setemail(JSON.parse(value).email));
        setinitialRouteName('TabNavigation');
        setloader(false);
        // console.log(value);
        // return value;
      } else {
        // return false;
        setloader(false);
      }
    } catch (error) {
      console.log('Error fetching value from AsyncStorage:', error);
      setloader(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return loader ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={initialRouteName}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Forget" component={Forget} />
        <Stack.Screen name="TabNavigation" component={TabNavigation} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="EventDetails" component={EventDetails} />
        <Stack.Screen name="EventDetails2" component={EventDetails2} />
        <Stack.Screen name="BlogDetails" component={BlogDetails} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="Addevent" component={Addevent} />
        <Stack.Screen name="MyPost" component={MyPost} />
        <Stack.Screen name="MyEvents" component={MyEvents} />
        <Stack.Screen name="MyEvents2" component={MyEvents2} />
        <Stack.Screen name="AddBlog" component={AddBlog} />
        <Stack.Screen
          name="GeneralInformation"
          component={GeneralInformation}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
