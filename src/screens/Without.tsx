/* eslint-disable react-hooks/exhaustive-deps */
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

type listType = {
  OrderNumber: string;
  PaymentComment: string;
  Structure: string;
  Sum: number;
  Time: string;
  UIDOrder: string;
  accepted: boolean;
};

export default function Orders({ route, navigation }: any) {
  const { selectedDate, prevDate } = useSelector(
    (state: RootState) => state.dateState,
  );
  const [list, setList] = useState<listType[]>([]);
  const [fetching, setFetching] = useState(true);
  const { structure } = route.params;
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
      .catch(() => {})
      .finally(() => setFetching(false));
  }

  useEffect(refresh, []);

  const accept = (el: listType) => {
    sendData('accept', {
      UIDOrder: el.UIDOrder,
      Accepted: !el.accepted,
    })
      .then(() => {
        setList((prev) =>
          prev.map((item) => {
            return item.UIDOrder === el.UIDOrder
              ? { ...item, accepted: !el.accepted }
              : item;
          }),
        );
      })
      .catch(() => {});
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
        <Text style={{ color: '#fff', fontSize: 20 }}>?????? ??????????</Text>
        <View />
      </LinearGradient>

      {!fetching ? (
        list.length ? (
          list.map((el, i) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Order', { id: el.UIDOrder })}
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

                {el.accepted ? (
                  <Icon
                    onPress={() => accept(el)}
                    name="checkbox-marked"
                    size={25}
                    color="#00B686"
                  />
                ) : (
                  <Icon
                    onPress={() => accept(el)}
                    name="checkbox-blank-outline"
                    size={25}
                    color="#00B686"
                  />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.textRow}>
                  <Text>??????????????????</Text>
                  <Text>{el.Structure}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text>????????</Text>
                  <Text>{el.Time}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text>????????????????????</Text>
                  <Text style={{ width: '50%', textAlign: 'right' }}>
                    {el.PaymentComment || '???? ??????????????'}
                  </Text>
                </View>
                <View style={styles.textRow}>
                  <Text>??????????</Text>
                  <Text>{addSpace(el.Sum)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ alignSelf: 'center', marginTop: 50, fontSize: 18 }}>
            ?????????? ??????
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
