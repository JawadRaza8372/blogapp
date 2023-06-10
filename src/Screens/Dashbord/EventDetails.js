import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../Utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Appbutton from '../../Components/Appbutton';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

const EventDetails = ({route}) => {
  let navigation = useNavigation();
  const {item} = route.params;
  const [locationModalMap, setlocationModalMap] = useState(false);
  const [joinedPersons, setjoinedPersons] = useState(
    item?.joined?.length > 0 ? item.joined : [],
  );
  const email = useSelector(state => state.counter.email);
  const [Loader, setLoader] = useState(false);
  const checkjoined = joinedPersons?.find(dat => dat.uid === email);
  const DeleteLike = async () => {
    setLoader(true);
    try {
      firestore()
        .collection('events')
        .doc(item.id)
        .get()
        .then(dat => {
          setjoinedPersons(dat.data().joined);
        })
        .finally(() => {
          firestore()
            .collection('events')
            .doc(item.id)
            .update({
              joined: joinedPersons.filter(dat => dat.uid !== email),
            })
            .then(() => {
              setjoinedPersons(joinedPersons.filter(dat => dat.uid !== email));
              setLoader(false);
            })
            .catch(error => {
              console.log(error);
              setLoader(false);
            });
        });
    } catch (error) {
      setLoader(false);

      console.error('Error occurred while deleting document:', error);
    }
  };
  const UploadPost = async () => {
    setLoader(true);
    await firestore()
      .collection('events')
      .doc(item.id)
      .get()
      .then(dat => {
        setjoinedPersons(dat.data().joined);
      })
      .finally(() => {
        firestore()
          .collection('events')
          .doc(item.id)
          .update({
            joined:
              joinedPersons?.length > 0
                ? [...joinedPersons, {uid: email}]
                : [{uid: email}],
          })
          .then(() => {
            setjoinedPersons(
              joinedPersons?.length > 0
                ? [...joinedPersons, {uid: email}]
                : [{uid: email}],
            );
            Alert.alert('Event', 'Event Joined Successfully');
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log('Error adding document:', error);
        Alert.alert('Error', 'Data not saved');
      });
    setLoader(false);
  };
  const reportBtn = async () => {
    setLoader(true);
    await firestore()
      .collection('reports')
      .add({
        itemid: item.id,
        title: item.Name,
        postedBy: item.email,
        reportedBy: email,
        type: 'events',
      })
      .then(() => {
        Alert.alert('Report', 'This post is reported to admin successfully');
      });
    setLoader(false);
  };
  return (
    <View style={styles.MainContainer}>
      {/* top CC */}
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
          <Text style={styles.Hellow2}>Events</Text>
        </View>
        <TouchableOpacity onPress={reportBtn} style={styles.LeftCC}>
          <Text
            style={{
              ...styles.Hellow2,
              fontSize: h('2.2%'),
              fontWeight: 'normal',
              textAlign: 'center',
            }}>
            Report
          </Text>
        </TouchableOpacity>
      </View>

      {/* top CC */}
      <View style={styles.ImgCCW}>
        <ScrollView style={{paddingBottom: h('5%')}}>
          <Image
            source={{
              uri: item.imageurl
                ? item.imageurl
                : 'https://media.architecturaldigest.com/photos/62e806780b9af88d52c4d409/16:9/w_2560%2Cc_limit/AD010119_shamshiri_04.jpg',
            }}
            style={styles.mainCC}
          />

          <Text style={styles.Pptext}>{item.Name}</Text>
          <Text
            style={{
              ...styles.EventBAout,
              marginVertical: 10,
              fontSize: h('2.3%'),
              fontWeight: '700',
            }}>
            Currently Joined {joinedPersons?.length}
          </Text>
          {/* date */}
          <View style={styles.DDContainer}>
            <View style={styles.LeftCC3}>
              <View style={styles.Cicle3}>
                <Icon name={'calendar'} size={25} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.LeftCC4}>
              <Text style={styles.Contt}>Date</Text>
              <Text style={styles.Contt2}>{item.Date}</Text>
            </View>
          </View>
          {/* date */}
          {/* date */}
          <TouchableOpacity
            onPress={() => setlocationModalMap(true)}
            style={styles.DDContainer}>
            <View style={styles.LeftCC3}>
              <View style={styles.Cicle3}>
                <Icon name={'location'} size={25} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.LeftCC4}>
              <Text style={styles.Contt}>Location</Text>
              <Text style={styles.Contt2}>{item.Location}</Text>
            </View>
          </TouchableOpacity>
          {/* date */}

          {/* TopCOntainer */}
          <View style={styles.topCont2}>
            <View style={styles.LeftCC}>
              <View style={styles.Cicle}>
                <Image
                  style={styles.ImgBg}
                  source={{
                    uri: item.Profile_Image
                      ? item.Profile_Image
                      : 'https://t3.ftcdn.net/jpg/02/00/90/24/360_F_200902415_G4eZ9Ok3Ypd4SZZKjc8nqJyFVp1eOD6V.jpg',
                  }}
                />
              </View>
            </View>
            <View style={styles.LeftCC5}>
              <Text style={styles.Hellow3}>{item.Author}</Text>
              <Text style={styles.Hellow}>Author</Text>
            </View>
            <View style={styles.LeftCC}></View>
          </View>
          {/* TopCOntainer */}

          <Text style={styles.EventBAout}>About Event</Text>
          <Text style={styles.EventBAout2}>{item.Description}</Text>
          <View style={{marginTop: 20}} />
          <Appbutton
            txt={checkjoined ? 'Joined' : 'Join'}
            onPress={checkjoined ? DeleteLike : UploadPost}
          />
          <View style={{marginTop: h('2%')}} />
        </ScrollView>
      </View>
      <Modal animationType="slide" visible={locationModalMap}>
        <View style={{width: '100%', height: '100%'}}>
          <View style={{backgroundColor: Colors.Primary}}>
            <View style={styles.topCont}>
              <View style={styles.LeftCC}>
                <TouchableOpacity
                  onPress={() => {
                    setlocationModalMap(false);
                  }}
                  style={styles.Cicle2}>
                  <Icon name={'close'} size={25} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.LeftCC2}>
                <Text style={styles.Hellow2}>Event Location</Text>
              </View>
            </View>
          </View>

          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              flex: 1,
              marginTop: 30,
            }}></View>
        </View>
      </Modal>
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
    </View>
  );
};

