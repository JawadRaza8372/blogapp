import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AppInput from '../../Components/AppInput';
import AppPassword from '../../Components/AppPassword';
import Appbutton from '../../Components/Appbutton';
import messaging from '@react-native-firebase/messaging';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {setImageUrl, setemail, setusername} from '../../Redux/counterSlice';
import {LoginManager} from 'react-native-fbsdk';
const Login = ({navigation}) => {
  const [Hide, setHide] = React.useState(true);
  const [Email, SetEmail] = useState('');
  const [Password, setpassword] = useState('');
  const [loader, setloader] = useState(false);
  const [fcmtoken, setfcmtoken] = useState('This is Fcm Token');
  const [isloader, setisloader] = useState(true);
  const [Loader, setLoader] = useState(false);
  const Dispatch = useDispatch();

  const saveData = async (val, val2, val3) => {
    try {
      await AsyncStorage.setItem(
        'user_sessionblog',
        JSON.stringify({
          email: Email,
          username: val,
          ImageUrl: val2,
        }),
      );
      Dispatch(setImageUrl(val2));
      Dispatch(setemail(Email));
      Dispatch(setusername(val));
      setloader(false);
      navigation.replace('TabNavigation');
    } catch (error) {
      console.log(error);
      setloader(false);
    }
  };
  const saveDataGoogle = async (val, val2, val3) => {
    try {
      await AsyncStorage.setItem(
        'user_sessionblog',
        JSON.stringify({
          email: val2,
          username: val,
          ImageUrl: val3,
        }),
      );
      console.log('Val', val);
      console.log('Val2', val2);
      console.log('Val3', val3);
      Dispatch(setemail(val2));
      Dispatch(setImageUrl(val3));
      Dispatch(setusername(val));
      setLoader(false);
      navigation.replace('TabNavigation');
    } catch (error) {
      console.log(error);
      setloader(false);
    }
  };

  const generateFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      setfcmtoken(token);
      setisloader(false);
    } catch (error) {
      console.log('Error generating FCM token:', error);
      setisloader(false);
    }
  };
  async function onGoogleButtonPress() {
    setLoader(true);
    GoogleSignin.configure({
      webClientId:
        '778327964496-5pmf4rfhtl45p4ld7rq3sj0fgscs4j2i.apps.googleusercontent.com',
    });

    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

      // Check if a user is already signed in
      const currentUser = auth().currentUser;
      if (currentUser) {
        // If a user is signed in, sign them out first
        await auth().signOut();
      }

      // Get the user's ID token and additional user information
      const {idToken, user} = await GoogleSignin.signIn();

      // Access user information
      const {name, email, photo} = user;

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      console.log('Username:', name);
      console.log('Email:', email);
      console.log('Profile Image URL:', photo);
      GoogleCheckDoc(name, email, photo);
    } catch (error) {
      Alert.alert('Something Went Wrong');
      setLoader(false);
    }
  }
  // Call the function to generate the FCM token

  const updateDocument = async (docId, updatedFields) => {
    // console.log(updatedFields.name);
    try {
      const documentRef = firestore().collection('Users').doc(docId);
      await documentRef.update(updatedFields);
      // console.log('Document updated successfully!');
      saveData(updatedFields.name, updatedFields.ImageUrl);
    } catch (error) {
      Alert.alert('Error updating document:', error);
      setloader(false);
    }
  };
  const updateDocumentonGoogle = async (docId, updatedFields) => {
    // console.log(updatedFields.name);
    try {
      const documentRef = firestore().collection('Users').doc(docId);
      await documentRef.update(updatedFields);
      // console.log('Document updated successfully!');
      saveDataGoogle(
        updatedFields.name,
        updatedFields.email,
        updatedFields.ImageUrl,
      );
    } catch (error) {
      Alert.alert('Error updating document:', error);
      setloader(false);
    }
  };
  const CheckDoc = async () => {
    const usersCollection = firestore().collection('Users');
    const Querysnapshot = await usersCollection
      .where('email', '==', Email)
      .get();
    if (Querysnapshot.empty) {
      setloader(false);
    } else {
      console.log(Querysnapshot.docs[0].data());
      updateDocument(Querysnapshot.docs[0].id, {
        email: Querysnapshot.docs[0].data().email,
        fcmtoken: fcmtoken,
        ImageUrl: Querysnapshot.docs[0].data().ImageUrl
          ? Querysnapshot.docs[0].data().ImageUrl
          : 'https://img.freepik.com/free-icon/user_318-563642.jpg?w=2000',
        name: Querysnapshot.docs[0].data().name,
        status: true,
      });
    }
  };
  const AddDatainFireStore = (val, val2, val3) => {
    firestore()
      .collection('Users')
      .add({
        email: val2,
        fcmtoken: fcmtoken,
        ImageUrl: val3
          ? val3
          : 'https://img.freepik.com/free-icon/user_318-563642.jpg?w=2000',
        name: val,
        status: true,
      })
      .then(() => {
        // console.log('User added!');
        // setloader(false);
        // CreateUser();
        // sendVerificationEmail(userCredential);
        saveDataGoogle(val, val2, val3);
      })
      .catch(() => {
        Alert.alert('Error', 'Data Are not Saving ');
        setloader(false);
      });
  };
  const GoogleCheckDoc = async (val, val2, val3) => {
    const usersCollection = firestore().collection('Users');
    const Querysnapshot = await usersCollection
      .where('email', '==', val2)
      .get();
    if (Querysnapshot.empty) {
      AddDatainFireStore(val, val2, val3);
      // setloader(false);
    } else {
      console.log(Querysnapshot.docs[0].data());
      updateDocumentonGoogle(Querysnapshot.docs[0].id, {
        email: Querysnapshot.docs[0].data().email,
        fcmtoken: fcmtoken,
        ImageUrl: Querysnapshot.docs[0].data().ImageUrl
          ? Querysnapshot.docs[0].data().ImageUrl
          : 'https://img.freepik.com/free-icon/user_318-563642.jpg?w=2000',
        name: Querysnapshot.docs[0].data().name,
        status: true,
      });
    }
  };
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
      const User = await auth().signInWithEmailAndPassword(Email, Password);
      if (User.user.emailVerified) {
        CheckDoc();
      } else {
        try {
          await User.user.sendEmailVerification();
          Alert.alert(
            'Verification',
            'Your Email is Not Verified Please Verifiy your email',
          );
        } catch (error) {
          console.log(error);
          Alert.alert('Error', error.code);
        } finally {
          setloader(false);
        }
      }
    } catch (error) {
      console.log(error);
      setloader(false);
      Alert.alert('Error', error.message);
    }
  };
  useEffect(() => {
    generateFCMToken();
  }, []);

  const Fblogin = () => {
    LoginManager.logOut();
    LoginManager.logInWithPermissions(['email', 'public_profile'])
      .then(result => {
        console.log('THis is Result', result);
      })
      .catch(err => {
        console.log(err);
      });
  };
  return isloader ? (
    <ImageBackground
      source={require('../../../assets/background.png')}
      style={styles.mainContainer}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    </ImageBackground>
  ) : (
    <ImageBackground
      source={require('../../../assets/background.png')}
      style={styles.mainContainer}>
      <Text style={styles.TopH1}>Welcome Back!</Text>
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

      <View style={styles.ForgetView}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Forget');
          }}>
          <Text style={styles.forgetPasswordText}>Forget Password</Text>
        </TouchableOpacity>
      </View>

      <Appbutton
        onPress={loader ? null : LoginRequest}
        txt={
          loader ? <ActivityIndicator size={'small'} color={'#fff'} /> : 'Login'
        }
      />
      <Text style={styles.SignupText}>Or Sign up with</Text>

      {/* auth logins */}
      <View style={styles.AUthSytlesCC}>
        {/* button 1 */}
        <View style={styles.leftViewCC}>
          <TouchableOpacity
            style={styles.bttn}
            onPress={() => {
              onGoogleButtonPress();
            }}>
            <Image
              style={styles.IconC}
              source={require('../../../assets/google.png')}
            />
          </TouchableOpacity>
        </View>
        {/* button 1 */}
        {/* button 1 */}
        <View style={styles.leftViewCC}>
          <TouchableOpacity style={styles.bttn} onPress={Fblogin}>
            <Image
              style={styles.IconC}
              source={require('../../../assets/facebook.png')}
            />
          </TouchableOpacity>
        </View>
        {/* button 1 */}
        {/* button 1 */}
        {Platform.OS == 'ios' ? (
          <View style={styles.leftViewCC}>
            <TouchableOpacity style={styles.bttn}>
              <Image
                style={styles.IconC}
                source={require('../../../assets/apple.png')}
              />
            </TouchableOpacity>
          </View>
        ) : null}
        {/* button 1 */}
      </View>
      {/* auth logins */}
      <View style={styles.SinguPContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Signup');
          }}>
          <Text style={styles.SignText}>Didn't have account? Sign up</Text>
        </TouchableOpacity>
      </View>
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
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainContainer: {
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
  ForgetView: {
    width: '95%',
    height: h('5%'),
    // backgroundColor: 'red',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  forgetPasswordText: {
    color: '#fff',
    fontSize: h('2%'),
    fontWeight: '600',
  },
  SignupText: {
    color: '#fff5',
    fontSize: h('2%'),
    // fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 20,
  },
  AUthSytlesCC: {
    // backgroundColor: 'red',
    width: '90%',
    height: h('10%'),
    alignSelf: 'center',
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  leftViewCC: {
    // backgroundColor: 'green',
    width: '33%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bttn: {
    backgroundColor: '#fff1',
    borderRadius: 1000 / 2,
    width: '90%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  IconC: {
    width: '40%',
    height: '40%',
    resizeMode: 'contain',
  },
  SinguPContainer: {
    width: '90%',
    height: h('7%'),
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  SignText: {
    color: '#fff',
    fontSize: h('2%'),
  },
});
