import React, {useCallback, useEffect, useState} from 'react';
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
import {useSelector} from 'react-redux';
import {makeGetRequest, sendData} from '../dataManegment';
import {RootState} from '../redux/slices';
import {addSpace, handleError, wait} from '../utils';
import {formatDate} from '../utils/date';

type listType = {
  cashier: string;
  comment: string;
  date: string;
  expenditure: string;
  sum: number;
  structure: string;
  employee: string | undefined;
  UIDExpense: string;
  accepted?: boolean;
};

export default function Orders({route, navigation}: any) {
  const {selectedDate, prevDate} = useSelector(
    (state: RootState) => state.dateState,
  );
  const [list, setList] = useState<listType[]>([]);
  const [fetching, setFetching] = useState(true);
  const {structure} = route.params;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  function refresh() {
    makeGetRequest(
      `expenseadvance/${formatDate(prevDate)}/${formatDate(
        selectedDate,
      )}/expenses?UIDStructure=${structure}`,
    )
      .then((res) => setList(res))
      .catch(handleError)
      .finally(() => setFetching(false));
  }

  useEffect(refresh, []);

  const accept = (UID: string, val: boolean) => {
    sendData('accept', {
      UIDExpense: UID,
      Accepted: val,
    })
      .then((res) => {
        setList((prev) =>
          prev.map((item) => {
            return item.UIDExpense == UID ? {...item, accepted: val} : item;
          }),
        );
      })
      .catch(handleError);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={{width: '100%'}}>
      <LinearGradient
        colors={['#CD4629', '#FF5733']}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 50,
          paddingHorizontal: 20,
        }}>
        <Icon
          onPress={() => navigation.goBack()}
          name="arrow-left"
          size={30}
          color="#fff"
        />
        <Text style={{color: '#fff', fontSize: 20}}>Все Расходы</Text>
        <View />
      </LinearGradient>

      {!fetching ? (
        <>
          {list.length ? (
            list.map((el, i) => (
              <View
                key={i}
                style={{
                  borderBottomWidth: 1,
                  padding: 10,
                  backgroundColor:
                    el.accepted !== undefined
                      ? el.accepted
                        ? '#FFFFFF'
                        : '#e31b3d'
                      : '#fff',
                }}>
                <View style={styles.textRow}>
                  <Text>Структура</Text>
                  <Text>{el.structure}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text>Кассир</Text>
                  <Text>{el.cashier}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text>Дата</Text>
                  <Text>{el.date}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text>Работник</Text>
                  <Text>{el.employee || 'не указан'}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text>Сумма</Text>
                  <Text>{addSpace(el.sum)} сум</Text>
                </View>
                <View style={styles.textRow}>
                  <Text>Статя расхода</Text>
                  <Text>{el.expenditure || 'не указана'}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text>Коментарий</Text>
                  <Text style={{width: '50%'}}>
                    {el.comment || 'не указана'}
                  </Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  {el.accepted !== undefined &&
                    (el.accepted ? (
                      <Icon
                        onPress={() => accept(el.UIDExpense, !el.accepted)}
                        name="checkbox-marked"
                        size={25}
                        color="#00B686"
                      />
                    ) : (
                      <Icon
                        onPress={() => accept(el.UIDExpense, !el.accepted)}
                        name="checkbox-blank-outline"
                        size={25}
                        color="#00B686"
                      />
                    ))}
                </View>
              </View>
            ))
          ) : (
            <Text style={{alignSelf: 'center', marginTop: 50, fontSize: 18}}>
              Чеков нет
            </Text>
          )}
        </>
      ) : (
        <ActivityIndicator />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
