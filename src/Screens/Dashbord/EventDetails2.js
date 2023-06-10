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
} from 'react-native';
import React from 'react';
import Colors from '../../Utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Appbutton from '../../Components/Appbutton';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useState} from 'react';
import firestore from '@react-native-firebase/firestore';

const EventDetails2 = ({route}) => {
  let navigation = useNavigation();
  const {item} = route.params;
  // l;
  const email = useSelector(state => state.counter.email);
  console.log(item.id);
  const [Loader, setLoader] = useState(false);
  const UploadPost = val => {
    setLoader(true);
    firestore()
      .collection('Joined_Event')
      .doc(item.id)
      .delete()
      .then(() => {
        Alert.alert('Success!', 'Document deleted successfully');
        setLoader(false);
        navigation.pop();

        // Additional code after deletion
      })
      .catch(error => {
        console.log('Error deleting document:', error);
        Alert.alert('Error', 'Failed to delete document');
        setLoader(false);

        // Additional error handling
      });
  };
  return (
    <View style={styles.MainContainer}>
      {/* top CC */}
      <ImageBackground
        source={{
          uri: item.imageurl
            ? item.imageurl
            : 'https://media.architecturaldigest.com/photos/62e806780b9af88d52c4d409/16:9/w_2560%2Cc_limit/AD010119_shamshiri_04.jpg',
        }}
        style={styles.mainCC}>
        <View style={styles.ImgCC}>
          {/* TopCOntainer */}
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
            <View style={styles.LeftCC}></View>
          </View>
          {/* TopCOntainer */}
        </View>
      </ImageBackground>
      {/* top CC */}
      <View style={styles.ImgCCW}>
        <Text style={styles.Pptext}>International Band Music Concert</Text>
        {/* date */}
        <View style={styles.DDContainer}>
          <View style={styles.LeftCC3}>
            <View style={styles.Cicle3}>
              <Icon name={'calendar'} size={25} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.LeftCC4}>
            <Text style={styles.Contt}>{item.Date}</Text>
            <Text style={styles.Contt2}>Tuesday, 4:00 Pm - 9:00 Pm</Text>
          </View>
        </View>
        {/* date */}
        {/* date */}
        <View style={styles.DDContainer}>
          <View style={styles.LeftCC3}>
            <View style={styles.Cicle3}>
              <Icon name={'location'} size={25} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.LeftCC4}>
            <Text style={styles.Contt}>{item.Location}</Text>
            <Text style={styles.Contt2}>36 Guild Street, London</Text>
          </View>
        </View>
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
          <View style={styles.LeftCC}>
            {/* <View style={styles.Cicle2}>
                <Icon name={'notifications'} size={25} color="#FFFFFF" />
              </View> */}
          </View>
        </View>
        {/* TopCOntainer */}
        <Text style={styles.EventBAout}>About Event</Text>
        <Text style={styles.EventBAout2}>{item.Description}</Text>
        <View style={{marginTop: 20}} />
        <Appbutton txt={'Remove'} onPress={UploadPost} />
      </View>
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

export default EventDetails2;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: 'red',
  },
  mainCC: {
    width: '100%',
    height: h('40%'),
    // backgroundColor: 'red',
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
    height: '80%',
    backgroundColor: '#fff',
    position: 'absolute',
    top: '35%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // paddingLeft: 10,
    // paddingRight: 10,
    paddingTop: 10,
  },
  Pptext: {
    color: '#000',
    fontSize: h('2.5%'),
    fontWeight: 'bold',
    alignSelf: 'center',
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
    color: '#0005',
    fontSize: h('2%'),
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
