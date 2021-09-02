import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { makeGetRequest } from '../dataManegment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { handleError } from '../utils';

type goodType = {
  Product: string;
  Amount: boolean;
  AmountAccepted: boolean;
  Comment: string;
};

type infoType = {
  sender: string;
  id: boolean;
  comment: string;
  accepted: boolean;
  bossAccepted: boolean;
  Date: string;
  Number: string;
  Goods: goodType[];
};

export default function WriteOff({ route, navigation }: any) {
  const { id } = route.params;
  const [info, setInfo] = useState<Partial<infoType>>({});

  useEffect(() => {
    makeGetRequest('writeoffs/1/1?UIDWriteOff=' + id)
      .then((res) => setInfo(res))
      .catch(() => {});
  }, [id]);

  return (
    <ScrollView style={{ width: '100%' }}>
      <LinearGradient colors={['#CD4629', '#FF5733']} style={styles.block}>
        <View style={styles.header}>
          <Icon
            onPress={() => navigation.goBack()}
            name="arrow-left"
            size={30}
            color="#fff"
          />
          <Text style={{ color: '#fff', fontSize: 20 }}>Списание</Text>
          <View />
        </View>

        <View style={styles.textRow}>
          <Text style={styles.block_text}>Дата</Text>
          <Text style={styles.block_text}>{info.Date || 'Не указан'}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.block_text}>Счёт No</Text>
          <Text style={styles.block_text}>{info.Number || 'Не указан'}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.block_text}>Официант</Text>
          <Text style={styles.block_text}>{info.sender || 'Не указан'}</Text>
        </View>

        <View style={styles.textRow}>
          <Text style={styles.block_text}>Комментарий</Text>
          <Text
            style={{ ...styles.block_text, width: '50%', textAlign: 'right' }}>
            {info.comment || 'Не указан'}
          </Text>
        </View>
      </LinearGradient>

      {info?.Goods?.map((el, i) => (
        <View
          key={i}
          style={{
            flexDirection: 'row',
            borderBottomWidth: 1,
            padding: 10,
            justifyContent: 'space-between',
          }}>
          <Text>{el.Product}</Text>
          <Text>{el.Amount} шт</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  block: {
    width: '100%',
    padding: 20,
  },
  block_text: {
    color: '#fff',
    fontSize: 15,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
