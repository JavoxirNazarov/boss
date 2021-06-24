import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {clearPressed} from '../../redux/slices/pressed-slice';

export default function GoBack({clear = true}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      style={styles.back}
      onPress={() => {
        navigation.goBack();
        if (clear) dispatch(clearPressed());
      }}>
      <Icon name="chevron-left" size={40} color="#00B686" />
      <Text style={styles.back_text}>Назад</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  back_text: {
    fontSize: 12,
    marginLeft: 8,
  },
});