export default EventDetails;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: Colors.Primary,
  },
  mainCC: {
    width: '95%',
    height: h('32%'),
    alignSelf: 'center',
    resizeMode: 'contain',
    borderRadius: h('2%'),
  },
  ImgCC: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0007',
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
    // alignItems: 'center',
  },
  LeftCC3: {
    // backgroundColor: 'green',
    width: '15%',
    height: '100%',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  LeftCC5: {
    // backgroundColor: 'green',
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  LeftCC4: {
    // backgroundColor: 'green',
    width: '65%',
    height: '100%',
    justifyContent: 'center',
    // alignItems: 'center',
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
    backgroundColor: '#4B4C4A',
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Cicle3: {
    backgroundColor: '#3776D6',
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Hellow2: {
    color: '#fff',
    fontSize: h('2.5%'),
    fontWeight: 'bold',
  },
  Hellow3: {
    color: '#000',
    fontSize: h('2.5%'),
    fontWeight: 'bold',
  },
  ImgCCW: {
    width: '100%',
    height: '90%',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // paddingLeft: 10,
    // paddingRight: 10,
    paddingTop: 10,
  },
  Pptext: {
    color: '#000',
    fontSize: h('2.8%'),
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 10,
  },
  DDContainer: {
    // backgroundColor: '#242',
    width: '95%',
    height: h('8%'),
    alignSelf: 'center',
    marginTop: 5,
    flexDirection: 'row',
  },
  Contt: {
    color: '#000',
    fontSize: h('2.5%'),
    fontWeight: 'bold',
  },
  Contt2: {
    color: '#0009',
    fontSize: h('2%'),
    fontWeight: '700',
  },
  topCont2: {
    // backgroundColor: 'red',
    width: '95%',
    height: h('12%'),
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
  },
  ImgBg: {
    width: '90%',
    height: '90%',
    resizeMode: 'cover',
    borderRadius: 100 / 2,
  },
  EventBAout: {
    color: '#000',
    marginLeft: 15,
    fontSize: h('2.5%'),
    fontWeight: 'bold',
  },
  EventBAout2: {
    color: '#0009',
    marginLeft: 15,
    fontSize: h('1.7%'),
  },
});
