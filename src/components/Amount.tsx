import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/slices';
import { IStats } from '../types/fetch';
import { addSpace } from '../utils';
import useRole from '../utils/useRole';
import AmauntBlock from './AmauntBlock';

export default function Amounts({
  Summa,
  Amount,
  Percent1,
  Advance,
  AdvanceAmount,
  Without,
  WithoutAmount,
  Consumption,
  ConsumptionAmount,
  CashCollection,
  CashCollectionAmount,
  PartnersAmountGreen,
  PartnersAmountYellow,
  PartnersSumGreen,
  PartnersSumYellow,
  AdvertisingAmount,
  AdvertisingSum,
  AllAdvertisingAccepted,
  AllExpensesAccepted,
  AllWithoutPaymentAccepted,
  PenaltiesAmount,
  PenaltiesSum,
  PrizesAmount,
  PrizesSum,
  PitStopsAmount,
}: Partial<IStats>) {
  const navigation = useNavigation();
  const { isManager } = useRole();
  const { user } = useSelector((state: RootState) => state.userState);

  return (
    <>
      <View style={styles.main}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(
              'Sections',
              isManager
                ? { uid: user?.structure, structureName: user?.structureName }
                : {},
            );
          }}
          style={{ ...styles.row, backgroundColor: '#ccc' }}>
          <Text style={styles.mainText}>Сумма продаж</Text>
          <Text style={styles.mainText}>{addSpace(Summa)} сум </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(
              'Orders',
              isManager
                ? { uid: user?.structure, structureName: user?.structureName }
                : {},
            );
          }}
          style={styles.row}>
          <Text style={{ ...styles.mainText, textAlign: 'right' }}>
            {Percent1 || 0}%
          </Text>
          <Text style={{ ...styles.mainText, textAlign: 'right' }}>
            {Amount || 0} шт.
          </Text>
        </TouchableOpacity>
      </View>
      {!isManager && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Sales')}
          style={{ ...styles.block_circle, marginVertical: 5 }}>
          <Icon name="arrow-circle-up" size={20} color="#fff" />
        </TouchableOpacity>
      )}

      {/* ======== */}
      <AmauntBlock
        onPress={() => {
          if (isManager) {
            navigation.navigate('Without', { structure: user?.structure });
            return;
          }
          navigation.navigate('TypeSales', { type: 'Сумма без оплат' });
        }}
        titleText="Сумма без оплат"
        summ={Without}
        amount={WithoutAmount}
        withFlag
        collorActive={AllWithoutPaymentAccepted}
      />

      <AmauntBlock
        onPress={() => {
          if (isManager) {
            navigation.navigate('Expense', {
              structure: user?.structure,
            });
            return;
          }
          navigation.navigate('TypeSales', { type: 'Расходы' });
        }}
        titleText="Расходы"
        withFlag
        collorActive={AllExpensesAccepted}
        summ={Consumption}
        amount={ConsumptionAmount}
      />

      <AmauntBlock
        onPress={() => {
          if (isManager) {
            navigation.navigate('AdvanceTypes', {
              structure: user?.structure,
            });
            return;
          }
          navigation.navigate('TypeSales', { type: 'Авансы' });
        }}
        titleText="Авансы"
        summ={Advance}
        amount={AdvanceAmount}
      />

      <AmauntBlock
        onPress={() => {
          if (isManager) {
            navigation.navigate('CollectionAndPrize', {
              structure: user?.structure,
              type: 'Инкасация',
            });
            return;
          }
          navigation.navigate('TypeSales', { type: 'Инкасация' });
        }}
        titleText="Инкасация"
        summ={CashCollection}
        amount={CashCollectionAmount}
      />

      <AmauntBlock
        onPress={() => {
          if (isManager) {
            navigation.navigate('Orders', {
              uid: user?.structure,
              type: 'Реклама',
            });
            return;
          }
          navigation.navigate('TypeSales', { type: 'Реклама' });
        }}
        titleText="Реклама"
        summ={AdvertisingSum}
        amount={AdvertisingAmount}
        withFlag
        collorActive={AllAdvertisingAccepted}
      />

      <AmauntBlock
        onPress={() => {
          if (isManager) {
            navigation.navigate('CollectionAndPrize', {
              structure: user?.structure,
              type: 'Доп. Работа',
            });
            return;
          }
          navigation.navigate('TypeSales', { type: 'Доп. Работа' });
        }}
        titleText="Доп. Работа"
        summ={PrizesSum}
        amount={PrizesAmount}
      />

      <AmauntBlock
        onPress={() => {
          if (isManager) {
            navigation.navigate('CollectionAndPrize', {
              structure: user?.structure,
              type: 'Штрафы',
            });
            return;
          }
          navigation.navigate('TypeSales', { type: 'Штрафы' });
        }}
        titleText="Штрафы"
        summ={PenaltiesSum}
        amount={PenaltiesAmount}
      />

      <AmauntBlock
        onPress={() => {
          if (isManager) {
            navigation.navigate('CollectionAndPrize', {
              structure: user?.structure,
              type: 'Питстопы',
            });
            return;
          }
          navigation.navigate('TypeSales', { type: 'Питстопы' });
        }}
        titleText="Питстопы"
        amount={PitStopsAmount}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('PartnerList')}
        style={{
          ...styles.block,
          justifyContent: 'space-around',
          height: 130,
        }}>
        <View
          style={{
            justifyContent: 'space-evenly',
            height: '100%',
            alignItems: 'center',
          }}>
          <View style={styles.block_circle}>
            <Text style={styles.block_circle_num}>
              {PartnersAmountGreen || 0}
            </Text>
          </View>
          <Text style={styles.block_title}>Партнеры (Нал)</Text>
          <Text style={styles.block_sum}>{addSpace(PartnersSumGreen)} сум</Text>
        </View>
        <View
          style={{
            justifyContent: 'space-evenly',
            height: '100%',
            alignItems: 'center',
          }}>
          <View style={styles.block_circle}>
            <Text style={styles.block_circle_num}>
              {PartnersAmountYellow || 0}
            </Text>
          </View>
          <Text style={styles.block_title}>Партнеры (Без)</Text>
          <Text style={styles.block_sum}>
            {addSpace(PartnersSumYellow)} сум
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    height: 78,
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#9457EB',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    justifyContent: 'space-around',
  },
  mainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    width: '50%',
    height: '100%',
    paddingHorizontal: 5,
    justifyContent: 'space-around',
  },
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
