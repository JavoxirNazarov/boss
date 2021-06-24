import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import * as Progress from 'react-native-progress';
import {useSelector} from 'react-redux';
import GoBack from '../../components/Tables/GoBack';
import {makeGetRequest} from '../../dataManegment';
import {RootState} from '../../redux/slices';
import {handleError, wait} from '../../utils';
import {formatDate} from '../../utils/date';

type tableType = {
  Name: string;
  UIDStructure: string;
  Amount: number;
};

export default function Table142({route}: any) {
  const {selectedDate} = useSelector((state: RootState) => state.dateState);
  const [table, setTable] = useState<tableType[]>([]);
  const {date} = route.params;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  function refresh() {
    if (date) {
      makeGetRequest('pizzamountday/' + date)
        .then((res) => setTable(res))
        .catch(handleError);
      return;
    }
    makeGetRequest('pizzamountday/' + formatDate(selectedDate))
      .then((res) => setTable(res))
      .catch(handleError);
  }

  useEffect(refresh, []);

  const all = useMemo(() => {
    if (table.length) {
      return table.reduce((a, b) => a + b.Amount, 0);
    }
    return 0;
  }, [table]);

  function percent(num: number) {
    if (!num) return 0;
    if (all) {
      return num / all;
    }
    return 0;
  }
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.wraper}>
      <GoBack />

      <View style={styles.container}>
        <Text style={styles.title}>Количество проданных пицц </Text>
        {table
          .sort((a, b) => b.Amount - a.Amount)
          .map((el, i) => (
            <View key={i} style={{width: 300, marginVertical: 15}}>
              <View style={styles.row}>
                <Text style={styles.placeNumbers}>{el.Name}</Text>
                <Text style={styles.placeNumbers}>{el.Amount}</Text>
              </View>
              <Progress.Bar
                style={{marginTop: 10}}
                unfilledColor="rgba(0, 182, 134, 0.1)"
                borderColor="transparent"
                progress={percent(el.Amount)}
                height={16}
                color="#00B686"
                width={300}
              />
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wraper: {
    flex: 1,
    padding: 10,
  },
  container: {
    marginTop: 20,
    width: '100%',
    minHeight: 208,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    padding: 15,
    alignItems: 'center',
  },
  title: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  count: {
    width: 52,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeNumbers: {
    fontWeight: 'bold',
    fontSize: 10,
    color: '#333333',
  },
});
