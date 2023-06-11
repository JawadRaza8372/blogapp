import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../Utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import AppInput from '../../Components/AppInput';
import AppItem from '../../Components/AppItem';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';

import AppEvents from '../../Components/AppEvents';
import {useNavigation} from '@react-navigation/native';

const MyEvents2 = () => {
  let navigation = useNavigation();
  const [data, setData] = useState([]);
  const [MainData, SetMainData] = useState([]);
  const [loader, setLoader] = useState(true);
  const email = useSelector(state => state.counter.email);
  const [searchQuery, setSearchQuery] = useState('');

  const getMyPost = async () => {
    setLoader(true);
    try {
      await firestore()
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
          setLoader(false);
        })
        .catch(error => {
          setLoader(false);
          console.log('Error fetching user data:', error);
        });
    } catch (error) {
      console.error('Error retrieving data:', error);
      // Handle the error case
    }
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      getMyPost();
    });
  }, []);
  const handleSearch = text => {
    if (text) {
      setSearchQuery(text);
      const filtered = data.filter(item =>
        item.Name.toLowerCase().includes(text.toLowerCase()),
      );
      setData(filtered);
    } else {
      setData(MainData);
    }
  };

  return (
    // <ScrollView>
    <View style={styles.Bg}>
      <View style={styles.TopHeaderCC}>
        {/* TopCOntainer */}
        <ScrollView>
          <View style={styles.topCont}>
            <View style={styles.LeftCC}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={styles.LeftCC}>
                <View style={styles.Cicle2}>
                  <Icon name={'arrow-back'} size={25} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.LeftCC2}>
              <Text style={styles.Hellow2}>Joined Events</Text>
            </View>
            <View style={styles.LeftCC}>
              {/* <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Addevent');
                  }}
                  style={styles.Cicle2}>
                  <Icon name={'add'} size={25} color="#FFFFFF" />
                </TouchableOpacity> */}
            </View>
          </View>
          {/* TopCOntainer */}

          {/* <View style={styles.SearchContainer}>
              <AppInput
                backgroundColor={'#21424A'}
                placeholderText={'What are you looking for?'}
                iconName={'search'}
              />
            </View> */}
        </ScrollView>
      </View>
      <View style={styles.bottomContainer}>
        {data?.length <= 0 ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Data Not found</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            renderItem={({item}) => {
              const check = item?.joined?.filter(dat => dat.uid === email);
              if (check?.length > 0) {
                return (
                  <AppEvents
                    item={item}
                    onPress={() => {
                      navigation.navigate('EventDetails', {
                        item: item,
                      });
                    }}
                  />
                );
              } else {
                return null;
              }
            }}
          />
        )}
        {/*
            <AppEvents
              onPress={() => {
                navigation.navigate('EventDetails');
              }}
            /> */}
      </View>
    </View>
  );
};

export default MyEvents2;

const styles = StyleSheet.create({
  Bg: {
    width: '100%',
    height: h('100%'),
    backgroundColor: Colors.Primary,
  },
  TopHeaderCC: {
    // backgroundColor: 'white',
    width: '100%',
    height: h('20%'),
    zIndex: 100,
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
    top: '13%',
    paddingTop: 10,
  },
});
