import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import React from 'react';
import Colors from '../../Utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Appbutton from '../../Components/Appbutton';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useState} from 'react';
const BlogDetails = ({route}) => {
  let navigation = useNavigation();
  // const {imageUrl} = route.params;
  const IMageUrl = useSelector(state => state.counter.IMageUrl);
  const email = useSelector(state => state.counter.email);
  const [Loader, setLoader] = useState(false);
  const {imageUrl, title, description, Author, item} = route.params;
  // console.log(imageUrl);
  const reportBtn = async () => {
    setLoader(true);
    await firestore()
      .collection('reports')
      .add({
        itemid: item.id,
        title: item.title,
        postedBy: item.Author,
        reportedBy: email,
        type: 'blogs',
      })
      .then(() => {
        setLoader(false);
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
          <Text style={styles.Hellow2}>Blog</Text>
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

      <View style={styles.ImgCCW}>
        <ScrollView style={{paddingBottom: h('3%')}}>
          <Image
            source={{
              uri: imageUrl,
            }}
            style={styles.mainCC}
          />

          <Text style={styles.Pptext}>{title}</Text>

          {/* date */}

          {/* TopCOntainer */}
          <View style={styles.topCont2}>
            <View style={styles.LeftCC}>
              <View style={styles.Cicle}>
                <Image
                  style={styles.ImgBg}
                  source={{
                    uri: IMageUrl
                      ? IMageUrl
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
          <Text style={styles.EventBAout}>Description</Text>
          <Text style={styles.EventBAout2}>{description}</Text>
          <View style={{marginTop: 20}} />
        </ScrollView>
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

export default BlogDetails;

const styles = StyleSheet.create({
  MainContainer: {
    width: '100%',
    height: h('100%'),
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
