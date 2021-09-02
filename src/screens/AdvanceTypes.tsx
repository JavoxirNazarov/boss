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
  UIDPosition: string;
  Sum: number;
};

type infoType = {
  positions: listType[];
  total: number;
};

export default function AdvanceTypes({ route, navigation }: any) {
  const [info, setInfo] = useState<Partial<infoType>>({});
  const { selectedDate, prevDate } = useSelector(
    (state: RootState) => state.dateState,
  );
  const { structure } = route.params;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  function refresh() {
    makeGetRequest(
      `advances/${structure}/${formatDate(prevDate)}/${formatDate(
        selectedDate,
      )}`,
    )
      .then((res) => setInfo(res))
      .catch(() => {});
  }

  useEffect(refresh, []);

  function routeByType(position: string) {
    navigation.navigate('Advances', { structure, position });
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.wraper}>
      <GoBack />

      {info.total ? (
        <>
          {info?.positions?.map((el, i) => (
            <View key={i} style={{ alignItems: 'center', marginVertical: 15 }}>
              <TouchableOpacity
                onPress={() => routeByType(el.UIDPosition)}
                style={styles.block}>
                <Text style={styles.block_title}>{el.Name}</Text>
                <Text style={styles.block_sum}>{addSpace(el.Sum)} сум</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
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
    backgroundColor: '#FFFFFF',
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

  block_title: {
    fontWeight: '500',
    fontSize: 16,
    color: '#495057',
  },
  block_sum: {
    color: '#00B686',
    fontWeight: '500',
    fontSize: 16,
  },
});
