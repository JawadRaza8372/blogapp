import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';

const AppPassword = ({
  placeholderText,
  iconName,
  secureTextEntry,
  onPress,
  onchange,
}) => {
  return (
    <View style={styles.MainContianer}>
      <View style={styles.iconC}>
        <Icon name={iconName} size={25} color="#FFFFFF" />
      </View>
      <TextInput
        style={styles.inputC}
        placeholderTextColor={'#fff'}
        placeholder={placeholderText}
        secureTextEntry={secureTextEntry}
        onChangeText={onchange}
      />
      <TouchableOpacity onPress={onPress} style={styles.iconC}>
        {secureTextEntry ? (
          <Icon name={'eye'} size={25} color="#FFFFFF" />
        ) : (
          <Icon name={'eye-off'} size={25} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AppPassword;
const styles = StyleSheet.create({
  MainContianer: {
    width: '95%',
    height: h('8%'),
    backgroundColor: '#fff1',
    alignSelf: 'center',
    borderRadius: h('1%'),
    flexDirection: 'row',
    overflow: 'hidden',
    marginTop: 10,
  },
  inputC: {
    width: '70%',
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
