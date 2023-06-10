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
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {setImageUrl} from '../../Redux/counterSlice';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const username = useSelector(state => state.counter.username);
  const email = useSelector(state => state.counter.email);
  let navigation = useNavigation();
  console.log('This is EMail', email);
  const [Data, setData] = useState([]);
  const [MainData, SetMainData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(true);
  const [Mainloader, setMainloader] = useState(true);
  const [loader, setloader] = useState('');
  const [loaderImage, setloadImage] = useState('');
  let Dispatch = useDispatch();
  const UploadPost = val => {
    setloader(val);
    firestore()
      .collection('Like')
      .add({
        Post_id: val,
        email: email,
      })
      .then(() => {
        // Alert.alert('Sccuess!', 'Event Are Uploaded');
        // setLoader(false);
        // navigation.pop();
        setloader('');
      })
      .catch(error => {
        // console.log('Error adding document:', error);
        // Alert.alert('Error', 'Data not saved');
        // setLoader(false);
        // setloader(false);
        setloader('');
      });
  };

  const GetData = () => {
    firestore()
      .collection('blogs')
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

        // Process the retrieved data as needed
      })
      .catch(error => {
        console.log('Error fetching user data:', error);
      });
  };
  const CheckDoc = async val => {
    console.log(email);
    const usersCollection = firestore().collection('Users');
    const Querysnapshot = await usersCollection
      .where('email', '==', email)
      .get();
    if (Querysnapshot.empty) {
      setMainloader(false);
    } else {
      Dispatch(setImageUrl(Querysnapshot.docs[0].data().ImageUrl));
      setloadImage(Querysnapshot.docs[0].data().ImageUrl);
      setMainloader(false);
    }
    //  else {
    //   setMainloader(false);
    // }
  };
  useEffect(() => {
    // navigation.
    navigation.addListener('focus', () => {
      setloader(true);
      GetData();
      CheckDoc();
    });
  }, []);
  const handleSearch = text => {
    if (text) {
      setData(
        MainData.filter(item =>
          item.title.toLowerCase().includes(text.toLowerCase()),
        ),
      );
    } else {
      setData(MainData);
    }
  };
  const handleRefresh = () => {
    setRefreshing(true);
    GetData();
    CheckDoc();
  };
  return Mainloader ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    // // <ScrollView
    //   refreshControl={
    //     <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
    //   }>
    <View style={styles.Bg}>
      <View style={styles.TopHeaderCC}>
        <ScrollView
          style={{height: 90}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }>
          {/* TopCOntainer */}
          <View style={styles.topCont}>
            <View style={styles.LeftCC}>
              <View style={styles.Cicle}>
                <Image
                  style={styles.ImgBg}
                  source={{
                    uri: loaderImage
                      ? loaderImage
                      : 'https://t3.ftcdn.net/jpg/02/00/90/24/360_F_200902415_G4eZ9Ok3Ypd4SZZKjc8nqJyFVp1eOD6V.jpg',
                  }}
                />
              </View>
            </View>
            <View style={styles.LeftCC2}>
              <Text style={styles.Hellow}>Hello,</Text>
              <Text style={styles.Hellow2}>{username}👋</Text>
            </View>
            <View style={styles.LeftCC}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AddBlog');
                  // console.log(CheckLike().then((doc)=>return doc));
                }}
                style={styles.Cicle2}>
                <Icon name={'add'} size={25} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          {/* TopCOntainer */}

          <View style={styles.SearchContainer}>
            <AppInput
              backgroundColor={'#21424A'}
              placeholderText={'What are you looking for?'}
              iconName={'search'}
              onChange={val => handleSearch(val)}
            />
          </View>
          {/* <View style={{height: 70}} /> */}
        </ScrollView>
      </View>
      <View style={styles.bottomContainer}>
        {/* <AppItem
            onPress={() => {
              navigation.navigate('BlogDetails');
            }}
          /> */}
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
          renderItem={({item, index}) => (
            <AppItem
              key={index.toString}
              item={item}
              Like={val => {
                UploadPost(val);
              }}
              // checkLike={val => CheckLike(val)}
              onPress={() => {
                navigation.navigate('BlogDetails', {
                  imageUrl: item.imageurl,
                  title: item.title,
                  description: item.description,
                  Authur: item.Author,
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

export default Home;

const styles = StyleSheet.create({
  Bg: {
    width: '100%',
    height: h('100%'),
    backgroundColor: Colors.Primary,
  },
  TopHeaderCC: {
    // backgroundColor: 'white',
    width: '100%',
    height: 190,
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
    borderRadius: 10,
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
    fontSize: h('2%'),
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
  },
});
