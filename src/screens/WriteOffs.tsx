/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
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
import { makeGetRequest, sendData } from '../dataManegment';
import { RootState } from '../redux/slices';
import { formatDate } from '../utils/date';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { handleError, wait } from '../utils';

type listType = {
  UIDWriteOff: string;
  Number: string;
  Date: string;
  Accepted: boolean;
  BossAccepted: boolean;
  Comment: string;
};

export default function WriteOffs({ route, navigation }: any) {
  const { selectedDate, prevDate } = useSelector(
    (state: RootState) => state.dateState,
  );
  const [list, setList] = useState<listType[]>([]);
  const [fetching, setFetching] = useState(true);
  const { structure } = route.params;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  function refresh() {
    makeGetRequest(
      `writeoffs/${formatDate(prevDate)}/${formatDate(
        selectedDate,
      )}?UIDStructure=${structure}`,
    )
      .then((res) => setList(res))
      .catch(handleError)
      .finally(() => setFetching(false));
  }

  useEffect(refresh, []);

  const accept = (el: listType) => {
    sendData('writeoffs/1/1', {
      UIDWriteOff: el.UIDWriteOff,
      BossAccepted: !el.BossAccepted,
    })
      .then(() => {
        setList((prev) =>
          prev.map((item) => {
            return item.UIDWriteOff === el.UIDWriteOff
              ? { ...item, BossAccepted: !el.BossAccepted }
              : item;
          }),
        );
      })
      .catch(handleError);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={{ width: '100%' }}>
      <LinearGradient
        colors={['#CD4629', '#FF5733']}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 50,
          paddingHorizontal: 20,
        }}>
        <Icon
          onPress={() => navigation.goBack()}
          name="arrow-left"
          size={30}
          color="#fff"
        />
        <Text style={{ color: '#fff', fontSize: 20 }}>Списания</Text>
        <View />
      </LinearGradient>

      {!fetching ? (
        list?.length ? (
          list?.map((el, i) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('WriteOff', { id: el.UIDWriteOff })
              }
              key={i}
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                paddingHorizontal: 5,
                paddingVertical: 10,
                backgroundColor: el.BossAccepted ? '#FFFFFF' : '#e31b3d',
              }}>
              <View
                style={{
                  width: '15%',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}>
                {el.BossAccepted ? (
                  <Icon
                    onPress={() => accept(el)}
                    name="checkbox-marked"
                    size={25}
                    color="#00B686"
                  />
                ) : (
                  <Icon
                    onPress={() => accept(el)}
                    name="checkbox-blank-outline"
                    size={25}
                    color="#00B686"
                  />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.textRow}>
                  <Text>Номер</Text>
                  <Text>{el.Number}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text>Дата</Text>
                  <Text>{el.Date}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text>Коментарий</Text>
                  <Text style={{ width: '50%', textAlign: 'right' }}>
                    {el.Comment || 'не указана'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ alignSelf: 'center', marginTop: 50, fontSize: 18 }}>
            Чеков нет
          </Text>
        )
      ) : (
        <ActivityIndicator color="blue" style={{ marginTop: 50 }} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
