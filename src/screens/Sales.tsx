import React, { Fragment, useCallback, useEffect, useState } from 'react';
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
import GoBack from '../components/Tables/GoBack';
import { makeGetRequest } from '../dataManegment';
import { RootState } from '../redux/slices';
import { addSpace, handleError, wait } from '../utils';
import { formatDate } from '../utils/date';

type salesType = {
  Amount: number;
  Name: string;
  Percent: number;
  Sum: number;
  UIDStructure: string;
};

export default function Sales({ navigation }: any) {
  const { selectedDate, prevDate } = useSelector(
    (state: RootState) => state.dateState,
  );
  const [sales, setSales] = useState<salesType[]>([]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  function refresh() {
    makeGetRequest(
      `getsales/${formatDate(prevDate)}/${formatDate(selectedDate)}`,
    )
      .then((res) => setSales(res))
      .catch(() => {});
  }

  useEffect(refresh, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.wraper}>
      <GoBack />

      {sales.length ? (
        sales.map((el, i) => (
          <Fragment key={i}>
            <Text style={{ alignSelf: 'center' }}>{el.Name}</Text>
            <View style={styles.main}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Sections', {
                    uid: el.UIDStructure,
                    structureName: el.Name,
                  })
                }
                style={{ ...styles.row, backgroundColor: '#ccc' }}>
                <Text style={styles.mainText}>Сумма продаж</Text>
                <Text style={styles.mainText}>{addSpace(el.Sum)} сум </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Orders', {
                    uid: el.UIDStructure,
                    structureName: el.Name,
                  })
                }
                style={{ ...styles.row }}>
                <Text style={{ ...styles.mainText, textAlign: 'right' }}>
                  {el.Percent}%
                </Text>
                <Text style={{ ...styles.mainText, textAlign: 'right' }}>
                  {el.Amount} шт.
                </Text>
              </TouchableOpacity>
            </View>
          </Fragment>
        ))
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
    width: '50%',
    height: '100%',
    paddingHorizontal: 5,
    justifyContent: 'space-around',
  },
  main: {
    width: '100%',
    height: 78,
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: '#9457EB',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    justifyContent: 'space-around',
  },
  mainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
