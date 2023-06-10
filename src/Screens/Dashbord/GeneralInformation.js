import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../Utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import AppInput2 from '../../Components/AppInput2';
import AppItem from '../../Components/AppItem';
import Appbutton from '../../Components/Appbutton';
import {useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';
const GeneralInformation = ({navigation}) => {
  // const email = '';
  const email = useSelector(state => state.counter.email);
  const username = useSelector(state => state.counter.username);
  const [loader, setloader] = useState(false);
  const SendEmail = async () => {
    setloader(true);
    try {
      await auth().sendPasswordResetEmail(email);

      Alert.alert(
        'Password Reset',
        'A password reset link has been sent to your email address.',
      );
      setloader(false);
    } catch (error) {
      Alert.alert('Error', error.message);
      setloader(false);
    }
  };
  return (
    <View style={styles.Bg}>
      <View style={styles.TopHeaderCC}>
        {/* TopCOntainer */}
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
            <Text style={styles.Hellow2}>General Information</Text>
          </View>
        </View>
        {/* TopCOntainer */}
      </View>
      <AppInput2 value={username} text={'Name'} placeholder={'Change Name'} />
      <AppInput2 value={email} text={'Email'} placeholder={'Change Email'} />
      {/* <AppInput2 text={'Password'} placeholder={'Change Email'} />
      <AppInput2 text={'Confirm Password'} placeholder={'Change Email'} /> */}

      <Appbutton
        txt={
          loader ? (
            <ActivityIndicator size={'small'} color={'#fff'} />
          ) : (
            'Change Password'
          )
        }
        onPress={loader ? null : SendEmail}
      />
    </View>
  );
};

export default GeneralInformation;

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
