import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import { ErrorText, Loader } from '../components/Feedbacks';
import { allowedItem } from '../constants/types';
import { sendData, makeGetRequest } from '../dataManegment';
import { wait } from '../utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Settings() {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { isLoading, data, refetch, isError } = useQuery<allowedItem[]>(
    'mset',
    () => makeGetRequest('mset'),
    {},
  );
  const mutation = useMutation<any, unknown, allowedItem, unknown>(
    (newSetting) => sendData('mset', newSetting),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    wait(1000).then(() => setRefreshing(false));
  }, [refetch]);

  if (isError) return <ErrorText />;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={{ width: '100%' }}
      contentContainerStyle={{
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
      }}>
      <Text style={styles.title}>Настройки</Text>
      {isLoading && <Loader />}
      {data &&
        data.map((el, i) => (
          <TouchableOpacity
            onPress={() => {
              const body = { ...el, show: !el.show };
              queryClient.setQueryData<allowedItem[]>('mset', (prev) => {
                return prev.map((item) =>
                  item.graph === el.graph ? body : item,
                );
              });
              mutation.mutate(body, {
                onError: () => refetch(),
              });
            }}
            key={i}
            style={styles.item}>
            <>
              <Text>{i + 1}-График</Text>

              <View>
                {el.show ? (
                  <Icon name="checkbox-marked" size={25} color="#00B686" />
                ) : (
                  <Icon
                    name="checkbox-blank-outline"
                    size={25}
                    color="#00B686"
                  />
                )}
              </View>
            </>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    marginVertical: 5,
  },
  item: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginVertical: 8,
    paddingHorizontal: 10,
  },
});
