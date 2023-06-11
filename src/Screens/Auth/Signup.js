import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import AppInput from '../../Components/AppInput';
import AppPassword from '../../Components/AppPassword';
import Appbutton from '../../Components/Appbutton';
import firestore from '@react-native-firebase/firestore';
const Signup = ({navigation}) => {
  const [Hide, setHide] = React.useState(false);
  const [Hide2, setHide2] = React.useState(false);
  const [username, setusername] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setpassword] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');
  const [loader, setloader] = useState(false);
  // const user=auth().currentUser
  const isValidEmail = email => {
    // Use a regular expression or any validation library
    // to validate the email format. Below is a simple example:
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // return emailRegex.test(email);
    return true;
  };
  const sendVerificationEmail = userCredential => {
    const user = userCredential.user;
    auth().onAuthStateChanged(async user => {
      if (user) {
        try {
          await user.sendEmailVerification();
          Alert.alert('Verification', 'Verification email sent');
        } catch (error) {
          console.log(error);
          Alert.alert('Error', error.code);
        } finally {
          setloader(false);
          navigation.goBack();
        }
      }
    });
  };
  const createuser = () => {
    if (username.trim() == '') {
      Alert.alert('Error', 'Username is required');
      return;
    }
    if (Email.trim() === '') {
      // Check if email is empty
      Alert.alert('Error', 'Email is required');
      return;
    }
    if (!isValidEmail(Email)) {
      // Check if email format is valid
      Alert.alert('Error', 'Invalid email format');
      return;
    } else if (Password != confirmpassword) {
      Alert.alert('Error', 'Password are not Match');
      return;
    } else {
      CreateUser();
    }
  };
  // const CheckDoc = async () => {
  //   const usersCollection = firestore().collection('Users');
  //   const Querysnapshot = await usersCollection
  //     .where('email', '==', Email)
  //     .get();
  //   if (Querysnapshot.empty) {
  //     // return null;
  //     // Alert.alert('user', 'Usernot Exist');
  //     // setloader(false);
  //     AddDatainFireStore();
  //   } else {
  //     Alert.alert('user', 'Email Already Existed');
  //     setloader(false);
  //   }
  // };
  const AddDatainFireStore = userCredential => {
    firestore()
      .collection('Users')
      .add({
        name: username,
        email: Email?.replace(' ', ''),
        fcmtoken: '',
        status: true,
      })
      .then(() => {
        sendVerificationEmail(userCredential);
      })
      .catch(() => {
        Alert.alert('Error', 'Data Are not Saving ');
        setloader(false);
      });
  };
  const CreateUser = async () => {
    setloader(true);
    await auth()
      .createUserWithEmailAndPassword(Email?.replace(' ', ''), Password)
      .then(userCredential => {
        if (userCredential != {} || userCredential?.length > 0) {
          AddDatainFireStore(userCredential);
        }
      })
      .catch(err => {
        console.log(err.code);
        Alert.alert('Error', err.code);
        setloader(false);
      });
  };

  return (
    <ImageBackground
      source={require('../../../assets/background.png')}
      style={styles.mainContainer}>
      <Text style={styles.TopH1}>Welcome to our app</Text>
      <Text style={styles.TopH2}>Make an account</Text>
      <View style={styles.space} />
      <AppInput
        value={username}
        placeholderText={'User name'}
        iconName={'person'}
        onChange={vale => setusername(vale)}
      />
      <AppInput
        value={Email}
        placeholderText={'Email'}
        iconName={'mail'}
        onChange={vale => {
          setEmail(vale?.toLowerCase());
        }}
      />
      <AppPassword
        placeholderText={'Password'}
        iconName={'lock-closed'}
        secureTextEntry={Hide}
        onPress={() => {
          setHide(!Hide);
        }}
        onchange={value => {
          setpassword(value);
        }}
      />
      <AppPassword
        placeholderText={'Confirm Password'}
        iconName={'lock-closed'}
        secureTextEntry={Hide2}
        onPress={() => {
          setHide2(!Hide2);
        }}
        onchange={value => {
          setconfirmpassword(value);
        }}
      />
      <View style={styles.space} />
      <Appbutton
        txt={
          loader ? (
            <ActivityIndicator size={'small'} color={'#fff'} />
          ) : (
            'Sign up'
          )
        }
        onPress={loader ? null : createuser}
      />

      <View style={styles.SinguPContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Text style={styles.SignText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Signup;

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
    marginTop: 55,
  },
  SignText: {
    color: '#fff',
    fontSize: h('2%'),
  },
});
