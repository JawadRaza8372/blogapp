import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  ActivityIndicator,
  Pressable,
  FlatList,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../Utils/Colors';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const AppMyItem = ({item, onPress, data, loadingFun, setnewdata}) => {
  let navigation = useNavigation();
  const [likesLength, setlikesLength] = useState(
    item.likes?.length > 0 ? item.likes : [],
  );
  const [commentsLength, setcommentsLength] = useState(
    item.comments?.length > 0 ? item.comments : [],
  );
  const deleteItemFun = async () => {
    loadingFun(true);
    await firestore()
      .collection('blogs')
      .doc(item.id)
      .delete()
      .then(() => {
        const newData = data?.filter(dat => dat.id !== item.id);
        setnewdata(newData);
      })
      .finally(() => {
        Alert.alert('Post', 'Post deleted successfully');
      });
    loadingFun(false);
  };
  return (
    <TouchableOpacity onPress={onPress} style={styles.MainContainer}>
      <View style={styles.ImgBg}>
        <ImageBackground
          source={{
            uri: item.imageurl,
          }}
          style={styles.ImgBg2}>
          <View style={styles.imgColor}></View>
        </ImageBackground>
      </View>
      <Text style={styles.Heading}>{item.title}</Text>
      {/* comment /like section */}
      <View style={styles.CommnetSection}>
        <TouchableOpacity style={styles.IconContainer1} onPress={deleteItemFun}>
          <View style={styles.IconCC1}>
            <Icon name={'trash'} size={25} color={'red'} />
          </View>

          <Text style={{...styles.TextCC, color: 'red'}}>Delete</Text>
        </TouchableOpacity>

        <View style={styles.IconContainerSimp}>
          <Text style={styles.TextCC}>
            {likesLength?.length > 0 ? likesLength.length : 0} Likes
          </Text>
        </View>

        <View style={styles.IconContainerSimp}>
          <Text style={styles.TextCC}>
            {commentsLength?.length > 0 ? commentsLength.length : 0} Commnets
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AppMyItem;

const styles = StyleSheet.create({
  MainContainer: {
    width: '100%',
    height: h('35%'),
    marginTop: 1,

    // backgroundColor: 'red',
  },
  ImgBg: {
    width: '90%',
    height: '70%',
    // backgroundColor: 'green',
    alignSelf: 'center',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  ImgBg2: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'green',
    alignSelf: 'center',
    borderRadius: 10,
    resizeMode: 'cover',
    overflow: 'hidden',
  },
  Heading: {
    color: '#000',
    fontSize: h('2.2%'),
    marginLeft: 19,
    // fontWeight: 'bold',
  },
  imgColor: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0008',
  },
  CommnetSection: {
    width: '92%',
    height: '20%',
    // backgroundColor: 'green',
    alignSelf: 'center',
    flexDirection: 'row',
    borderBottomColor: '#0003',
    borderBottomWidth: h('0.1%'),
  },
  IconContainer: {
    // backgroundColor: 'gold',
    width: '30%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  IconContainerSimp: {
    width: '24%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  IconContainer1: {
    width: '50%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  IconCC: {
    // backgroundColor: 'orange',
    width: '30%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  IconCC1: {
    // backgroundColor: 'orange',
    height: '100%',
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextCC: {
    color: '#1E1E1E',
    fontSize: h('2%'),
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
