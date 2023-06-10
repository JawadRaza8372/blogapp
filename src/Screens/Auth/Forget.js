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

import AppInput from '../../Components/AppInput';
import AppPassword from '../../Components/AppPassword';
import Appbutton from '../../Components/Appbutton';
import auth from '@react-native-firebase/auth';

const Forget = ({navigation}) => {
  const [Email, setEmail] = useState('');
  const [loader, setloader] = useState(false);
  return (
    <ImageBackground
      source={require('../../../assets/background.png')}
      style={styles.mainContainer}>
      <Text style={styles.TopH1}>Reset!</Text>
      <Text style={styles.TopH2}>Reset with your Email</Text>
      <View style={styles.space} />
      <AppInput
        placeholderText={'User Email'}
        iconName={'person'}
        onChange={val => setEmail(val)}
      />

      <View style={styles.ForgetView}></View>

      <Appbutton
        onPress={() => {
          setloader(true);
          // navigation.navigate('TabNavigation');
          auth()
            .sendPasswordResetEmail(Email)
            .then(() => {
              Alert.alert(
                'Reset',
                'Password Reset Link Has Been Sent on your email!',
              );
              setloader(false);
              setEmail('');
            })
            .catch(() => {
              Alert.alert('Reset', 'Email are not Exist');
              setloader(false);
            });
          // console.log(Email);
        }}
        txt={loader ? <ActivityIndicator size={'small'} /> : 'Reset'}
      />
    </ImageBackground>
  );
};

export default Forget;

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
