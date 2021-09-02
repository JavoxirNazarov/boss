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
import { Option, Select } from 'react-native-chooser';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import GoBack from '../../components/Tables/GoBack';
import { makeGetRequest } from '../../dataManegment';
import { RootState } from '../../redux/slices';
import { clearPressed, setPressed } from '../../redux/slices/pressed-slice';
import { wait } from '../../utils';
import { formatDate } from '../../utils/date';

type timeArray = {
  cookCount: number;
  time: number;
  count: number;
  order: string;
  scale: number;
  isWaiter: string;
};

type StatisticsType = {
  inTimeArray: timeArray[];
  lateArray: timeArray[];
  average: number;
};

export default function Table({ navigation, route }: any) {
  const dispatch = useDispatch();
  const { structures } = useSelector(
    (state: RootState) => state.structuresState,
  );
  const { selectedDate, prevDate } = useSelector(
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
      `statisticstime/${structure.UIDStructure}/${formatDate(
        prevDate,
      )}/${formatDate(selectedDate)}`,
    )
      .then((res) => setStatistics((prev) => res))
      .catch(() => {});
  }

  useEffect(refresh, [structure]);

  function percent(type: string) {
    const summ = statistcs?.lateArray?.length + statistcs?.inTimeArray?.length;

    if (summ) {
      const result = (statistcs[type]?.length / summ) * 100;

      return Math.round(result) + '%';
    } else return '0%';
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.wraper}>
      <GoBack onPress={() => dispatch(clearPressed())} />

      <View style={styles.container}>
        <Text style={styles.title}>
          Среднее время приготовления пиццы на текущий день
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

        {statistcs?.average ? (
          <>
            <View style={styles.count}>
              <Text style={{ color: '#00B686' }}>{statistcs.average} Мин</Text>
            </View>
            <View
              style={{
                ...styles.row,
                marginVertical: 13,
              }}>
              <View
                style={{
                  width: '50%',
                  alignItems: 'center',
                }}>
                <Text>{percent('inTimeArray')}</Text>
                <View style={styles.count}>
                  <Text style={{ color: '#00B686' }}>
                    {statistcs?.inTimeArray?.length || 0}
                  </Text>
                </View>

                {statistcs?.inTimeArray
                  ?.sort((a, b) => b.time - a.time)
                  .map((el, i) => (
                    <PressBar el={el} navigation={navigation} color="#00B686" />
                  ))}
              </View>
              <View
                style={{
                  width: '50%',
                  alignItems: 'center',
                }}>
                <Text>{percent('lateArray')}</Text>
                <View style={styles.count}>
                  <Text style={{ color: '#E80054' }}>
                    {statistcs?.lateArray?.length || 0}
                  </Text>
                </View>

                {statistcs?.lateArray
                  ?.sort((a, b) => b.time - a.time)
                  .map((el, i) => (
                    <PressBar el={el} navigation={navigation} color="#E80054" />
                  ))}
              </View>
            </View>
          </>
        ) : (
          <ActivityIndicator style={{ marginTop: 20 }} color="blue" />
        )}
      </View>
    </ScrollView>
  );
}

const PressBar = ({
  color,
  navigation,
  el,
}: {
  color: string;
  navigation: any;
  el: timeArray;
}) => {
  const dispatch = useDispatch();
  const { pressed } = useSelector((state: RootState) => state.pressedState);

  return (
    <TouchableOpacity
      onPress={() => {
        if (el.cookCount > 1) {
          navigation.navigate('Second2', { id: el.order });
        } else {
          navigation.navigate('Order', { id: el.order });
        }
        dispatch(setPressed(el.order));
      }}
      style={{
        width: 150,
        marginTop: 10,
      }}>
      <View style={styles.row}>
        <Text style={styles.placeNumbers}>{el.time} минут</Text>
        {el.isWaiter ? <Icon name="star" color="green" size={12} /> : null}
        {pressed.includes(el.order) ? (
          <Icon name="eye" color="blue" size={14} />
        ) : null}
        <Text style={styles.placeNumbers}>{el.cookCount}</Text>

        <Text style={styles.placeNumbers}>{el.count}</Text>
      </View>
      <Progress.Bar
        style={{ marginTop: 10 }}
        unfilledColor="#D8D8D8"
        borderColor="transparent"
        progress={el.scale}
        height={5}
        color={color}
        width={150}
      />
    </TouchableOpacity>
  );
};

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
    width: '100%',
    minHeight: 224,
    marginTop: 20,
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
