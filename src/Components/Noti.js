import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Colors from '../Utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const Noti = ({val}) => {
  return (
    <View style={styles.MainContianer}>
      <View style={styles.BoxCC}>
        <Icon name={'notifications'} size={25} color="#FFFFFF" />
      </View>
      <Text style={styles.TextColor}>{val}</Text>
    </View>
  );
};

export default Noti;

const styles = StyleSheet.create({
  MainContianer: {
    width: '90%',
    height: h('7%'),
    // backgroundColor: 'red',
    alignSelf: 'center',
    marginTop: 10,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  BoxCC: {
    width: '15%',
    backgroundColor: Colors.Primary,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextColor: {
    color: '#000',
    fontSize: h('2%'),
    marginLeft: 10,
  },
});
