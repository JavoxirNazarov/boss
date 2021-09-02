import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Option, Select } from 'react-native-chooser';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { VictoryArea, VictoryAxis, VictoryChart } from 'victory-native';
import GoBack from '../../components/Tables/GoBack';
import { makeGetRequest } from '../../dataManegment';
import { RootState } from '../../redux/slices';
import { handleError, wait } from '../../utils';
import { formatDate } from '../../utils/date';
const { width } = Dimensions.get('screen');

type graphType = {
  hour: string;
  time: number;
};

export default function Table17({ route }: any) {
  const { structures } = useSelector(
    (state: RootState) => state.structuresState,
  );
  const [structure, setStructure] = useState(route.params);
  const { selectedDate } = useSelector((state: RootState) => state.dateState);
  const [graph, setGraph] = useState<graphType[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, [structure]);

  function refresh() {
    makeGetRequest(
      `awaittimegraph/${structure.UIDStructure}/${formatDate(selectedDate)}`,
    )
      .then((res) => setGraph(res))
      .catch(() => {});
  }

  useEffect(refresh, [structure]);

  function tick(t: number) {
    if (t < 60) return t + ' мин';
    else {
      const hour = Math.floor(t / 60);
      const minut = t % 60 < 10 ? '0' + (t % 60) : t % 60;
      return hour + ':' + minut + ' час';
    }
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.wraper}>
      <GoBack />
      <View style={styles.container}>
        <Text style={styles.title}>Заказы ожидающие курьеров</Text>
        <Select
          transparent={true}
          indicatorIcon={<Icon name="angle-down" color="blue" size={25} />}
          onSelect={(value, label) => {
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

        {graph.length ? (
          <ScrollView
            horizontal
            style={{
              width: '100%',
            }}>
            <View style={{ marginLeft: 10 }}>
              <VictoryChart
                width={graph.length > 20 ? graph.length * 22 : width + 50}>
                <VictoryAxis
                  tickFormat={(t) => tick(t)}
                  dependentAxis={true}
                  style={{
                    grid: { stroke: '#CCCCCC', strokeDasharray: 0 },
                    ticks: { padding: -9 },
                    tickLabels: { fontSize: 11 },
                  }}
                />
                <VictoryAxis
                  tickFormat={(t) => `${t[3]}${t[4]}.\n${t[6]}${t[7]}`}
                  style={{
                    grid: { stroke: '#CCCCCC', strokeDasharray: 0 },
                    ticks: { padding: 2 },
                  }}
                />
                <VictoryArea
                  style={{
                    data: { fill: 'rgba(32, 0, 232, 0.19)' },
                  }}
                  data={graph}
                  x="hour"
                  y="time"
                />
              </VictoryChart>
            </View>
          </ScrollView>
        ) : (
          <ActivityIndicator color="blue" style={{ marginTop: 40 }} />
        )}
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
    marginVertical: 10,
    textAlign: 'center',
  },
  container: {
    width: '100%',
    minHeight: 441,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    shadowColor: '#000',
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
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
  block: {
    paddingHorizontal: 15,
    marginTop: 10,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 46,
    width: '90%',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  text: {
    fontSize: 14,
    color: '#333333',
  },
});
