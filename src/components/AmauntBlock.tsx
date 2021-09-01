import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { addSpace } from '../utils';

interface IProps {
  onPress: () => void;
  withFlag?: boolean;
  collorActive?: boolean;
  titleText: string;
  summ?: number | string | undefined;
  amount?: number | string | undefined;
}

export default function AmauntBlock({
  onPress,
  withFlag = false,
  collorActive,
  titleText,
  summ,
  amount,
}: IProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.block,
        withFlag && {
          backgroundColor: collorActive ? '#20ba27' : '#e31b3d',
        },
      ]}>
      <View style={{ justifyContent: 'space-evenly', height: '100%' }}>
        <Text style={styles.block_title}>{titleText}</Text>
        {summ !== undefined && (
          <Text style={styles.block_sum}>{addSpace(summ)} сум</Text>
        )}
      </View>
      {amount !== undefined && (
        <View style={styles.block_circle}>
          <Text style={styles.block_circle_num}>{amount || 0}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  block: {
    width: '100%',
    height: 78,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  block_circle: {
    minWidth: 50,
    minHeight: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9457EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  block_circle_num: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '500',
  },
  block_title: {
    fontWeight: '500',
    fontSize: 16,
    color: '#495057',
  },
  block_sum: {
    color: '#29402a',
    fontWeight: '500',
    fontSize: 16,
  },
});
