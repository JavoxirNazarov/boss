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
  itemName: string;
  sum: number;
  price: number;
  quantity: number;
};

export default function Section({ route, navigation }: any) {
  const { selectedDate, prevDate } = useSelector(
    (state: RootState) => state.dateState,
  );
  const [list, setList] = useState<listType[]>([]);
  const [loading, setLoading] = useState(true);
  const { branchName, UIDBranch, structure } = route.params;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  function refresh() {
    makeGetRequest(
      `branchdetails/${UIDBranch}/${formatDate(prevDate)}/${formatDate(
        selectedDate,
      )}${structure ? '?UIDStructure=' + structure : ''}`,
    )
      .then((res) => setList(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }
  useEffect(refresh, []);

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
        <Text style={{ color: '#fff', fontSize: 20 }}>{branchName}</Text>
        <View></View>
      </LinearGradient>

      {!loading ? (
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
                <Text style={{ width: '10%' }}>{i + 1}</Text>
                <View style={{ flex: 1 }}>
                  <View style={styles.textRow}>
                    <Text>{el.itemName}</Text>
                  </View>
                  <View style={styles.textRow}>
                    <Text>Цена</Text>
                    <Text>{addSpace(el.price)}</Text>
                  </View>
                  <View style={styles.textRow}>
                    <Text>Количество</Text>
                    <Text>{el.quantity}</Text>
                  </View>
                  <View style={styles.textRow}>
                    <Text>Сумма</Text>
                    <Text>{addSpace(el.sum)}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ alignSelf: 'center', marginTop: 50, fontSize: 18 }}>
              Список пустой
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
    marginBottom: 10,
  },
});
