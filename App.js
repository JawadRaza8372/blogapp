import React from 'react';

import {SafeAreaView, StatusBar} from 'react-native';

import StackNavigation from './src/Navigation/StackNavigation';
import Colors from './src/Utils/Colors';
import {Provider} from 'react-redux';
import store from './src/Redux/store';

function App() {
  return (
    <>
      <SafeAreaView />

      <StatusBar barStyle={'light-content'} backgroundColor={Colors.Primary} />
      <Provider store={store}>
        <StackNavigation />
      </Provider>
    </>
  );
}

export default App;
