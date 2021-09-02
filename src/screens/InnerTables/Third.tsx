import React, { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
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

export default function Table4({ navigation, route }: any) {
  const { structures } = useSelector(
    (state: RootState) => state.structuresState,
  );
  const { selectedDate, prevDate } = useSelector(
    (state: RootState) => state.dateState,
  );
  const [structure, setStructure] = useState(route.params);
  const [statistics, setStatistics] = useState<Partial<StatisticsType>>({});
  const [refreshing, setRefreshing] = useState(false);

  function refresh() {
    setStatistics((prev) => ({}));
    makeGetRequest(
      `statisticsdelivery/${structure.UIDStructure}/${formatDate(
        prevDate,
      )}/${formatDate(selectedDate)}`,
    )
      .then((res) => setStatistics((prev) => res))
      .catch(() => {});
  }

  console.log(statistics);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, [structure]);

  useEffect(refresh, [structure]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.wraper}>
      <GoBack />
      <View style={styles.container}>
        <Text style={styles.title}>
          Среднее время доставки заказа на текущий день
        </Text>

        <Select
          transparent={true}
          indicatorIcon={<Icon name="angle-down" color="blue" size={25} />}
          onSelect={(value: string, label: string) => {
            setStructure({ Name: label, UIDStructure: value });
          }}
          defaultText={structure.Name}
          style={styles.select}
          optionListStyle={{
            backgroundColor: '#FFF',
            height: 300,
            borderRadius: 10,
          }}>
          {structures.map((el, i) => (
            <Option
              style={{ paddingVertical: 10, borderBottomWidth: 1 }}
              key={i}
              value={el.UIDStructure}>
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
  title: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  wraper: {
    flex: 1,
    padding: 10,
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
