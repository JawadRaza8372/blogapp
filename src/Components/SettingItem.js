import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';

const SettingItem = ({icon, text1, text2, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.SettingContainer}>
      <View style={styles.ImgContainer}>
        <Icon name={icon} size={25} color="#0008" />
      </View>
      <View>
        <Text style={styles.H1txt}>{text1}</Text>
        <Text style={styles.H1txt2}>{text2}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SettingItem;

const styles = StyleSheet.create({
  SettingContainer: {
    width: '90%',
    height: h('10%'),
    // backgroundColor: 'red',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#0003',
    borderBottomWidth: h('0.2%'),
  },
  ImgContainer: {
    // backgroundColor: 'green',
    width: '15%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  H1txt2: {
    color: '#0007',
    fontSize: h('2%'),
  },
  H1txt: {
    color: '#0007',
    fontSize: h('2.4%'),
    fontWeight: 'bold',
  },
});
