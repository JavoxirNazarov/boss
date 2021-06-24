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
import {makeGetRequest} from '../dataManegment';
import {RootState} from '../redux/slices';
import {addSpace, handleError, wait} from '../utils';
import {formatDate} from '../utils/date';

type listType = {
  cashier: string;
  name: string;
  date: string;
  sum: number;
  comment: string;
};

export default function CashCollection({route, navigation}: any) {
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
      `collectionstructure/${structure}/${formatDate(prevDate)}/${formatDate(
        selectedDate,
      )}`,
    )
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
      style={{width: '100%'}}>
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
        <Text style={{color: '#fff', fontSize: 20}}>Инкасации</Text>
        <View></View>
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
                <Text style={{width: '10%'}}>{el.name}</Text>
                <View style={{flex: 1}}>
                  <View style={styles.textRow}>
                    <Text>Кассир</Text>
                    <Text>{el.cashier}</Text>
                  </View>
                  <View style={styles.textRow}>
                    <Text>Дата</Text>
                    <Text>{el.date}</Text>
                  </View>
                  <View style={styles.textRow}>
                    <Text>Коментарий</Text>
                    <Text>{el.comment || 'не указана'}</Text>
                  </View>
                  <View style={styles.textRow}>
                    <Text>Сумма</Text>
                    <Text>{addSpace(el.sum)}</Text>
                  </View>
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
        <ActivityIndicator color="blue" style={{marginTop: 50}} />
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
