import {StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AppInput({
  placeholderText,
  iconName,
  value,
  onPress,
  backgroundColor,
  onChange,
  editable,
}) {
  return (
    <View
      style={[
        styles.MainContianer,
        {backgroundColor: backgroundColor ? backgroundColor : '#fff1'},
      ]}>
      <View style={styles.iconC}>
        <Icon name={iconName} size={25} color="#FFFFFF" />
      </View>
      <TextInput
        editable={editable ? false : true}
        value={value}
        style={styles.inputC}
        placeholderTextColor={'#fff'}
        placeholder={placeholderText}
        onChangeText={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  MainContianer: {
    width: '95%',
    height: h('8%'),
    // backgroundColor: 'red',
    alignSelf: 'center',
    borderRadius: h('1%'),
    flexDirection: 'row',
    overflow: 'hidden',
    marginTop: 10,
  },
  inputC: {
    width: '85%',
    height: '100%',
    color: '#fff',
    fontSize: h('2%'),
    // backgroundColor: 'red',
  },
  iconC: {
    // backgroundColor: 'green',
    width: '15%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
