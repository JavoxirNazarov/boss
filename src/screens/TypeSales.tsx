/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import GoBack from '../components/Tables/GoBack';
import { makeGetRequest } from '../dataManegment';
import { RootState } from '../redux/slices';
import { addSpace, handleError, wait } from '../utils';
import { formatDate } from '../utils/date';

type listType = {
  Name: string;
  UIDStructure: string;
  Sum?: number;
  Amount: number;
  AllAccepted?: boolean;
};

const reqObj = {
  Реклама: 'advertising',
  'Сумма без оплат': 'ordernpstructure',
  Инкасация: 'cashcollection',
  Штрафы: 'penalties',
  Питстопы: 'pitstops',
  Списания: 'writeoffs',
  'Доп. Работа': 'prizes',
  Авансы: false,
  Расходы: false,
};

interface IProps {
  route: { params: { type: keyof typeof reqObj } };
  navigation: any;
}

export default function TypeSales({ route, navigation }: IProps) {
  const [list, setList] = useState<listType[]>([]);
  const { selectedDate, prevDate } = useSelector(
    (state: RootState) => state.dateState,
  );
  const { type } = route.params;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  async function refresh() {
    try {
      let res;
      if (reqObj[type]) {
        res = await makeGetRequest(
          `${reqObj[type]}/${formatDate(prevDate)}/${formatDate(selectedDate)}`,
        );
      } else {
        res = await makeGetRequest(
          `expenseadvancestruc/${formatDate(prevDate)}/${formatDate(
            selectedDate,
          )}/${type === 'Авансы' ? 'advances' : 'expenses'}`,
        );
      }
      setList(res);
    } catch (err) {
      handleError(err);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function routeByType(structure: string) {
    switch (type) {
      case 'Сумма без оплат':
        return navigation.navigate('Without', { structure });
      case 'Списания':
        return navigation.navigate('WriteOffs', { structure });
      case 'Инкасация':
      case 'Доп. Работа':
      case 'Штрафы':
      case 'Питстопы':
        return navigation.navigate('CollectionAndPrize', { structure, type });
      case 'Реклама':
        return navigation.navigate('Orders', { uid: structure, type });
      case 'Авансы':
        return navigation.navigate('AdvanceTypes', { structure });
      default:
        return navigation.navigate('Expense', { structure });
    }
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.wraper}>
      <GoBack />

      {list.length ? (
        list.map((el, i) => (
          <View key={i} style={{ alignItems: 'center', marginVertical: 15 }}>
            <Text style={{ marginVertical: 5, fontSize: 16 }}>{el.Name}</Text>
            <TouchableOpacity
              onPress={() => routeByType(el.UIDStructure)}
              style={{
                ...styles.block,
                backgroundColor:
                  el.AllAccepted !== undefined
                    ? el.AllAccepted
                      ? '#20ba27'
                      : '#e31b3d'
                    : '#FFFFFF',
              }}>
              <View style={{ justifyContent: 'space-evenly', height: '100%' }}>
                <Text style={styles.block_title}>{type}</Text>
                {el.Sum !== undefined && (
                  <Text style={styles.block_sum}>{addSpace(el.Sum)} сум</Text>
                )}
              </View>
              <View style={styles.block_circle}>
                <Text style={styles.block_circle_num}>{el.Amount}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))
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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  block: {
    width: '100%',
    height: 78,
    marginTop: 10,
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
