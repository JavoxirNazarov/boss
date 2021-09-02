import React from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

export function Loader() {
  return <ActivityIndicator color="blue" style={styles.loader} />;
}

export function ErrorText() {
  return <Text style={styles.error}>Ошибка!!</Text>;
}

const styles = StyleSheet.create({
  loader: {
    marginVertical: 35,
  },
  error: {
    marginVertical: 40,
    fontSize: 20,
    color: '#db275d',
    textAlign: 'center',
  },
});
