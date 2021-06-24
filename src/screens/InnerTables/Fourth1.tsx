import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Option, Select} from 'react-native-chooser';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import GoBack from '../../components/Tables/GoBack';
import {makeGetRequest} from '../../dataManegment';
import {RootState} from '../../redux/slices';
import {handleError, wait} from '../../utils';
import {formatDate} from '../../utils/date';

type StatisticsType = {
  all: number;
  data: {
    UIDCourier: string;
    deliveryCount: number;
    isGreen: number;
    name: string;
    average: number;
  }[];
};

export default function Table8({navigation, route}: any) {
  const {structures} = useSelector((state: RootState) => state.structuresState);
  const {selectedDate, prevDate} = useSelector(
    (state: RootState) => state.dateState,
  );

  const [structure, setStructure] = useState(route.params);

  const [statistcs, setStatistics] = useState<Partial<StatisticsType>>({});
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, [structure]);

  function refresh() {
    setStatistics((prev) => ({}));
    makeGetRequest(
      `listcouriers1/${structure.UIDStructure}/${formatDate(
        prevDate,
      )}/${formatDate(selectedDate)}`,
    )
      .then((res) => setStatistics((prev) => res))
      .catch(handleError);
  }

  useEffect(refresh, [structure]);

  function separator(summ: number, number: number) {
    if (summ) {
      return number / summ;
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
        <Text style={styles.title}>
          Среднее время доставки заказа на текущий день по курьерам
        </Text>
        <Select
          transparent={true}
          indicatorIcon={<Icon name="angle-down" color="blue" size={25} />}
          onSelect={(value: any, label: any) => {
            setStructure({Name: label, UIDStructure: value});
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
              style={{paddingVertical: 10, borderBottomWidth: 1}}
              key={i}
              value={el.UIDStructure}>
              {el.Name}
            </Option>
          ))}
        </Select>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            marginVertical: 15,
          }}>
          {statistcs.all == undefined ? (
            <ActivityIndicator color="blue" />
          ) : (
            <View style={styles.count}>
              <Text style={{color: '#00B686'}}>{statistcs.all} Шт</Text>
            </View>
          )}

          {statistcs?.data
            ?.sort((a, b) => b.deliveryCount - a.deliveryCount)
            .map((el, i) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Fourth2', {
                    UIDCourier: el.UIDCourier,
                    Name: el.name,
                    structure: structure.UIDStructure,
                  })
                }
                key={i}
                style={{width: 300, marginTop: 15}}>
                <View style={styles.row}>
                  <Text style={styles.placeNumbers}>{el.name}</Text>
                  <Text style={{...styles.placeNumbers, textAlign: 'center'}}>
                    {el.average} Мин
                  </Text>
                  <Text style={{...styles.placeNumbers, textAlign: 'right'}}>
                    {el.deliveryCount} Шт
                  </Text>
                </View>
                <Progress.Bar
                  style={{marginTop: 10}}
                  unfilledColor="#D8D8D8"
                  borderColor="transparent"
                  progress={separator(statistcs.all, el.deliveryCount)}
                  height={5}
                  color={el.isGreen ? '#00B686' : '#E80054'}
                  width={300}
                />
              </TouchableOpacity>
            ))}
        </View>
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
    flex: 1,
  },
});
