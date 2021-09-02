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
import { makeGetRequest } from '../dataManegment';
import { RootState } from '../redux/slices';
import { formatDate } from '../utils/date';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { addSpace, handleError, wait } from '../utils';

type ordersType = { branchName: string; sum: number; UIDBranch: string };

export default function Sections({ route, navigation }: any) {
  const { selectedDate, prevDate } = useSelector(
    (state: RootState) => state.dateState,
  );
  const [sections, setSections] = useState<ordersType[]>([]);
  const [loading, setLoading] = useState(true);
  const { uid, structureName } = route.params;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  function refresh() {
    makeGetRequest(
      `branchsales/${formatDate(prevDate)}/${formatDate(selectedDate)}${
        uid ? '?UIDStructure=' + uid : ''
      }
      `,
    )
      .then((res) => setSections(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }
  useEffect(refresh, []);

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
        <Text style={{ color: '#fff', fontSize: 20 }}>
          {!uid && 'Все '}Отделы {structureName && `: ${structureName}`}
        </Text>
        <View></View>
      </LinearGradient>

      {!loading ? (
        <>
          {sections.length ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {sections.map((el, i) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Section', {
                      branchName: el.branchName,
                      UIDBranch: el.UIDBranch,
                      structure: uid,
                    })
                  }
                  key={i}
                  style={{
                    width: '50%',
                    height: 150,
                    borderWidth: 0.3,
                    justifyContent: 'space-evenly',
                    padding: 5,
                  }}>
                  <Text style={{ fontSize: 22 }}>{addSpace(el.sum)}</Text>

                  <Text style={{ fontSize: 18 }}>{el.branchName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={{ alignSelf: 'center', marginTop: 50, fontSize: 18 }}>
              Чеков нет
            </Text>
          )}
        </>
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
