import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../Utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import AppInput2 from '../../Components/AppInput2';
import AppItem from '../../Components/AppItem';
import Appbutton from '../../Components/Appbutton';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

const AddBlog = ({navigation}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileName, setfileName] = useState(null);
  const [Title, setTitle] = useState('');
  const [Description, SetDescription] = useState('');
  const [Loader, setLoader] = useState(false);
  const email = useSelector(state => state.counter.email);
  const username = useSelector(state => state.counter.username);
  const userimg = useSelector(state => state.counter.IMageUrl);
  const FIREBASE_API_KEY =
    'AAAAtTf2O1A:APA91bFVKW6PUkjnZGQuYYWT_D2KgriSJDhhelcRtRP60HvEhNT67Li4f6FAV9Wtm2eVfBijgeHSp6DnmRxGY7iu3VCRxA5MiKCS_2II3-3hSZjvOiIlv-3tAMdZOE69oN9GNvEOqnRx'; // Replace with your Firebase API key

  const sendNotification = async (deviceToken, title, body) => {
    const message = {
      to: deviceToken,
      notification: {
        title,
        body,
      },
    };

    try {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'key=' + FIREBASE_API_KEY,
        },
        body: JSON.stringify(message),
      });

      console.log('Notification sent:', response);
      return response;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  };
  const sendNotifications = async (deviceTokens, title, body) => {
    const responses = [];

    for (const deviceToken of deviceTokens) {
      try {
        const response = await sendNotification(deviceToken, title, body);
        responses.push(response);
      } catch (error) {
        // Handle individual notification sending error
        console.error(
          `Error sending notification to device ${deviceToken}:`,
          error,
        );
      }
    }

    return responses;
  };
  const UploadPost = val => {
    firestore()
      .collection('blogs')
      .add({
        title: Title,
        description: Description,
        imageurl: val,
        Author: username,
        email: email,
        likes: [],
        comments: [],
        profileimg: userimg,
      })
      .then(() => {
        // setLoader(false);
        firestore()
          .collection('Users')
          .get()
          .then(querySnapshot => {
            const userData = [];
            querySnapshot.forEach(documentSnapshot => {
              const data = documentSnapshot.data();
              if (data.fcmtoken == '') {
              } else {
                console.log(data.fcmtoken);
                userData.push(data.fcmtoken);
              }
            });
            sendNotifications(
              userData,
              'New Blog Uploaded',
              `${username} posted this blog on this ${Title} `,
            )
              .then(responses => {
                // Handle success, if needed
                console.log('All notifications sent:', responses);
                Alert.alert('Sccuess!', 'Post Uploaded');
                setLoader(false);
                navigation.pop();
              })
              .catch(error => {
                setLoader(false);

                // Handle error, if needed
              });
            // setData(userData);
            // SetMainData(userData);
            // setRefreshing(false);

            // Process the retrieved data as needed
          })
          .catch(error => {
            console.log('Error fetching user data:', error);
          });

        // navigation.pop();
      })
      .catch(error => {
        console.log('Error adding document:', error);
        Alert.alert('Error', 'Data not saved');
        setLoader(false);

        // setloader(false);
      });
  };
  const uploadImage = async () => {
    setLoader(true);
    try {
      const reference = storage().ref(`images/${fileName}`);
      const snapshot = await reference.putFile(selectedImage);
      const downloadURL = await reference.getDownloadURL();
      // console.log('Image URL:', downloadURL);
      UploadPost(downloadURL);
      // console.log('Image uploaded successfully.');
    } catch (error) {
      console.log('Error uploading image:', error);
      setLoader(false);
    }
  };
  const SendNotification = async (deviceTokens, title, body) => {
    console.log(deviceTokens);
    const FIREBASE_API_KEY =
      'AAAAtTf2O1A:APA91bFVKW6PUkjnZGQuYYWT_D2KgriSJDhhelcRtRP60HvEhNT67Li4f6FAV9Wtm2eVfBijgeHSp6DnmRxGY7iu3VCRxA5MiKCS_2II3-3hSZjvOiIlv-3tAMdZOE69oN9GNvEOqnRx'; // Replace with your Firebase API key
    // console.log(deviceToken);
    const messages = deviceTokens.map(deviceToken => {
      ({
        to: deviceToken,
        notification: {
          title,
          body,
        },
      });
    });

    const requests = messages.map(message =>
      fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'key=' + FIREBASE_API_KEY,
        },
        body: JSON.stringify(message),
      }),
    );

    try {
      const responses = await Promise.all(requests);
      // console.log('Notifications sent:', responses);
      return responses;
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw error;
    }
  };

  const selectImageFromGallery = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error:', response.error);
      } else {
        console.log(response.assets[0].fileName);
        setSelectedImage(response.assets[0].uri);
        setfileName(response.assets[0].fileName);
      }
    });
  };
  const Request = () => {
    if (Title.trim() === '') {
      Alert.alert('Error', 'Title is required');
      return;
    }
    if (Description.trim() === '') {
      Alert.alert('Error', 'Description is required');
      return;
    }
    if (selectedImage) {
      uploadImage();
    } else {
      Alert.alert('Error', 'Blog Image is required');
      return;
    }
  };

  return (
    <View style={styles.Bg}>
      <ScrollView>
        <View style={styles.TopHeaderCC}>
          <View style={styles.topCont}>
            <View style={styles.LeftCC}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={styles.Cicle2}>
                <Icon name={'arrow-back'} size={25} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.LeftCC2}>
              <Text style={styles.Hellow2}>Create New Blog</Text>
            </View>
          </View>
          {/* TopCOntainer */}
        </View>
        <View style={{height: 10}} />
        <View
          style={{
            width: '90%',
            height: 200,
            backgroundColor: '#0001',
            alignSelf: 'center',
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            style={{
              width: '100%',
              height: 200,
              backgroundColor: '#0001',
              alignSelf: 'center',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={selectImageFromGallery}>
            <Image
              style={{
                width: '100%',
                height: '100%',
                resizeMode: selectedImage != null ? 'cover' : 'contain',
                borderRadius: 12,
              }}
              source={
                selectedImage
                  ? {uri: selectedImage}
                  : require('../../../assets/add-image.png')
              }
            />
          </TouchableOpacity>
        </View>

        <AppInput2
          text={'Title'}
          placeholder={'Enter Title'}
          onchange={val => {
            // console.log(val);
            setTitle(val);
          }}
        />
        <AppInput2
          text={'Description'}
          placeholder={'Enter Description'}
          description
          onchange={val => {
            // console.log(val);
            SetDescription(val);
          }}
        />
        <Appbutton txt={'Create Blog'} onPress={Loader ? null : Request} />
      </ScrollView>
      <Modal animationType="slide" transparent={true} visible={Loader}>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={'large'} />
        </View>
      </Modal>
    </View>
  );
};

export default AddBlog;

const styles = StyleSheet.create({
  Bg: {
    flex: 1,
    backgroundColor: '#fff',
  },
  TopHeaderCC: {
    // backgroundColor: 'white',
    // backgroundColor: 'white',
    width: '100%',
    height: h('15%'),
    zIndex: 100,
    backgroundColor: Colors.Primary,
  },
  topCont: {
    // backgroundColor: 'red',
    width: '95%',
    height: h('12%'),
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
  },
  LeftCC: {
    // backgroundColor: 'green',
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  LeftCC2: {
    // backgroundColor: 'orange',
    width: '65%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Cicle: {
    backgroundColor: '#fff',
    width: 60,
    height: 60,
    borderRadius: 100 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Cicle2: {
    backgroundColor: '#fff2',
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImgBg: {
    width: '90%',
    height: '90%',
    resizeMode: 'cover',
    borderRadius: 100 / 2,
  },
  Hellow: {
    color: '#fff',
    fontSize: h('1.9%'),
  },
  Hellow2: {
    color: '#fff',
    fontSize: h('2.5%'),
    fontWeight: 'bold',
  },
});
