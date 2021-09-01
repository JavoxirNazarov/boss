import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { makeGetRequest } from '../dataManegment';
import { RootState } from '../redux/slices';
import { addSpace, handleError, wait } from '../utils';
import { formatDate } from '../utils/date';

type listType = {
  cashier?: string;
  name?: string;
  date: string;
  sum: number;
  comment: string;
  number?: string;
  employee?: string;
  dateEnd: string;
  dateStart: string;
};

export default function CollectionAndPrize({ route, navigation }: any) {
  const { selectedDate, prevDate } = useSelector(
    (state: RootState) => state.dateState,
  );
  const { structure, type } = route.params;

  const [list, setList] = useState<listType[]>([]);
  const [fetching, setFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  function refresh() {
    let params: string;

    switch (type) {
      case 'Инкасация':
        params = `collectionstructure/${structure}/${formatDate(
          prevDate,
        )}/${formatDate(selectedDate)}`;
        break;
      case 'Доп. Работа':
        params = `prizes/${formatDate(prevDate)}/${formatDate(
          selectedDate,
        )}?UIDStructure=${structure}`;
        break;
      case 'Питстопы':
        params = `pitstops/${formatDate(prevDate)}/${formatDate(
          selectedDate,
        )}?UIDStructure=${structure}`;
        break;
      default:
        params = `penalties/${formatDate(prevDate)}/${formatDate(
          selectedDate,
        )}?UIDStructure=${structure}`;
        break;
    }

    makeGetRequest(params)
      .then((res) => setList(res))
      .catch(handleError)
      .finally(() => setFetching(false));
  }

  useEffect(refresh, [structure, prevDate, selectedDate]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={{ width: '100%' }}>
      <LinearGradient
        colors={['#CD4629', '#FF5733']}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          height: 50,
          paddingHorizontal: 20,
        }}>
        <Icon
          onPress={() => navigation.goBack()}
          name="arrow-left"
          size={30}
          color="#fff"
        />
        <Text style={{ color: '#fff', fontSize: 20 }}>{type}</Text>
        <View />
      </LinearGradient>

      {!fetching ? (
        <>
          {list.length ? (
            list.map((el, i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  padding: 10,
                }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {el.name || el.number}
                  </Text>
                  <View style={styles.textRow}>
                    <Text>Сотрудник</Text>
                    <Text>{el.cashier || el.employee}</Text>
                  </View>

                  {type !== 'Питстопы' ? (
                    <>
                      <View style={styles.textRow}>
                        <Text>Дата</Text>
                        <Text>{el.date}</Text>
                      </View>
                      <View style={styles.textRow}>
                        <Text>Сумма</Text>
                        <Text>{addSpace(el.sum)}</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.textRow}>
                        <Text>Дата начала</Text>
                        <Text>{el.dateStart}</Text>
                      </View>
                      <View style={styles.textRow}>
                        <Text>Дата конца</Text>
                        <Text>{el.dateEnd}</Text>
                      </View>
                    </>
                  )}
                  <View style={styles.textRow}>
                    <Text>Коментарий</Text>
                    <Text style={{ width: '50%', textAlign: 'right' }}>
                      {el.comment || 'не указана'}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ alignSelf: 'center', marginTop: 50, fontSize: 18 }}>
              Чеков нет
            </Text>
          )}
        </>
      ) : (
        <ActivityIndicator color="blue" style={{ marginTop: 50 }} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});
