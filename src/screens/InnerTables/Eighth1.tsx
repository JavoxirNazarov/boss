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
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import Humans from '../../assets/Humans';
import GoBack from '../../components/Tables/GoBack';
import { makeGetRequest } from '../../dataManegment';
import { RootState } from '../../redux/slices';
import { handleError } from '../../utils';
import { formatDate } from '../../utils/date';

type StatisticsType = {
  UIDPosition: string;
  Name: string;
  lateDay: number;
  lateMonth: number;
};

export default function Table19({ navigation, route }: any) {
  const { structures } = useSelector(
    (state: RootState) => state.structuresState,
  );
  const [structure, setStructure] = useState(route.params);
  const { selectedDate, prevDate } = useSelector(
    (state: RootState) => state.dateState,
  );
  const [statistcs, setStatistics] = useState<StatisticsType[]>([]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, [structure]);

  function refresh() {
    setStatistics((prev) => []);
    if (structure) {
      makeGetRequest(
        `latetimestructure/${structure.UIDStructure}/${formatDate(
          prevDate,
        )}/${formatDate(selectedDate)}`,
      )
        .then((res) => setStatistics((prev) => res))
        .catch(() => {});
    }
  }

  useEffect(refresh, [structure]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.wraper}>
      <GoBack />
      <View style={styles.container}>
        <Text style={styles.title}>Опоздания сотрудников на работу</Text>
        <Humans style={{ marginTop: 20 }} />
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

        {statistcs.length ? (
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                paddingHorizontal: 16,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#506883',
                }}>
                Отделы
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#506883',
                  letterSpacing: 2,
                }}>
                М / Д
              </Text>
            </View>

            {statistcs.map((el, i) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Eighth2', {
                    UIDPosition: el.UIDPosition,
                    Name: el.Name,
                    structure: structure.UIDStructure,
                  })
                }
                key={i}
                style={styles.block}>
                <Text style={{ color: '#506883', fontSize: 14 }}>
                  {el.Name}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.block_circle}>
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}>
                      {el.lateMonth}
                    </Text>
                  </View>
                  <View style={styles.block_circle}>
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}>
                      {el.lateDay}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
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
  container: {
    marginTop: 20,
    width: '100%',
    minHeight: 380,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    height: 35,
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 2.22,
    marginVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  block_circle: {
    borderRadius: 50,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E80054',
    marginHorizontal: 3,
  },
});
