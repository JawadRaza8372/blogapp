import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../Utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import AppInput from '../../Components/AppInput';
import AppItem from '../../Components/AppItem';

import AppEvents from '../../Components/AppEvents';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

const Event = () => {
  let navigation = useNavigation();
  const [Data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [MainData, SetMainData] = useState([]);
  const handleRefresh = () => {
    setRefreshing(true);
    GetData();
  };
  const GetData = () => {
    firestore()
      .collection('events')
      .get()
      .then(querySnapshot => {
        const userData = [];
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.exists) {
            const data = documentSnapshot.data();
            const id = documentSnapshot.id;
            const userDataWithId = {id, ...data};
            userData.push(userDataWithId);
          }
        });
        if (userData) {
          setData(userData);
          SetMainData(userData);
          setRefreshing(false);
        }
      })
      .catch(error => {
        setRefreshing(false);
        console.log('Error fetching user data:', error);
      });
  };
  useEffect(() => {
    navigation.addListener('focus', () => {
      GetData();
    });
  }, []);
  const handleSearch = text => {
    if (text) {
      const filtered = MainData.filter(item =>
        item.Name.toLowerCase().includes(text.toLowerCase()),
      );
      setData(filtered);
    } else {
      setData(MainData);
    }
  };

  return (
    <View style={styles.Bg}>
      <View style={styles.TopHeaderCC}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }>
          <View style={styles.topCont}>
            <View style={styles.LeftCC}></View>
            <View style={styles.LeftCC2}>
              <Text style={styles.Hellow2}>Events</Text>
            </View>
            <View style={styles.LeftCC}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Addevent');
                }}
                style={styles.Cicle2}>
                <Icon name={'add'} size={25} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.SearchContainer}>
            <AppInput
              backgroundColor={'#21424A'}
              placeholderText={'What are you looking for?'}
              iconName={'search'}
              onChange={val => handleSearch(val)}
            />
          </View>
        </ScrollView>
      </View>
      <View style={styles.bottomContainer}>
        <FlatList
          data={Data}
          ListEmptyComponent={
            <View
              style={{
                width: '100%',
                height: 150,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 18}}>No data available</Text>
            </View>
          }
          renderItem={({item}) => (
            <AppEvents
              item={item}
              onPress={() => {
                navigation.navigate('EventDetails', {
                  item: item,
                });
              }}
            />
          )}
        />

        <View style={{height: 200}} />
      </View>
    </View>
  );
};

export default Event;

const styles = StyleSheet.create({
  Bg: {
    width: '100%',
    height: h('100%'),
    backgroundColor: Colors.Primary,
  },
  TopHeaderCC: {
    // backgroundColor: 'white',
    width: '100%',
    height: 200,
    zIndex: 100,
  },
  topCont: {
    // backgroundColor: 'red',
    width: '95%',
    height: 80,
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
  Hellow: {
    color: '#fff',
    fontSize: h('1.9%'),
  },
  Hellow2: {
    color: '#fff',
    fontSize: h('2.5%'),
    fontWeight: 'bold',
  },
  SearchContainer: {
    // backgroundColor: 'red',
    width: '100%',
    height: h('10%'),
    alignSelf: 'center',
    zIndex: 1,
  },
  bottomContainer: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    zIndex: 1,
    position: 'absolute',
    top: '19%',
    paddingTop: 50,
    marginBottom: 10,
  },
});
