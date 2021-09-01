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
import { makeGetRequest } from '../dataManegment';
import { RootState } from '../redux/slices';
import { formatDate } from '../utils/date';
import DeliveryIcon from '../assets/Car1';
import GoBack from '../components/Tables/GoBack';
import { addSpace, handleError, wait } from '../utils';

type deliveriesType = {
  Amount: number;
  Name: string;
  Percent: number;
  Sum: number;
  UIDStructure: string;
};

export default function Deliveries({ navigation }: any) {
  const { selectedDate, prevDate } = useSelector(
    (state: RootState) => state.dateState,
  );
  const [deliveries, setDeliveries] = useState<deliveriesType[]>([]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  function refresh() {
    makeGetRequest(
      `getdeliveries/${formatDate(prevDate)}/${formatDate(selectedDate)}`,
    )
      .then((res) => setDeliveries(res))
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
      {deliveries.length ? (
        deliveries.map((el, i) => (
          <Fragment key={i}>
            <Text style={{ alignSelf: 'center' }}>{el.Name}</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Orders', {
                  uid: el.UIDStructure,
                  type: 'доставки',
                })
              }
              style={styles.main}>
              <View
                style={{
                  justifyContent: 'space-around',
                  height: '100%',
                }}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: 14,
                  }}>
                  Количество доставок
                </Text>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: 24,
                  }}>
                  {addSpace(el.Sum)} сум
                </Text>
              </View>

              <Text
                style={{
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: 36,
                  top: 5,
                }}>
                {el.Amount}
              </Text>

              <DeliveryIcon style={{ top: 5 }} />

              <Text
                style={{
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: 18,
                  position: 'absolute',
                  top: 5,
                  right: 5,
                }}>
                {el.Percent}%
              </Text>
            </TouchableOpacity>
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
  title: {
    fontSize: 18,
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginTop: 40,
  },
  main: {
    position: 'relative',
    width: '100%',
    height: 113,
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E80054',
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    marginVertical: 10,
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  block: {
    marginTop: 10,
    borderRadius: 4,
    height: 113,
    width: '48%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-evenly',
    paddingHorizontal: 15,
  },
  block_text: {
    color: '#00B686',
    fontSize: 16,
    fontWeight: '500',
  },
});
