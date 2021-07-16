import {useNavigation} from '@react-navigation/native';
import React, {Fragment, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import DeliveryIcon from '../assets/Car1';
import ClickIcon from '../assets/Click';
import PaymeIcon from '../assets/Payme';
import PaymentIcon from '../assets/Payment';
import TerminalIcon from '../assets/Terminal';
import {makeGetRequest} from '../dataManegment';
import {RootState} from '../redux/slices';
import {IStats} from '../types/fetch';
import {addSpace, handleError} from '../utils';
import {formatDate} from '../utils/date';
import useRole from '../utils/useRole';

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
      return <ClickIcon />;
    case 'Оплата терминалом':
      return <TerminalIcon />;
    case 'Оплата наличными':
      return <PaymentIcon />;
    default:
      return <PaymeIcon />;
  }
}

export default function DeliveryBlock({
  DeliverySum,
  DeliveryAmount,
  Percent2,
  Payme,
  PaymeAmount,
  Click,
  ClickAmount,
  Terminal,
  TerminalAmount,
  Cash,
  CashAmount,
}: Partial<IStats>) {
  const navigation = useNavigation();
  const {isManager} = useRole();
  const {user} = useSelector((state: RootState) => state.userState);
  const {selectedDate, prevDate} = useSelector(
    (state: RootState) => state.dateState,
  );
  const [payments, setPayments] = useState<paymentType[]>([]);

  useEffect(() => {
    makeGetRequest(
      `getpayments/${formatDate(prevDate)}/${formatDate(selectedDate)}`,
    )
      .then((res) => setPayments(res))
      .catch(handleError);
  }, [selectedDate, prevDate]);

  return (
    <>
      <Text style={styles.title}>Доставки</Text>
      <TouchableOpacity
        onPress={() => {
          if (isManager) {
            navigation.navigate('Orders', {
              uid: user?.structure,
              type: 'доставки',
            });
            return;
          }
          navigation.navigate('Deliveries');
        }}
        style={styles.main}>
        <View
          style={{
            justifyContent: 'space-around',
            height: '100%',
          }}>
          <Text style={{color: '#FFFFFF', fontWeight: 'bold', fontSize: 14}}>
            Количество доставок
          </Text>
          <Text style={{color: '#FFFFFF', fontWeight: 'bold', fontSize: 24}}>
            {DeliverySum || 0} сум
          </Text>
        </View>

        <Text
          style={{color: '#FFFFFF', fontWeight: 'bold', fontSize: 36, top: 5}}>
          {DeliveryAmount || 0}
        </Text>

        <DeliveryIcon style={{top: 5}} />

        <Text
          style={{
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: 18,
            position: 'absolute',
            top: 5,
            right: 5,
          }}>
          {Percent2 || 0}%
        </Text>
      </TouchableOpacity>

      {isManager ? (
        <>
          <View style={styles.row}>
            {payments.map((el, i) => (
              <Fragment key={i}>
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
              </Fragment>
            ))}
          </View>
        </>
      ) : (
        <>
          <View style={styles.row} />
          <View style={styles.row}>
            <TouchableHighlight
              onPress={() => {
                navigation.navigate('Payments');
              }}
              style={styles.block}>
              <>
                <View style={styles.row}>
                  <PaymentIcon />
                  <View style={styles.block_circle}>
                    <Text style={styles.block_circle_num}>
                      {CashAmount || 0}
                    </Text>
                  </View>
                </View>
                <Text style={styles.block_text}>{Cash || 0} сум</Text>
              </>
            </TouchableHighlight>

            <TouchableHighlight
              onPress={() => {
                navigation.navigate('Payments');
              }}
              style={styles.block}>
              <>
                <View style={styles.row}>
                  <TerminalIcon />
                  <View style={styles.block_circle}>
                    <Text style={styles.block_circle_num}>
                      {TerminalAmount || 0}
                    </Text>
                  </View>
                </View>
                <Text style={styles.block_text}>{Terminal || 0} сум</Text>
              </>
            </TouchableHighlight>

            <TouchableHighlight
              onPress={() => {
                navigation.navigate('Payments');
              }}
              style={styles.block}>
              <>
                <View style={styles.row}>
                  <ClickIcon />
                  <View style={styles.block_circle}>
                    <Text style={styles.block_circle_num}>
                      {ClickAmount || 0}
                    </Text>
                  </View>
                </View>
                <Text style={styles.block_text}>{Click || 0} сум</Text>
              </>
            </TouchableHighlight>

            <TouchableHighlight
              onPress={() => {
                navigation.navigate('Payments');
              }}
              style={styles.block}>
              <>
                <View style={styles.row}>
                  <PaymeIcon />
                  <View style={styles.block_circle}>
                    <Text style={styles.block_circle_num}>
                      {PaymeAmount || 0}
                    </Text>
                  </View>
                </View>
                <Text style={styles.block_text}>{Payme || 0} сум</Text>
              </>
            </TouchableHighlight>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginTop: 40,
  },
  main: {
    position: 'relative',
    width: '100%',
    height: 113,
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E80054',
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
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
