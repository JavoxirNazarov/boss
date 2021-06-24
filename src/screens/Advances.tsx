import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import GoBack from '../components/Tables/GoBack';
import {makeGetRequest} from '../dataManegment';
import {RootState} from '../redux/slices';
import {addSpace, handleError, wait} from '../utils';
import {formatDate} from '../utils/date';

type listType = {
  name: string;
  sum: number;
};

export default function Advances({route}: any) {
  const [list, setList] = useState<listType[]>([]);
  const {selectedDate, prevDate} = useSelector(
    (state: RootState) => state.dateState,
  );
  const {structure, position} = route.params;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  function refresh() {
    makeGetRequest(
      `workersadvance/${structure}/${position}/${formatDate(
        prevDate,
      )}/${formatDate(selectedDate)}`,
    )
      .then((res) => setList(res))
      .catch(handleError);
  }

  useEffect(refresh, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.wraper}>
      <GoBack />

      {list.length ? (
        <>
          {list.map((el, i) => (
            <View key={i} style={{alignItems: 'center', marginVertical: 15}}>
              <View style={styles.block}>
                <Text style={styles.block_title}>{el.name}</Text>
                <Text style={styles.block_sum}>{addSpace(el.sum)} сум</Text>
              </View>
            </View>
          ))}
        </>
      ) : (
        <ActivityIndicator color="blue" style={{marginTop: 50}} />
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
