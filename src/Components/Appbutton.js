import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const Appbutton = ({txt, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#3A58CB', '#3684DB']}
        style={styles.AppButtonContainer}>
        <Text style={styles.buttonText}>{txt}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Appbutton;

const styles = StyleSheet.create({
  AppButtonContainer: {
    backgroundColor: 'red',
    width: '90%',
    height: h('8%'),
    alignSelf: 'center',
    borderRadius: h('1%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: h('2.3%'),
    fontWeight: 'bold',
  },
});
