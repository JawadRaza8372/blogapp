import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../Utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import AppInput from '../../Components/AppInput';
import AppItem from '../../Components/AppItem';

import AppEvents from '../../Components/AppEvents';
import Noti from '../../Components/Noti';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
const Notification = () => {
  const [loader, setloader] = useState(true);
  let navigation = useNavigation();
  const [Data, setData] = useState([]);
  const GetData = () => {
    AsyncStorage.getItem('notification')
      .then(arrayString => {
        if (arrayString) {
          const retrievedArray = JSON.parse(arrayString);
          console.log('Retrieved array:', retrievedArray);
          setData(JSON.parse(arrayString));
          setloader(false);
        } else {
          console.log('Array not found in AsyncStorage.');
          setloader(false);
        }
      })
      .catch(error => {
        console.log('Error retrieving array:', error);
      });
  };
  useEffect(() => {
    navigation.addListener('focus', () => {
      GetData();
    });
  }, []);
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
              <Icon name={'arrow-back-outline'} size={25} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.LeftCC2}>
            <Text style={styles.Hellow2}>Notifications</Text>
          </View>
        </View>
        {/* TopCOntainer */}
      </View>

      {/* bottom */}

      {loader ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator size={'small'} />
        </View>
      ) : (
        <>
          <FlatList data={Data} renderItem={({item}) => <Noti val={item} />} />
        </>
      )}
      {/* <Noti />
      <Noti />
      <Noti /> */}
      {/* bottom */}
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  Bg: {
    flex: 1,
  },
  TopHeaderCC: {
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
});
