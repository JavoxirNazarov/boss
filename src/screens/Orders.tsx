import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import { makeGetRequest, sendData } from '../dataManegment';
import { RootState } from '../redux/slices';
import { formatDate } from '../utils/date';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { addSpace, handleError, wait } from '../utils';

type ordersType = {
  Type: string;
  Sum: number;
  Number: string;
  DateClose: string;
  DateOpen: string;
  UIDOrder: string;
  Employee: string;
  accepted?: boolean;
  Deleted?: boolean;
  DeletionCause?: string;
};

export default function Orders({ route, navigation }: any) {
  const { selectedDate, prevDate } = useSelector(
    (state: RootState) => state.dateState,
  );
  const [orders, setOrders] = useState<ordersType[]>([]);
  const [loading, setLoading] = useState(true);
  const { uid, type, UIDPayment, UIDPartner, structureName, color } =
    route.params;

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
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (type?.includes('Партнеры')) {
      makeGetRequest(
        `partners/${formatDate(prevDate)}/${formatDate(
          selectedDate,
        )}?UIDStructure=${uid}&UIDPartner=${UIDPartner}&Payment=${color}`,
      )
        .then((res) => setOrders(res))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (type === 'доставки') {
      makeGetRequest(
        `listdorders/${uid}/${formatDate(prevDate)}/${formatDate(
          selectedDate,
        )}`,
      )
        .then((res) => setOrders(res))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (type) {
      makeGetRequest(
        `listporders/${uid}/${formatDate(prevDate)}/${formatDate(
          selectedDate,
        )}/${UIDPayment}`,
      )
        .then((res) => setOrders(res))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      makeGetRequest(
        `listorders/${formatDate(prevDate)}/${formatDate(selectedDate)}${
          uid ? '?UIDStructure=' + uid : ''
        }`,
      )
        .then((res) => setOrders(res))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }
  useEffect(refresh, []);

  const accept = (UID: string, val: boolean) => {
    sendData('accept', {
      UIDOrder: UID,
      Accepted: val,
    })
      .then(() => {
        setOrders((prev) =>
          prev.map((item) => {
            return item.UIDOrder == UID ? { ...item, accepted: val } : item;
          }),
        );
      })
      .catch(() => {});
  };

  const handleColor = (el: ordersType) => {
    if (el.Deleted !== undefined && el.Deleted) return '#e31b3d';
    if (el.accepted !== undefined && !el.accepted) return '#e31b3d';
    if (!el.DateClose || !el.DateOpen) return '#e31b3d';
    return '#fff';
  };

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
          height: 50,
          paddingHorizontal: 20,
        }}>
        <Icon
          onPress={() => navigation.goBack()}
          name="arrow-left"
          size={30}
          color="#fff"
        />
        <Text style={{ color: '#fff', fontSize: 20 }}>
          Все{' '}
          {type ? type : structureName ? 'счета: ' + structureName : 'счета'}
        </Text>
        <View />
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
                backgroundColor: handleColor(el),
              }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    marginVertical: 10,
                  }}>
                  Чек: {el.Number}
                </Text>

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
                  <Text>Работник</Text>
                  <Text>{el.Employee}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text>Сумма</Text>
                  <Text>{addSpace(el.Sum)}</Text>
                </View>
                {el.DeletionCause !== undefined && (
                  <View style={styles.textRow}>
                    <Text>Причина удаления</Text>
                    <Text style={{ width: '50%', textAlign: 'right' }}>
                      {el.DeletionCause || 'Причина не указана'}
                    </Text>
                  </View>
                )}

                <View style={{ alignItems: 'flex-end' }}>
                  {el.accepted !== undefined &&
                    (el?.accepted ? (
                      <Icon
                        onPress={() => accept(el.UIDOrder, !el.accepted)}
                        name="checkbox-marked"
                        size={25}
                        color="#00B686"
                      />
                    ) : (
                      <Icon
                        onPress={() => accept(el.UIDOrder, !el.accepted)}
                        name="checkbox-blank-outline"
                        size={25}
                        color="#00B686"
                      />
                    ))}
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ alignSelf: 'center', marginTop: 50, fontSize: 18 }}>
            Чеков нет
          </Text>
        )
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
    marginBottom: 10,
  },
});
