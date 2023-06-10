// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   FlatList,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import Colors from '../../Utils/Colors';
// import {w, h} from 'react-native-responsiveness';
// import Icon from 'react-native-vector-icons/Ionicons';
// import AppInput from '../../Components/AppInput';
// import AppItem from '../../Components/AppItem';
// import firestore from '@react-native-firebase/firestore';

// const MyPost = ({navigation}) => {
//   const [data, setdata] = useState([]);
//   const [Loader, Setloader] = useState(true);
//   const GetMyPost = async () => {
//     try {
//       const usersCollection = firestore().collection('blogs');
//       const querySnapshot = await usersCollection
//         .where('email', '==', 'muhammadshiraz492@gmail.com')
//         .get();

//       if (querySnapshot.empty) {
//         console.log('No matching documents found.');
//         // Handle the case when no documents match the query
//       } else {
//         querySnapshot.forEach(doc => {
//           // console.log(doc.data());
//           setdata(data => [...data, doc.data()]);
//         });
//         Setloader(false);
//         // Handle the case when documents are found
//       }
//     } catch (error) {
//       console.error('Error retrieving data:', error);
//       // Handle the error case
//     }
//   };

//   useEffect(() => {
//     GetMyPost();
//   }, []);
//   return (
//     <ScrollView>
//       <View style={styles.Bg}>
//         <View style={styles.TopHeaderCC}>
//           {/* TopCOntainer */}
//           <View style={styles.topCont}>
//             <View style={styles.LeftCC}>
//               <TouchableOpacity
//                 onPress={() => {
//                   navigation.goBack();
//                 }}
//                 style={styles.LeftCC}>
//                 <View style={styles.Cicle2}>
//                   <Icon name={'arrow-back'} size={25} color="#FFFFFF" />
//                 </View>
//               </TouchableOpacity>
//             </View>
//             <View style={styles.LeftCC2}>
//               <Text style={styles.Hellow2}>My Post</Text>
//             </View>
//           </View>

//           {/* TopCOntainer */}

//           <View style={styles.SearchContainer}>
//             <AppInput
//               editable={Loader ? true : false}
//               backgroundColor={'#21424A'}
//               placeholderText={'What are you looking for?'}
//               iconName={'search'}
//             />
//           </View>
//         </View>
//         <View style={styles.bottomContainer}>
//           {Loader ? (
//             <View
//               style={{
//                 flex: 0.7,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}>
//               <ActivityIndicator size={'large'} />
//             </View>
//           ) : (
//             <>
//               <View style={{height: 40}} />
//               <FlatList
//                 data={data}
//                 renderItem={({item, index}) => (
//                   <AppItem
//                     key={index.toString}
//                     item={item}
//                     onPress={() => {
//                       navigation.navigate('BlogDetails', {
//                         imageUrl: item.imageurl,
//                         title: item.title,
//                         description: item.description,
//                       });
//                     }}
//                   />
//                 )}
//               />
//             </>
//           )}
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default MyPost;

// const styles = StyleSheet.create({
//   Bg: {
//     width: '100%',
//     height: h('100%'),
//     backgroundColor: Colors.Primary,
//   },
//   TopHeaderCC: {
//     // backgroundColor: 'white',
//     width: '100%',
//     height: h('20%'),
//     zIndex: 100,
//   },
//   topCont: {
//     // backgroundColor: 'red',
//     width: '95%',
//     height: h('7%'),
//     alignSelf: 'center',
//     marginTop: 10,
//     flexDirection: 'row',
//   },
//   LeftCC: {
//     // backgroundColor: 'green',
//     width: '20%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   LeftCC2: {
//     // backgroundColor: 'orange',
//     width: '60%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   Cicle: {
//     backgroundColor: '#fff',
//     width: 50,
//     height: 50,
//     borderRadius: 100 / 2,
//     overflow: 'hidden',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   Cicle2: {
//     backgroundColor: '#fff2',
//     width: 50,
//     height: 50,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   ImgBg: {
//     width: '90%',
//     height: '90%',
//     resizeMode: 'cover',
//     borderRadius: 100 / 2,
//   },
//   Hellow: {
//     color: '#fff',
//     fontSize: h('1.9%'),
//   },
//   Hellow2: {
//     color: '#fff',
//     fontSize: h('2.5%'),
//     fontWeight: 'bold',
//   },
//   SearchContainer: {
//     // backgroundColor: 'red',
//     width: '100%',
//     height: h('10%'),
//     alignSelf: 'center',
//     zIndex: 1,
//   },
//   bottomContainer: {
//     backgroundColor: '#fff',
//     width: '100%',
//     height: '100%',
//     borderTopRightRadius: 10,
//     borderTopLeftRadius: 10,
//     zIndex: 1,
//     position: 'absolute',
//     top: '13%',
//     paddingTop: 10,
//   },
// });
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
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import AppMyItem from '../../Components/AppMyItem';

