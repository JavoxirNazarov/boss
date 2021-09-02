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
import { makeGetRequest } from '../dataManegment';
import { RootState } from '../redux/slices';
import { formatDate } from '../utils/date';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { wait } from '../utils';

type listType = {
  UIDWriteOff: string;
  Number: string;
  Date: string;
  Accepted: boolean;
  BossAccepted: boolean;
  Comment: string;
};

export default function WriteOffs({ route, navigation }: any) {
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
      `writeoffs/${formatDate(prevDate)}/${formatDate(
        selectedDate,
      )}?UIDStructure=${structure}`,
    )
      .then((res) => setList(res))
      .catch(() => {})
      .finally(() => setFetching(false));
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
          height: 50,
          paddingHorizontal: 20,
        }}>
        <Icon
          onPress={() => navigation.goBack()}
          name="arrow-left"
          size={30}
          color="#fff"
        />
        <Text style={{ color: '#fff', fontSize: 20 }}>Списания</Text>
        <View />
      </LinearGradient>

      {!fetching ? (
        list?.length ? (
          list?.map((el, i) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('WriteOff', { id: el.UIDWriteOff })
              }
              key={i}
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                paddingHorizontal: 5,
                paddingVertical: 10,
                backgroundColor: el.BossAccepted ? '#FFFFFF' : '#e31b3d',
              }}>
              <View style={{ flex: 1 }}>
                <View style={styles.textRow}>
                  <Text>Номер</Text>
                  <Text>{el.Number}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text>Дата</Text>
                  <Text>{el.Date}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text>Коментарий</Text>
                  <Text style={{ width: '50%', textAlign: 'right' }}>
                    {el.Comment || 'не указана'}
                  </Text>
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
