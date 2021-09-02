import React, { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Option, Select } from 'react-native-chooser';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import DatePicker from '../components/DatePicker';
import GoBack from '../components/Tables/GoBack';
import { makeGetRequest } from '../dataManegment';
import { RootState } from '../redux/slices';
import { wait } from '../utils';
import { formatDate, startDate } from '../utils/date';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useRole from '../utils/useRole';
import QueryWrapper from '../components/QueryWrapper';

type StatisticsType = {
  UIDNomenclature: string;
  Name: string;
  Balance: number;
  MonthExpense: number;
  AverageDayExpense: number;
};

export default function Balance({ navigation }: any) {
  const { isBoss } = useRole();
  const { structures, selectedStructure } = useSelector(
    (state: RootState) => state.structuresState,
  );
  const [structure, setStructure] = useState(selectedStructure?.UIDStructure);
  const [date, setDate] = useState(startDate());
  const [dateModal, setDateModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: statistcs,
    refetch,
    isLoading,
    isError,
  } = useQuery<StatisticsType[]>(
    ['balance', date, structure],
    () =>
      makeGetRequest(
        `balance?Date=${formatDate(date)}&UIDStructure=${structure}`,
      ),
    { enabled: !!structure && !!date },
  );

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    wait(2000).then(() => setRefreshing(false));
  };

  const dateModalShow = () => setDateModal(!dateModal);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.wraper}>
      <GoBack />
      <View style={styles.container}>
        <Text style={styles.title}>Остатки</Text>

        {isBoss && (
          <Icon
            onPress={() => navigation.navigate('Users')}
            name="cog-outline"
            size={25}
            color={'#00B686'}
            style={{ position: 'absolute', top: 14, right: 14 }}
          />
        )}

        <View style={styles.row}>
          <DatePicker
            onDayPress={(day) => {
              setDate(day.dateString);
              dateModalShow();
            }}
            modalVisible={dateModal}
            showModal={dateModalShow}
            showDate={date}
          />

          <Select
            transparent={true}
            indicatorIcon={<Icon name="chevron-down" color="blue" size={25} />}
            onSelect={(value: string) => setStructure(value)}
            defaultText={
              structures?.find((el) => el.UIDStructure === structure)?.Name
            }
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
        </View>

        <QueryWrapper isLoading={isLoading} isError={isError}>
          {statistcs?.map((el, i) => (
            <View
              style={{
                width: '100%',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
              }}
              key={i}>
              <View style={styles.row}>
                <Text>Название</Text>
                <Text>{el.Name}</Text>
              </View>
              <View style={styles.row}>
                <Text>Остатки</Text>
                <Text>{el.Balance}</Text>
              </View>
              <View style={styles.row}>
                <Text>Месячные расходы</Text>
                <Text>{el.MonthExpense}</Text>
              </View>
              <View style={styles.row}>
                <Text>Средний рас. за день</Text>
                <Text>{el.AverageDayExpense}</Text>
              </View>
            </View>
          ))}
        </QueryWrapper>
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
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 15,
    textAlign: 'center',
  },
  container: {
    marginVertical: 20,
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
  },
  select: {
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
    borderWidth: 0,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
