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
  const { structure } = route.params;
  const { selectedDate, prevDate } = useSelector(
    (state: RootState) => state.dateState,
  );
  const [couriers, setCouriers] = useState<courierType[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<Partial<courierType>>(
    route.params,
  );
  const [statistics, setStatistics] = useState<Partial<StatisticsType>>({});

  useEffect(() => {
    makeGetRequest(`listcouriers/${structure}`)
      .then((res) => setCouriers(res))
      .catch(() => {});
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, [selectedCourier]);

  function refresh() {
    setStatistics((prev) => ({}));
    makeGetRequest(
      `statisticscourier2/${structure}/${
        selectedCourier.UIDCourier
      }/${formatDate(prevDate)}/${formatDate(selectedDate)}`,
    )
      .then((res) => setStatistics((prev) => res))
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
          ?????????????? ?????????? ???????????????? ???????????? ???? ?????????????? ???????? ???? ????????????????
        </Text>
        <Text style={styles.subtitle}>
          (???? ?????????????????? ???? ?????????? ???? ?????????????????? ????????????????)
        </Text>

        <Select
          transparent={true}
          indicatorIcon={<Icon name="angle-down" color="blue" size={25} />}
          onSelect={(value, label) => {
            setSelectedCourier({ UIDCourier: value, Name: label });
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
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    color: '#828282',
    fontSize: 12,
    marginBottom: 5,
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
    minWidth: 52,
    paddingHorizontal: 4,
    height: 32,
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
