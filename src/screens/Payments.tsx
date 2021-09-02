import React, { useCallback, useEffect, useState } from 'react';
import TerminalIcon from '../assets/Terminal';
import PaymentIcon from '../assets/Payment';
import Click from '../assets/Click';
import Payme from '../assets/Payme';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import GoBack from '../components/Tables/GoBack';
import { makeGetRequest } from '../dataManegment';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/slices';
import { formatDate } from '../utils/date';
import { addSpace, wait } from '../utils';

type paymentType = {
  Name: string;
  UIDStructure: string;
  array: {
    UIDPayment: string;
    amount: number;
    payment: string;
    sum: number;
  }[];
};

function placeIcon(type: string) {
  switch (type) {
    case 'Click':
      return <Click />;
    case 'Оплата терминалом':
      return <TerminalIcon />;
    case 'Оплата наличными':
      return <PaymentIcon />;
    default:
      return <Payme />;
  }
}

export default function Payments({ navigation }: any) {
  const { selectedDate, prevDate } = useSelector(
    (state: RootState) => state.dateState,
  );
  const [payments, setPayments] = useState<paymentType[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  function refresh() {
    makeGetRequest(
      `getpayments/${formatDate(prevDate)}/${formatDate(selectedDate)}`,
    )
      .then((res) => setPayments(res))
      .catch(() => {});
  }

  useEffect(refresh, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.wraper}>
      <GoBack />

      {payments.length ? (
        <>
          {payments.map((el, i) => (
            <View key={i} style={{ alignItems: 'center', marginVertical: 15 }}>
              <Text style={{ marginVertical: 5, fontSize: 16 }}>{el.Name}</Text>
              <View style={styles.row}>
                {el.array.map((payment, j) => (
                  <TouchableHighlight
                    onPress={() =>
                      navigation.navigate('Orders', {
                        uid: el.UIDStructure,
                        type: payment.payment,
                        UIDPayment: payment.UIDPayment,
                      })
                    }
                    key={j}
                    style={styles.block}>
                    <>
                      <View style={styles.row}>
                        {placeIcon(payment.payment)}
                        <View style={styles.block_circle}>
                          <Text style={styles.block_circle_num}>
                            {payment.amount}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.block_text}>
                        {addSpace(payment.sum)} сум
                      </Text>
                    </>
                  </TouchableHighlight>
                ))}
              </View>
            </View>
          ))}
        </>
      ) : (
        <ActivityIndicator color="blue" style={{ marginTop: 50 }} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wraper: {
    flex: 1,
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  block: {
    marginTop: 10,
    borderRadius: 4,
    height: 113,
    width: '48%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-evenly',
    paddingHorizontal: 15,
  },
  block_text: {
    color: '#00B686',
    fontSize: 16,
    fontWeight: '500',
  },
  block_circle: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.12,
    shadowRadius: 2.22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  block_circle_num: {
    color: '#E80054',
    fontSize: 22,
    fontWeight: '500',
  },
});
