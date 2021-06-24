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

type ordersType = {
  Type: string;
  Sum: number;
  Number: string;
  DateClose: string;
  DateOpen: string;
  UIDOrder: string;
  Employee: string;
  accepted?: boolean;
};

export default function Orders({route, navigation}: any) {
  const {selectedDate, prevDate} = useSelector(
    (state: RootState) => state.dateState,
  );
  const [orders, setOrders] = useState<ordersType[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    uid,
    type,
    UIDPayment,
    UIDPartner,
    structureName,
    color,
  } = route.params;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  function refresh() {
    if (type == 'Реклама') {
      makeGetRequest(
        `advertising/${formatDate(prevDate)}/${formatDate(
          selectedDate,
        )}?UIDStructure=${uid}`,
      )
        .then((res) => setOrders(res))
        .catch(handleError)
        .finally(() => setLoading(false));
    } else if (typeof type == 'string' && type.includes('Партнеры')) {
      makeGetRequest(
        `partners/${formatDate(prevDate)}/${formatDate(
          selectedDate,
        )}?UIDStructure=${uid}&UIDPartner=${UIDPartner}&Payment=${color}`,
      )
        .then((res) => setOrders(res))
        .catch(handleError)
        .finally(() => setLoading(false));
    } else if (type == 'доставки') {
      makeGetRequest(
        `listdorders/${uid}/${formatDate(prevDate)}/${formatDate(
          selectedDate,
        )}`,
      )
        .then((res) => setOrders(res))
        .catch(handleError)
        .finally(() => setLoading(false));
    } else if (type) {
      makeGetRequest(
        `listporders/${uid}/${formatDate(prevDate)}/${formatDate(
          selectedDate,
        )}/${UIDPayment}`,
      )
        .then((res) => setOrders(res))
        .catch(handleError)
        .finally(() => setLoading(false));
    } else {
      makeGetRequest(
        `listorders/${formatDate(prevDate)}/${formatDate(selectedDate)}${
          uid ? '?UIDStructure=' + uid : ''
        }`,
      )
        .then((res) => setOrders(res))
        .catch(handleError)
        .finally(() => setLoading(false));
    }
  }
  useEffect(refresh, []);

  const accept = (UID: string, val: boolean) => {
    sendData('accept', {
      UIDOrder: UID,
      Accepted: val,
    })
      .then((res) => {
        setOrders((prev) =>
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
        <Text style={{color: '#fff', fontSize: 20}}>
          Все{' '}
          {type ? type : structureName ? 'счета: ' + structureName : 'счета'}
        </Text>
        <View></View>
      </LinearGradient>

      {!loading ? (
        orders.length ? (
          orders.map((el, i) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Order', {
                  id: el.UIDOrder,
                })
              }
              key={i}
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                padding: 10,
                backgroundColor:
                  el.accepted !== undefined
                    ? el.accepted
                      ? '#FFFFFF'
                      : '#e31b3d'
                    : '#fff',
              }}>
              <View
                style={{
                  width: '15%',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}>
                <Text>{el.Number}</Text>

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
                  <Text>Тип счёта</Text>
                  <Text>{el.Type}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text>Дата открытия</Text>
                  <Text>{el.DateOpen}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text>Дата закрытия</Text>
                  <Text>{el.DateClose}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text>Официант</Text>
                  <Text>{el.Employee}</Text>
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
