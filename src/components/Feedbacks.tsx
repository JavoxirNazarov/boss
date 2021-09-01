import React from 'react';
import { ActivityIndicator, Text } from 'react-native';

export function Loader() {
  return <ActivityIndicator color="blue" style={{ marginVertical: 35 }} />;
}

export function ErrorText() {
  return (
    <Text style={{ marginVertical: 40, fontSize: 20, color: '#db275d' }}>
      Ошибка!!
    </Text>
  );
}
