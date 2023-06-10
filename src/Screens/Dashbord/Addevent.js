import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import React, {useState} from 'react';
import Colors from '../../Utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import AppInput2 from '../../Components/AppInput2';
import AppItem from '../../Components/AppItem';
import Appbutton from '../../Components/Appbutton';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
const Addevent = ({navigation}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileName, setfileName] = useState(null);
  const [Loader, setLoader] = useState(false);
  const [locationModel, setlocationModel] = useState(false);

  const [Name, SetName] = useState('');
  const [Location, SetLocation] = useState('');
  const [eventCoordinates, setEventCoordinates] = useState({lat: 0, lng: 0});
  const [Date, SetDate] = useState('');
  const [Description, SetDescription] = useState('');
  const email = useSelector(state => state.counter.email);
  const username = useSelector(state => state.counter.username);
  const IMageUrl = useSelector(state => state.counter.IMageUrl);

  const UploadPost = async val => {
    await firestore()
      .collection('events')
      .add({
        Name: Name,
        Location: Location,
        imageurl: val,
        Date: Date,
        Description: Description,
        email: email,
        Author: username,
        Profile_Image: IMageUrl,
        coordinates: eventCoordinates,
        joined: [],
      })
      .then(() => {
        Alert.alert('Sccuess!', 'Event Are Uploaded');
        setLoader(false);
        navigation.pop();
      })
      .catch(error => {
        console.log('Error adding document:', error);
        Alert.alert('Error', 'Data not saved');
        setLoader(false);

        // setloader(false);
      });
  };
  const uploadImage = async () => {
    try {
      if (Name?.length <= 0) {
        Alert.alert('Error', 'Name is required');
        return;
      }
      if (Location <= 0) {
        Alert.alert('Error', 'Location is required');
        return;
      }
      if (Description <= 0) {
        Alert.alert('Error', 'Description is required');
        return;
      }
      if (Date <= 0) {
        Alert.alert('Error', 'Date is required');
        return;
      }
      if (selectedImage <= 0) {
        Alert.alert('Error', 'Image is required');
        return;
      }
      setLoader(true);
      const reference = await storage()
        .ref(`images/${fileName}`)
        .putFile(selectedImage);
      const downloadURL = await storage()
        .ref(`images/${fileName}`)
        .getDownloadURL();
      UploadPost(downloadURL);
    } catch (error) {
      console.log('Error uploading image:', error);
      setLoader(false);
    }
  };

  const selectImageFromGallery = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error:', response.error);
      } else {
        console.log(response.assets[0].fileName);
        setSelectedImage(response.assets[0].uri);
        setfileName(response.assets[0].fileName);
      }
    });
  };
  const Request = () => {
    if (
      Name.trim() === '' ||
      Location.trim() === '' ||
      Date.trim() === '' ||
      Description.trim() === ''
    ) {
      Alert.alert('Error', 'Please Fill all Field');
      return;
    }
    uploadImage();
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
            <Text style={styles.Hellow2}>Create New Event</Text>
          </View>
        </View>
        {/* TopCOntainer */}
      </View>

      <ScrollView>
        <View style={{flex: 1}}>
          <View style={{height: 30}} />
          <View
            style={{
              width: '90%',
              height: 200,
              backgroundColor: '#0001',
              alignSelf: 'center',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                width: '100%',
                height: 200,
                backgroundColor: '#0001',
                alignSelf: 'center',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={selectImageFromGallery}>
              <Image
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: selectedImage != null ? 'cover' : 'contain',
                  borderRadius: 12,
                }}
                source={
                  selectedImage
                    ? {uri: selectedImage}
                    : require('../../../assets/add-image.png')
                }
              />
            </TouchableOpacity>
          </View>
          <AppInput2
            text={'Name'}
            placeholder={'Enter Name'}
            onchange={val => SetName(val)}
          />

          <View style={styles.mainContainer}>
            <Text style={{...styles.InputFiledG, marginBottom: h('2%')}}>
              Location
            </Text>
            <TouchableOpacity
              style={{
                width: '100%',
                height: h('7%'),
                backgroundColor: '#0001',
                borderRadius: 7,
                paddingLeft: 5,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
              onPress={() => setlocationModel(true)}>
              <Text style={{color: Location ? '#000' : '#a9a9a9'}}>
                {Location
                  ? Location?.length > 50
                    ? `${Location}`.substring(0, 49) + ' ...'
                    : Location
                  : 'Your Event Location'}
              </Text>
            </TouchableOpacity>
          </View>

          <AppInput2
            text={'Date'}
            placeholder={'Enter Date'}
            onchange={val => SetDate(val)}
          />
          <AppInput2
            text={'Description'}
            placeholder={'Enter Description'}
            onchange={val => SetDescription(val)}
          />
          <Appbutton txt={'Create Event'} onPress={Request} />
          <View style={{marginBottom: 22}} />
        </View>
      </ScrollView>
      <Modal animationType="slide" visible={locationModel}>
        <View style={{width: '100%', height: '100%'}}>
          <View style={{backgroundColor: Colors.Primary}}>
            <View style={styles.topCont}>
              <View style={styles.LeftCC}>
                <TouchableOpacity
                  onPress={() => {
                    setlocationModel(false);
                  }}
                  style={styles.Cicle2}>
                  <Icon name={'close'} size={25} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.LeftCC2}>
                <Text style={styles.Hellow2}>Select Location</Text>
              </View>
            </View>
          </View>

          <View
            style={{width: '95%', alignSelf: 'center', flex: 1, marginTop: 30}}>
            <GooglePlacesAutocomplete
              styles={{
                textInput: {
                  backgroundColor: '#0001',
                },
              }}
              GooglePlacesDetailsQuery={{fields: 'geometry'}}
              fetchDetails={true}
              placeholder="Enter Location"
              onPress={(data, details) => {
                SetLocation(data?.description);
                setEventCoordinates(details?.geometry?.location);
                setlocationModel(false);
              }}
              onFail={error => console.error(error)}
              query={{
                key: 'AIzaSyD0Pd70F1RYfHsMWojsqozPRqq8q-_yswo',
                language: 'en',
              }}
            />
          </View>
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

export default Addevent;

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
  mainContainer: {
    width: '90%',
    // backgroundColor: 'red',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
  },
  InputFiledG: {
    color: '#000',
    fontSize: h('2%'),
  },
  Hellow2: {
    color: '#fff',
    fontSize: h('2.5%'),
    fontWeight: 'bold',
  },
  inputC: {
    width: '100%',
    height: h('7%'),
    backgroundColor: '#0001',
    borderRadius: 7,
    paddingLeft: 5,
  },
});
