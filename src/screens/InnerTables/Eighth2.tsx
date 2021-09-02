import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Option, Select } from 'react-native-chooser';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import Humans from '../../assets/Humans';
import GoBack from '../../components/Tables/GoBack';
import { makeGetRequest } from '../../dataManegment';
import { RootState } from '../../redux/slices';
import { handleError, wait } from '../../utils';
import { formatDate } from '../../utils/date';

type positionType = {
  Name: string;
  UIDPosition: string;
};

type infoType = {
  Name: string;
  UIDEmployee: string;
  lateMonth: number;
  lateDay: number;
};

export default function Table19({ route }: any) {
  const { structure } = route.params;

  const { selectedDate, prevDate } = useSelector(
    (state: RootState) => state.dateState,
  );
  const [info, setInfo] = useState<infoType[]>([]);

  const [positions, setPositions] = useState<positionType[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<
    Partial<positionType>
  >(route.params);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    makeGetRequest(`listposition/${structure}`)
      .then((res) => setPositions(res))
      .catch(() => {});
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, [selectedPosition]);

  function refresh() {
    setInfo((prev) => []);
    makeGetRequest(
      `latetimeposition/${structure}/${
        selectedPosition.UIDPosition
      }/${formatDate(prevDate)}/${formatDate(selectedDate)}`,
    )
      .then((res) => setInfo((prev) => res))
      .catch(() => {});
  }

  useEffect(refresh, [selectedPosition]);

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
          onSelect={(value: any, label: any) => {
            setSelectedPosition({ Name: label, UIDPosition: value });
          }}
          defaultText={selectedPosition.Name ? selectedPosition.Name : null}
          style={styles.select}
          optionListStyle={{
            backgroundColor: '#FFF',
            height: 300,
            borderRadius: 10,
          }}>
          {positions.map((el, i) => (
            <Option
              style={{ paddingVertical: 10, borderBottomWidth: 1 }}
              key={i}
              value={el.UIDPosition}>
              {el.Name}
            </Option>
          ))}
        </Select>

        {info.length ? (
          <View style={styles.block}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#506883',
                }}>
                {selectedPosition.Name}
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

            {info.map((el, i) => (
              <View key={i} style={styles.item}>
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
              </View>
            ))}
          </View>
        ) : (
          <ActivityIndicator color="blue" />
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
    padding: 20,
    borderWidth: 0,
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    height: 35,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
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
    padding: 2,
  },
});