const MyPost = ({navigation}) => {
  const [data, setData] = useState([]);
  const [MainData, SetMainData] = useState([]);
  const [loader, setLoader] = useState(true);
  const email = useSelector(state => state.counter.email);
  const [searchQuery, setSearchQuery] = useState('');

  const getMyPost = async () => {
    try {
      const usersCollection = firestore().collection('blogs');
      const querySnapshot = await usersCollection
        .where('email', '==', email)
        .get();

      if (querySnapshot.empty) {
        console.log('No matching documents found.');
        setLoader(false);

        // Handle the case when no documents match the query
      } else {
        const userData = [];
        querySnapshot.forEach(documentSnapshot => {
          const data = documentSnapshot.data();
          const id = documentSnapshot.id;
          const userDataWithId = {id, ...data};
          userData.push(userDataWithId);
        });
        setData(userData);
        SetMainData(userData);
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
  const handleSearch = text => {
    if (text) {
      setSearchQuery(text);
      const filtered = MainData.filter(item =>
        item.title.toLowerCase().includes(text.toLowerCase()),
      );
      setData(filtered);
    } else {
      setData(MainData);
    }
  };

  return (
    <View style={styles.Bg}>
      <View style={styles.TopHeaderCC}>
        <View style={styles.topCont}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.LeftCC}>
            <View style={styles.Cicle2}>
              <Icon name={'arrow-back'} size={25} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <View style={styles.LeftCC2}>
            <Text style={styles.Hellow2}>My Post</Text>
          </View>
        </View>

        {/* TopCOntainer */}

        <View style={styles.SearchContainer}>
          <AppInput
            editable={loader ? true : false}
            backgroundColor={'#21424A'}
            placeholderText={'What are you looking for?'}
            iconName={'search'}
            onChange={val => handleSearch(val)}
          />
        </View>
      </View>
      <View style={styles.bottomContainer}>
        {loader ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={'large'} />
          </View>
        ) : data.length <= 0 ? (
          <View style={styles.loaderContainer}>
            <Text>Data Not found</Text>
          </View>
        ) : (
          <>
            <View style={{height: 30}} />

            <FlatList
              data={data}
              renderItem={({item, index}) => (
                <AppMyItem
                  key={index.toString}
                  item={item}
                  Like={val => {
                    UploadPost(val);
                  }}
                  data={MainData}
                  loadingFun={val => setLoader(val)}
                  setnewdata={dat => {
                    SetMainData(dat);
                    setData(dat);
                  }}
                  checkLike={val => CheckLike(val)}
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
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={{height: 100}} />
          </>
        )}
      </View>
    </View>
  );
};

export default MyPost;

const styles = StyleSheet.create({
  Bg: {
    width: '100%',
    height: h('100%'),
    backgroundColor: Colors.Primary,
  },
  TopHeaderCC: {
    width: '100%',
    height: h('20%'),
    zIndex: 100,
  },
  topCont: {
    width: '95%',
    height: h('7%'),
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
  },
  LeftCC: {
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  LeftCC2: {
    width: '60%',
    height: '100%',
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
  Hellow2: {
    color: '#fff',
    fontSize: h('2.5%'),
    fontWeight: 'bold',
  },
  SearchContainer: {
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
