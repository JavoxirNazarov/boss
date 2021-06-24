import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Option, Select} from 'react-native-chooser';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import GoBack from '../../components/Tables/GoBack';
import {makeGetRequest} from '../../dataManegment';
import {RootState} from '../../redux/slices';
import {addSpace, handleError, wait} from '../../utils';
import {formatDate} from '../../utils/date';
import useRole from '../../utils/useRole';

type StatisticsType = {
  Advance: number;
  AllExpense: number;
  AllIncome: number;
  Cash: number;
  CashCollection: number;
  Click: number;
  OtherExpenses: number;
  Payme: number;
  Terminal: number;
  WithoutPayment: number;
};

export default function First({route}: any) {
  const {isBoss} = useRole();
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
    makeGetRequest(
      `statisticsmoney/${structure.UIDStructure}/${formatDate(
        prevDate,
      )}/${formatDate(selectedDate)}`,
    )
      .then((res) => setStatistics(res))
      .catch(handleError);
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
        <Text style={styles.title}>Сумма продаж</Text>
        {isBoss && (
          <Select
            transparent={true}
            indicatorIcon={<Icon name="angle-down" color="blue" size={25} />}
            onSelect={(value: string, label: string) => {
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
                style={{
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                }}
                key={i}
                value={el.UIDStructure}>
                {el.Name}
              </Option>
            ))}
          </Select>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{alignItems: 'center'}}>
            <View style={{...styles.block, borderTopWidth: 0}}>
              <Text style={{fontSize: 13, color: '#333333', fontWeight: '900'}}>
                Приходы
              </Text>
            </View>
            <View style={styles.block}>
              <Text style={{fontSize: 13, color: '#333333'}}>Наличные</Text>
              <Text style={{fontSize: 13, color: '#00B686'}}>
                {addSpace(statistcs.Cash)} сум
              </Text>
            </View>
            <View style={styles.block}>
              <Text style={{fontSize: 13, color: '#333333'}}>Терминал</Text>
              <Text style={{fontSize: 13, color: '#00B686'}}>
                {addSpace(statistcs.Terminal)} сум
              </Text>
            </View>
            <View style={styles.block}>
              <Text style={{fontSize: 13, color: '#333333'}}>PayMe</Text>
              <Text style={{fontSize: 13, color: '#00B686'}}>
                {addSpace(statistcs.Payme)} сум
              </Text>
            </View>
            <View style={styles.block}>
              <Text style={{fontSize: 13, color: '#333333'}}>Click</Text>
              <Text style={{fontSize: 13, color: '#00B686'}}>
                {addSpace(statistcs.Click)} сум
              </Text>
            </View>
            <View style={styles.block}>
              <Text style={{fontSize: 13, color: '#333333'}}>Инкассация</Text>
              <Text style={{fontSize: 13, color: '#00B686'}}>
                {addSpace(statistcs.CashCollection)} сум
              </Text>
            </View>
            <View style={styles.block}>
              <Text
                style={{fontSize: 13, color: '#333333', fontWeight: 'bold'}}>
                Всего
              </Text>
              <Text style={{fontSize: 13, color: '#00B686'}}>
                {addSpace(statistcs.AllIncome)} сум
              </Text>
            </View>
          </View>
          <View style={{height: '88%', width: 1, backgroundColor: '#BDBDBD'}} />
          <View style={{alignItems: 'center'}}>
            <View style={{...styles.block, borderTopWidth: 0}}>
              <Text style={{fontSize: 13, color: '#333333', fontWeight: '900'}}>
                Расходы
              </Text>
            </View>
            <View style={styles.block}>
              <Text style={{fontSize: 13, color: '#333333'}}>Без оплаты</Text>
              <Text style={{fontSize: 13, color: '#E80054'}}>
                {addSpace(statistcs.WithoutPayment)} сум
              </Text>
            </View>
            <View style={styles.block}>
              <Text style={{fontSize: 13, color: '#333333'}}>
                Прочие расходы
              </Text>
              <Text style={{fontSize: 13, color: '#E80054'}}>
                {addSpace(statistcs.OtherExpenses)} сум
              </Text>
            </View>
            <View style={styles.block}>
              <Text style={{fontSize: 13, color: '#333333'}}>Авансы</Text>
              <Text style={{fontSize: 13, color: '#E80054'}}>
                {addSpace(statistcs.Advance)} сум
              </Text>
            </View>
            <View style={styles.block} />
            <View style={styles.block} />
            <View style={styles.block}>
              <Text
                style={{fontSize: 13, color: '#333333', fontWeight: 'bold'}}>
                Всего
              </Text>
              <Text style={{fontSize: 13, color: '#E80054'}}>
                {addSpace(statistcs.AllExpense)} сум
              </Text>
            </View>
          </View>
        </View>
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
    width: '100%',
    minHeight: 390,
    marginVertical: 20,
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
  title: {
    fontSize: 18,
    marginVertical: 10,
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
    marginBottom: 13,
    borderWidth: 0,
  },
  block: {
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopColor: '#BDBDBD',
    height: 42,
    width: 140,
    borderTopWidth: 1,
  },
});
