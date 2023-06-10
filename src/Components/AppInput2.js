import {StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';

const AppInput2 = ({value, placeholder, text, description, onchange}) => {
  return (
    <View style={description ? styles.mainContainer2 : styles.mainContainer}>
      <Text style={styles.InputFiledG}>{text}</Text>
      {description ? (
        <TextInput
          value={value}
          style={styles.inputC2}
          placeholderTextColor={'#0003'}
          placeholder={placeholder}
          onChangeText={onchange}
        />
      ) : (
        <TextInput
          editable={value != null ? false : true}
          value={value}
          style={styles.inputC}
          placeholderTextColor={'#0003'}
          placeholder={placeholder}
          onChangeText={onchange}
        />
      )}
    </View>
  );
};

export default AppInput2;

const styles = StyleSheet.create({
  mainContainer: {
    width: '90%',
    height: h('15%'),
    // backgroundColor: 'red',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
  },
  mainContainer2: {
    width: '90%',
    height: h('25%'),
    // backgroundColor: 'red',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
  },
  InputFiledG: {
    color: '#000',
    fontSize: h('2%'),
  },
  inputC: {
    width: '100%',
    height: h('7%'),
    backgroundColor: '#0001',
    borderRadius: 7,
    paddingLeft: 5,
  },
  inputC2: {
    width: '100%',
    height: h('17%'),
    backgroundColor: '#0001',
    borderRadius: 7,
    paddingLeft: 5,
  },
});
