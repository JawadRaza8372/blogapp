import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Pressable,
  FlatList,
  Alert,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';

const AppMyEvents = ({item, onPress, data, loadingFun, setnewdata}) => {
  const [commentsLength, setcommentsLength] = useState(
    item.comments?.length > 0 ? item.comments : [],
  );
  const deleteItemFunc = async () => {
    loadingFun(true);
    await firestore()
      .collection('events')
      .doc(item.id)
      .delete()
      .then(() => {
        const newData = data?.filter(dat => dat.id !== item.id);
        setnewdata(newData);
      })
      .finally(() => {
        Alert.alert('Event', 'Event deleted successfully');
      });

    loadingFun(false);
  };
  return (
    <>
      <View style={styles.boxshadowdiv}>
        <TouchableOpacity onPress={onPress} style={styles.AppEventContainer}>
          <View style={styles.leftCc}>
            <Image
              style={styles.img}
              source={{
                uri: item.imageurl,
              }}
            />
          </View>
          <View style={styles.SideText}>
            <Text style={styles.Cc}>{item.Date}</Text>
            <Text style={styles.Cc2}>{item.Name}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.CommnetSection}>
          <TouchableOpacity
            onPress={deleteItemFunc}
            style={styles.IconContainer}>
            <View style={styles.IconCC}>
              <Icon name={'trash'} size={25} color="red" />
            </View>
            <Text style={{...styles.TextCC, color: 'red'}}>Delete</Text>
          </TouchableOpacity>
          <View style={styles.IconContainer1}>
            <Text style={styles.TextCC}>
              {commentsLength?.length > 0 ? commentsLength.length : 0} Commnets
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default AppMyEvents;

const styles = StyleSheet.create({
  boxshadowdiv: {
    height: h('25%'),
    shadowColor: '#000',
    paddingTop: h('0.7%'),
    paddingBottom: h('0.7%'),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 10,
    marginTop: 10,
    elevation: 5,
    backgroundColor: '#ffffff',
  },
  AppEventContainer: {
    width: '95%',
    height: h('18%'),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  leftCc: {
    width: '30%',
    height: '100%',
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: '90%',
    height: '90%',
    borderRadius: 10,
  },
  SideText: {
    width: '65%',
    height: '100%',
    // backgroundColor: 'red',
    paddingTop: 20,
  },
  Cc: {
    color: '#3779D7',
    fontSize: h('2%'),
    fontWeight: 'bold',
  },
  Cc2: {
    color: '#000',
    fontSize: h('2.2%'),
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topHeaderModel: {
    // backgroundColor: 'red',
    width: '100%',
    height: '10%',
    justifyContent: 'space-between',
    borderBottomColor: '#0003',
    paddingLeft: 10,
    borderBottomWidth: h('0.3%'),
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  modalComment: {
    color: '#0007',
    fontSize: 20,
  },
  CommnetSection: {
    width: '95%',
    height: h('4%'),
    alignSelf: 'center',
    flexDirection: 'row',
  },
  IconContainer: {
    // backgroundColor: 'gold',
    width: '50%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  IconContainer1: {
    width: '50%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  IconCC: {
    // backgroundColor: 'orange',
    height: '100%',
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  IconCC1: {
    // backgroundColor: 'orange',
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextCC: {
    color: '#1E1E1E',
    fontSize: h('2%'),
  },
  modalContainerBottom: {
    width: '100%',
    height: '80%',
    paddingLeft: 10,
    paddingRight: 10,
  },
  font: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
