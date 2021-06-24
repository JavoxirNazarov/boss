import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Switch,
} from 'react-native';
import {useSelector} from 'react-redux';
import {makeGetRequest, sendData} from '../dataManegment';
import {RootState} from '../redux/slices';
import {formatDate} from '../utils/date';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {addSpace, handleError, wait} from '../utils';

type listType = {
  OrderNumber: string;
  PaymentComment: string;
  Structure: string;
  Sum: number;
  Time: string;
  UIDOrder: string;
  accepted: boolean;
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
      `orderpaymentless/${formatDate(prevDate)}/${formatDate(
        selectedDate,
      )}?UIDStructure=${structure}`,
    )
      .then((res) => setList(res))
      .catch(handleError)
      .finally(() => setFetching(false));
  }

  useEffect(refresh, []);

  const accept = (UID: string, val: boolean) => {
    sendData('accept', {
      UIDOrder: UID,
      Accepted: val,
    })
      .then((res) => {
        setList((prev) =>
          prev.map((item) => {
            return item.UIDOrder == UID ? {...item, accepted: val} : item;
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
        <Text style={{color: '#fff', fontSize: 20}}>Без оплат</Text>
        <View></View>
      </LinearGradient>

      {!fetching ? (
        list.length ? (
          list.map((el, i) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Order', {id: el.UIDOrder})}
              key={i}
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                paddingHorizontal: 5,
                paddingVertical: 10,
                backgroundColor: el.accepted ? '#FFFFFF' : '#e31b3d',
              }}>
              <View
                style={{
                  width: '15%',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}>
                <Text>{el.OrderNumber}</Text>

                {el.accepted !== undefined && (
                  <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={el.accepted ? '#f5dd4b' : '#f4f3f4'}
                    onValueChange={() => accept(el.UIDOrder, !el.accepted)}
                    value={el.accepted}
                  />
                )}
              </View>
              <View style={{flex: 1}}>
                <View style={styles.textRow}>
                  <Text>Структура</Text>
                  <Text>{el.Structure}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text>Дата</Text>
                  <Text>{el.Time}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text>Коментарий</Text>
                  <Text style={{width: '50%'}}>
                    {el.PaymentComment || 'не указана'}
                  </Text>
                </View>
                <View style={styles.textRow}>
                  <Text>Сумма</Text>
                  <Text>{addSpace(el.Sum)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{alignSelf: 'center', marginTop: 50, fontSize: 18}}>
            Чеков нет
          </Text>
        )
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
