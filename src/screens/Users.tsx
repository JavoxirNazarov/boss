import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from 'react-query';
import QueryWrapper from '../components/QueryWrapper';
import GoBack from '../components/Tables/GoBack';
import { makeGetRequest } from '../dataManegment';
import { wait } from '../utils';

export default function Users({ navigation }: any) {
  const [refreshing, setRefreshing] = useState(false);

  const { data, refetch, isLoading, isError } = useQuery<
    { uidUser: string; user: string }[]
  >('users', () => makeGetRequest('users'));

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    wait(2000).then(() => setRefreshing(false));
  };

  console.log(data);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.wraper}>
      <GoBack />

      <QueryWrapper isLoading={isLoading} isError={isError}>
        {data?.map((user, i) => (
          <TouchableOpacity
            key={i}
            onPress={() =>
              navigation.navigate('User', { UIDUser: user.uidUser })
            }
            style={styles.block}>
            <Text>{user.user}</Text>
          </TouchableOpacity>
        ))}
      </QueryWrapper>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wraper: {
    flex: 1,
    padding: 10,
  },
  block: {
    width: '100%',
    height: 78,
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
