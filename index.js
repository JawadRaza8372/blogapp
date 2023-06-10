/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
async function onDisplayNotification(val1, val2) {
  try {
    // Request permissions (required for iOS)
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    const notification = {
      title: val2,
      body: val1,
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
        // actions: [
        //   {
        //     pressAction: {
        //       id: 'action1',
        //     },
        //     title: 'Action 1',
        //   },
        //   {
        //     pressAction: {
        //       id: 'action2',
        //     },
        //     title: 'Action 2',
        //   },
        // ],
      },
    };

    await notifee.displayNotification(notification);
    // }
  } catch (error) {
    // Handle the error here
    console.error('Error displaying notification:', error);
  }
}
const Store = val => {
  AsyncStorage.getItem('notification')
    .then(arrayString => {
      if (arrayString) {
        const retrievedArray = JSON.parse(arrayString);
        // Perform the push operation on the retrieved array
        retrievedArray.push(val);
        // Store the updated array back in AsyncStorage
        AsyncStorage.setItem('notification', JSON.stringify(retrievedArray))
          .then(() => {
            console.log('Item added to the array and stored successfully.');
          })
          .catch(error => {
            console.log('Error storing updated array:', error);
          });
      } else {
        let temp = [];
        temp.push(val);
        AsyncStorage.setItem('notification', JSON.stringify(temp))
          .then(() => {
            console.log('Item added to the array and stored successfully.');
          })
          .catch(error => {
            console.log('Error storing updated array:', error);
          });
        // console.log('Array not found in AsyncStorage.');
      }
    })
    .catch(error => {
      console.log('Error retrieving array:', error);
    });
};
messaging().onMessage(async remoteMessage => {
  // Handle the received foreground notification
  onDisplayNotification(
    remoteMessage.notification.body,
    remoteMessage.notification.title,
  );
  Store(remoteMessage.notification.body);
});

AppRegistry.registerComponent(appName, () => App);
