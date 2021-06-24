import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Option, Select} from 'react-native-chooser';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import GoBack from '../../components/Tables/GoBack';
import {makeGetRequest} from '../../dataManegment';
import {RootState} from '../../redux/slices';
import {setPressed} from '../../redux/slices/pressed-slice';
import {handleError, wait} from '../../utils';
import {formatDate} from '../../utils/date';

type courierType = {
  Name: string;
  UIDCourier: string;
};
type timeArray = {
  time: number;
  longRange: string;
  isGreen: string;
  order: string;
  scale: number;
};

type StatisticsType = {
  average: number;
  inTimeArray: timeArray[];
  lateArray: timeArray[];
};

export default function Table9({route, navigation}: any) {
  const dispatch = useDispatch();
  const {pressed} = useSelector((state: RootState) => state.pressedState);
  const {structure} = route.params;
  const {selectedDate, prevDate} = useSelector(
    (state: RootState) => state.dateState,
  );
  const [couriers, setCouriers] = useState<courierType[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<Partial<courierType>>(
    route.params,
  );
  const [statistcs, setStatistics] = useState<Partial<StatisticsType>>({});
  const [refreshing, setRefreshing] = useState(false);

  console.log(JSON.stringify(statistcs));

  useEffect(() => {
    makeGetRequest(`listcouriers/${structure}`)
      .then((res) => setCouriers(res))
      .catch(handleError);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    wait(2000).then(() => setRefreshing(false));
  }, [selectedCourier]);

  function refresh() {
    setStatistics((prev) => ({}));
    makeGetRequest(
      `statisticscourier3/${structure}/${
        selectedCourier.UIDCourier
      }/${formatDate(prevDate)}/${formatDate(selectedDate)}`,
    )
      .then((res) => setStatistics((prev) => res))
      .catch(handleError);
  }

  useEffect(refresh, [selectedCourier]);

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
      <GoBack />
      <View style={styles.container}>
        <Text style={styles.title}>Среднее время возвращения курьера</Text>
        <Select
          transparent={true}
          indicatorIcon={<Icon name="angle-down" color="blue" size={25} />}
          onSelect={(value, label) => {
            setSelectedCourier({Name: label, UIDCourier: value});
          }}
          defaultText={selectedCourier.Name ? selectedCourier.Name : null}
          style={styles.select}
          optionListStyle={{
            backgroundColor: '#FFF',
            height: 300,
            borderRadius: 10,
          }}>
          {couriers.map((el, i) => (
            <Option
              style={{paddingVertical: 10, borderBottomWidth: 1}}
              key={i}
              value={el.UIDCourier}>
              {el.Name}
            </Option>
          ))}
        </Select>
        {statistcs?.average ? (
          <>
            <View style={styles.count}>
              <Text style={{color: '#00B686'}}>
                {statistcs.average || 0} Мин
              </Text>
            </View>
            <View style={{...styles.row, marginVertical: 13}}>
              <View
                style={{
                  width: '50%',
                  alignItems: 'center',
                }}>
                <Text>{percent('inTimeArray')}</Text>

                <View style={styles.count}>
                  <Text style={{color: '#00B686'}}>
                    {statistcs?.inTimeArray?.length || 0}
                  </Text>
                </View>

                {statistcs?.inTimeArray
                  ?.sort((a, b) => b.time - a.time)
                  .map((el, i) => (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Order', {id: el.order});
                        dispatch(setPressed(el.order));
                      }}
                      key={i}
                      style={{width: 145, marginTop: 10}}>
                      <View style={styles.row}>
                        <Text style={styles.placeNumbers}>{el.time} минут</Text>
                        {el.longRange ? (
                          <Icon
                            name="star"
                            color={el.isGreen ? 'green' : 'red'}
                            size={12}
                          />
                        ) : null}

                        {pressed.includes(el.order) ? (
                          <Icon name="eye" color="blue" size={14} />
                        ) : null}
                      </View>
                      <Progress.Bar
                        style={{marginTop: 10}}
                        unfilledColor="#D8D8D8"
                        borderColor="transparent"
                        progress={el.scale}
                        height={5}
                        color="#00B686"
                        width={145}
                      />
                    </TouchableOpacity>
                  ))}
              </View>
              <View
                style={{
                  width: '50%',
                  alignItems: 'center',
                }}>
                <Text>{percent('lateArray')}</Text>

                <View style={styles.count}>
                  <Text style={{color: '#E80054'}}>
                    {statistcs?.lateArray?.length || 0}
                  </Text>
                </View>

                {statistcs.lateArray &&
                  statistcs.lateArray
                    .sort((a, b) => b.time - a.time)
                    .map((el, i) => (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('Order', {id: el.order});
                          dispatch(setPressed(el.order));
                        }}
                        key={i}
                        style={{width: 145, marginTop: 10}}>
                        <View style={styles.row}>
                          <Text style={styles.placeNumbers}>
                            {el.time} минут
                          </Text>
                          {el.longRange ? (
                            <Icon
                              name="star"
                              color={el.isGreen ? 'green' : 'red'}
                              size={12}
                            />
                          ) : null}

                          {pressed.includes(el.order) ? (
                            <Icon name="eye" color="blue" size={14} />
                          ) : null}
                        </View>
                        <Progress.Bar
                          style={{marginTop: 10}}
                          unfilledColor="#D8D8D8"
                          borderColor="transparent"
                          progress={el.scale}
                          height={5}
                          color="#E80054"
                          width={145}
                        />
                      </TouchableOpacity>
                    ))}
              </View>
            </View>
          </>
        ) : (
          <ActivityIndicator color="blue" style={{marginTop: 25}} />
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
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  container: {
    marginTop: 20,
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
    minWidth: 52,
    paddingHorizontal: 4,
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
