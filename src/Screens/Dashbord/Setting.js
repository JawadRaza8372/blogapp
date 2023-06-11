import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  ImageBackground,
  Modal,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../Utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Login from '../Auth/Login';
import SettingItem from '../../Components/SettingItem';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import {setImageUrl} from '../../Redux/counterSlice';
import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import Appbutton from '../../Components/Appbutton';
import AppPassword from '../../Components/AppPassword';
import AppInput from '../../Components/AppInput';
import firestore from '@react-native-firebase/firestore';

const Setting = ({navigation}) => {
  const username = useSelector(state => state.counter.username);
  const email = useSelector(state => state.counter.email);
  const IMageUrl = useSelector(state => state.counter.IMageUrl);
  const [loader, setloader] = useState(false);
  const [Hide, setHide] = React.useState(true);
  const [Email, SetEmail] = useState('');
  const [Password, setpassword] = useState('');

  const [SelectedImage, setSelectedImage] = useState(IMageUrl);
  const [fileName, setfileName] = useState('');
  let Dispatch = useDispatch();
  const saveData = async val => {
    try {
      await AsyncStorage.removeItem('user_session');
      navigation.replace('Login');
    } catch (error) {
      console.log(error);
      // setloader(false);
    }
  };
  const updateDocument = async (docId, updatedFields) => {
    // console.log(updatedFields.name);
    try {
      const documentRef = firestore().collection('Users').doc(docId);
      await documentRef.update(updatedFields);
      Dispatch(setImageUrl(updatedFields.ImageUrl));

      setloader(false);

      setSelectedImage(updatedFields.ImageUrl);
      // Dispatch(set)
      // console.log('Document updated successfully!');
      // saveData(updatedFields.name);
    } catch (error) {
      Alert.alert('Error updating document:', error);
      setloader(false);
    }
  };

  const CheckDoc = async val => {
    const usersCollection = firestore().collection('Users');
    const Querysnapshot = await usersCollection
      .where('email', '==', email)
      .get();
    if (Querysnapshot.empty) {
      setloader(false);
    } else {
      updateDocument(Querysnapshot.docs[0].id, {
        email: Querysnapshot.docs[0].data().email,
        fcmtoken: Querysnapshot.docs[0].data().fcmtoken,
        name: Querysnapshot.docs[0].data().name,
        ImageUrl: val,
        status: true,
      });
    }
  };
  const uploadImage = async val => {
    console.log(val);
    setloader(true);
    try {
      const reference = storage().ref(`images/${fileName}`);
      const snapshot = await reference.putFile(val);
      const downloadURL = await reference.getDownloadURL();
      // console.log('Image URL:', downloadURL);
      CheckDoc(downloadURL);
      setfileName(val);

      // console.log('Image uploaded successfully.');
    } catch (error) {
      console.log(error);
      setloader(false);
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
        console.log(response.assets[0].uri);
        setSelectedImage(response.assets[0].uri);
        setfileName(response.assets[0].fileName);
        uploadImage(response.assets[0].uri);
      }
    });
  };
  const [loginLoad, setloginLoad] = useState(false);
  const LoginRequest = async () => {
    if (Email.trim() === '') {
      Alert.alert('Error', 'Email is required');
      return;
    }
    if (Password.trim() === '') {
      Alert.alert('Error', 'Password is required');
      return;
    }
    setloader(true);
    try {
      await auth()
        .signInWithEmailAndPassword(Email, Password)
        .then(() => {
          setloginLoad(false);
          delaccount();
        });
    } catch (error) {
      console.log(error);
      setloader(false);
      Alert.alert('Error', error.message);
    }
  };
  const delaccount = async () => {
    setloader(true);

    const user = auth().currentUser;
    if (user) {
      await firestore()
        .collection('Users')
        .where('email', '==', email)
        .get()
        .then(async Querysnapshot => {
          await firestore()
            .collection('Users')
            .doc(Querysnapshot.docs[0].id)
            .delete();
        });
      await user
        .delete()
        .then(async () => {
          await AsyncStorage.removeItem('user_session');
          navigation.replace('Login');
          Alert.alert('Account', 'Account deleted Successfully.');
        })
        .catch(error => {
          console.log(error.message);
        });
    }

    setloader(false);
  };
  return (
    <View style={styles.mainContianer}>
      <View style={styles.TopHeaderCC}>
        {/* TopCOntainer */}
        <View style={styles.topCont}>
          <View style={styles.LeftCC}></View>
          <View style={styles.LeftCC2}>
            <Text style={styles.Hellow2}>Profile</Text>
          </View>
        </View>
      </View>
      <View style={styles.ImgCCS}>
        <Pressable style={styles.ImgContainer} onPress={selectImageFromGallery}>
          <Image
            style={{
              width: 100,
              height: 100,
              resizeMode: 'contain',
              borderRadius: 100,
            }}
            source={
              SelectedImage
                ? {uri: SelectedImage}
                : require('../../../assets/eps.png')
            }
          />
          <Text style={styles.NameText}>{username}</Text>
          <Text style={styles.NameText2}>{email}</Text>
        </Pressable>
        <View style={{marginTop: h('13%')}}>
          <ScrollView>
            <View
              style={{
                width: '100%',
              }}>
              <SettingItem
                onPress={() => {
                  navigation.navigate('GeneralInformation');
                }}
                icon={'person'}
                text1={'General information'}
                text2={'Edit Name,Email & Password'}
              />
              <SettingItem
                onPress={() => {
                  navigation.navigate('MyPost');
                }}
                icon={'bookmarks'}
                text1={'My Post'}
                text2={'Check your Post'}
              />
              <SettingItem
                onPress={() => {
                  navigation.navigate('MyEvents');
                }}
                icon={'today'}
                text1={'My Events'}
                text2={'Check your Events'}
              />
              <SettingItem
                onPress={() => {
                  navigation.navigate('MyEvents2');
                }}
                icon={'today'}
                text1={'Joined Events'}
                text2={'Check your Events'}
              />

              <SettingItem
                onPress={() => {
                  navigation.navigate('Notification');
                }}
                icon={'notifications'}
                text1={'Notifications'}
                text2={'Check your notification here'}
              />
              <SettingItem
                icon={'log-out'}
                text1={'Logout'}
                text2={'You will be missed'}
                onPress={saveData}
              />
              <SettingItem
                icon={'trash'}
                text1={'Delete Account'}
                text2={'Delete your account parmanently'}
                onPress={() => setloginLoad(true)}
              />
            </View>
          </ScrollView>
        </View>
      </View>
      <Modal
        animationType="slide"
        visible={loginLoad}
        onRequestClose={() => setloginLoad(false)}>
        <ImageBackground
          source={require('../../../assets/background.png')}
          style={styles.mainContainerLogin}>
          <Text style={styles.TopH1}>Delete Account!</Text>
          <Text style={styles.TopH2}>Login with your Email</Text>
          <View style={styles.space} />
          <AppInput
            placeholderText={'User name'}
            iconName={'person'}
            onChange={val => SetEmail(val?.toLowerCase())}
          />
          <AppPassword
            placeholderText={'Password'}
            iconName={'lock-closed'}
            secureTextEntry={Hide}
            onPress={() => {
              setHide(!Hide);
            }}
            onchange={val => setpassword(val)}
          />
          <View style={{marginTop: 15}} />
          <Appbutton
            onPress={loader ? null : LoginRequest}
            txt={
              loader ? (
                <ActivityIndicator size={'small'} color={'#fff'} />
              ) : (
                'Login'
              )
            }
          />
        </ImageBackground>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={loader}>
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

export default Setting;

const styles = StyleSheet.create({
  mainContianer: {
    flex: 1,
    backgroundColor: Colors.Primary,
  },
  TopHeaderCC: {
    // backgroundColor: 'white',
    width: '100%',
    height: h('10%'),
  },
  topCont: {
    // backgroundColor: 'red',
    width: '95%',
    height: h('7%'),
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
    width: '60%',
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
  Hellow2: {
    color: '#fff',
    fontSize: h('2.5%'),
    fontWeight: 'bold',
  },
  ImgCCS: {
    width: '100%',
    height: h('76%'),
    backgroundColor: '#fff',
    marginTop: 50,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  ImgContainer: {
    width: '60%',
    height: h('20%'),
    // backgroundColor: 'red',
    position: 'absolute',
    alignSelf: 'center',
    top: -60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  NameText: {
    color: '#000',
    fontSize: h('2.4'),
    fontWeight: 'bold',
  },
  NameText2: {
    color: '#0008',
    fontSize: h('1.9'),
  },
  SettingBOX: {
    // backgroundColor: 'red',
    width: '100%',
    height: h('15%'),
  },
  mainContainerLogin: {
    width: '100%',
    height: '100%',
  },
  TopH1: {
    color: '#fff',
    fontSize: h('2.5%'),
    // fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 25,
  },
  TopH2: {
    color: '#fff',
    fontSize: h('2.7%'),
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 5,
  },
  space: {
    marginTop: 35,
  },
});
