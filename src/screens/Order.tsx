import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { makeGetRequest } from '../dataManegment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { handleError } from '../utils';
const { width } = Dimensions.get('screen');

type goodType = {
  strNumber: number;
  name: string;
  price: number;
  amount: number;
  sum: number;
};

type paymentsType = {
  strNumber: number;
  type: string;
  comment: string;
  sum: number;
};

type infoType = {
  client: string;
  date: string;
  discount: number;
  employee: string;
  goods: goodType[];
  payments: paymentsType[];
  number: string;
  service: number;
  table: string;
  address: string;
  type: string;
  payment: number;
  comment: string;
  sum: number;
  longDistanceDelivery: string | boolean;
  phone: string;
};

export default function Order({ route, navigation }: any) {
  const { id } = route.params;
  const [info, setInfo] = useState<Partial<infoType>>({});

  useEffect(() => {
    makeGetRequest('inforder/' + id)
      .then((res) => setInfo(res))
      .catch(handleError);
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
          <Text style={{ color: '#fff', fontSize: 20 }}>Детали счета</Text>
          <View></View>
        </View>

        <View style={styles.textRow}>
          <Text style={styles.block_text}>Дата</Text>
          <Text style={styles.block_text}>{info.date || 'Не указан'}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.block_text}>Счёт No</Text>
          <Text style={styles.block_text}>{info.number || 'Не указан'}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.block_text}>Официант</Text>
          <Text style={styles.block_text}>{info.employee || 'Не указан'}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.block_text}>Стол No</Text>
          <Text style={styles.block_text}>{info.table || 'Не указан'}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.block_text}>Клиент</Text>
          <Text style={styles.block_text}>{info.client || 'Не указан'}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.block_text}>Адресс</Text>
          <Text
            style={{ ...styles.block_text, width: '50%', textAlign: 'right' }}>
            {info.address || 'Не указан'}
          </Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.block_text}>Скидка 0%</Text>
          <Text style={styles.block_text}>{info.discount || '0'}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.block_text}>Обслуживание 0%</Text>
          <Text style={styles.block_text}>{info.service || '0'}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.block_text}>Тип чека</Text>
          <Text style={styles.block_text}>{info.type || '0'}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.block_text}>Тип оплаты</Text>
          <Text style={styles.block_text}>{info.payment || '0'}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.block_text}>Cумма</Text>
          <Text style={styles.block_text}>{info.sum || '0'}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.block_text}>Комментарий</Text>
          <Text
            style={{ ...styles.block_text, width: '50%', textAlign: 'right' }}>
            {info.comment || 'Не указан'}
          </Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.block_text}>Дальная доставка</Text>
          <Text style={styles.block_text}>
            {info.longDistanceDelivery ? (
              <Icon name="plus" size={20} />
            ) : (
              <Icon name="minus" size={20} />
            )}
          </Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.block_text}>Телефон клиента</Text>
          <Text style={styles.block_text}>{info.phone || 'Не указан'}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        pagingEnabled={true}
        horizontal
        showsHorizontalScrollIndicator={false}>
        <View style={{ width }}>
          {info?.goods?.map((el, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                padding: 10,
              }}>
              <Text style={{ width: '10%' }}>{el.strNumber}</Text>
              <View style={{ flex: 1 }}>
                <View style={styles.textRow}>
                  <Text>{el.name}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text>Сумма</Text>
                  <Text>
                    {el.price} x {el.amount} = {el.sum}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{ width }}>
          {info.payments
            ? info.payments.map((el, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    padding: 10,
                  }}>
                  <Text style={{ width: '10%' }}>{el.strNumber}</Text>
                  <View style={{ flex: 1 }}>
                    <View style={styles.textRow}>
                      <Text>{el.type}</Text>
                    </View>
                    <View style={styles.textRow}>
                      <Text>Коментарий</Text>
                      <Text>{el.comment.trim() || 'Не указан'}</Text>
                    </View>
                    <View style={styles.textRow}>
                      <Text>Сумма</Text>
                      <Text>{el.sum}</Text>
                    </View>
                  </View>
                </View>
              ))
            : null}
        </View>
      </ScrollView>
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
