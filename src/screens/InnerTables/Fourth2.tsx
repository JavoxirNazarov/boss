import React, { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Option, Select } from 'react-native-chooser';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import GoBack from '../../components/Tables/GoBack';
import Statistics from '../../components/Tables/Table2-6/Statistics';
import { StatisticsType } from '../../constants/types';
import { makeGetRequest } from '../../dataManegment';
import { RootState } from '../../redux/slices';
import { handleError, wait } from '../../utils';
import { formatDate } from '../../utils/date';

type courierType = {
  Name: string;
  UIDCourier: string;
};

export default function Table9({ route, navigation }: any) {
  const { selectedDate, prevDate } = useSelector(
    (state: RootState) => state.dateState,
  );

  const { structure } = route.params;

  const [couriers, setCouriers] = useState<courierType[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<Partial<courierType>>(
    route.params,
  );
  const [refreshing, setRefreshing] = useState(false);

  const [statistics, setStatistics] = useState<Partial<StatisticsType>>({});

  useEffect(() => {
    makeGetRequest(`listcouriers/${structure}`)
      .then((res) => setCouriers(res))
      .catch(() => {});
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, [selectedCourier]);

  function refresh() {
    makeGetRequest(
      `statisticscourier/${structure}/${
        selectedCourier.UIDCourier
      }/${formatDate(prevDate)}/${formatDate(selectedDate)}`,
    )
      .then((res) => setStatistics(res))
      .catch(() => {});
  }

  useEffect(refresh, [selectedCourier]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.wraper}>
      <GoBack />
      <View style={styles.container}>
        <Text style={styles.title}>
          Среднее время доставки заказа на текущий день по курьерам
        </Text>
        <Select
          transparent={true}
          indicatorIcon={<Icon name="angle-down" color="blue" size={25} />}
          onSelect={(value, label) => {
            setSelectedCourier({ Name: label, UIDCourier: value });
          }}
          defaultText={selectedCourier.Name ? selectedCourier.Name : null}
          style={styles.select}
          optionListStyle={{
            backgroundColor: '#FFF',
            height: 300,
            borderRadius: 10,
          }}>
          {couriers.map((el, i) => (
            <Option
              style={{ paddingVertical: 10, borderBottomWidth: 1 }}
              key={i}
              value={el.UIDCourier}>
              {el.Name}
            </Option>
          ))}
        </Select>

        <Statistics statistics={statistics} navigation={navigation} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wraper: {
    flex: 1,
    padding: 10,
  },
  title: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  container: {
    marginTop: 20,
    width: '100%',
    minHeight: 224,
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
  select: {
    marginTop: 10,
    minWidth: 187,
    height: 47,
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 2.22,
    marginBottom: 12,
    borderWidth: 0,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  count: {
    marginVertical: 3,
    padding: 3,
    minWidth: 52,
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
    fontWeight: '300',
    fontSize: 11,
    color: '#506883',
  },
});
