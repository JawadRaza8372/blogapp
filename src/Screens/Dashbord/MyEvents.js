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
import AppMyEvents from '../../Components/AppMyEvents';
import {ActivityIndicator} from 'react-native';

const MyEvents = ({navigation}) => {
  const [MainData, SetMainData] = useState([]);
  const [loader, setLoader] = useState(true);
  const email = useSelector(state => state.counter.email);

  const getMyPost = async () => {
    try {
      const usersCollection = firestore().collection('events');
      const querySnapshot = await usersCollection
        .where('email', '==', email)
        .get();

      if (querySnapshot.empty) {
        setLoader(false);

        console.log('No matching documents found.');
        // Handle the case when no documents match the query
      } else {
        const fetchedData = [];
        querySnapshot.forEach(documentSnapshot => {
          const data = documentSnapshot.data();
          const id = documentSnapshot.id;
          const userDataWithId = {id, ...data};
          fetchedData.push(userDataWithId);
        });
        SetMainData(fetchedData);
        setLoader(false);
        // Handle the case when documents are found
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      // Handle the error case
    }
  };

  useEffect(() => {
    getMyPost();
  }, []);

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
              <Text style={styles.Hellow2}>My Events</Text>
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
        {loader ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={'large'} />
          </View>
        ) : MainData.length <= 0 ? (
          <View style={{...styles.loaderContainer, flex: 0.5}}>
            <Text>Data Not found</Text>
          </View>
        ) : (
          <FlatList
            data={MainData}
            renderItem={({item, index}) => (
              <AppMyEvents
                key={index.toString}
                item={item}
                onPress={() => {
                  navigation.navigate('EventDetails', {
                    item: item,
                  });
                }}
                data={MainData}
                loadingFun={val => setLoader(val)}
                setnewdata={dat => {
                  SetMainData(dat);
                }}
              />
            )}
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

export default MyEvents;

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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
