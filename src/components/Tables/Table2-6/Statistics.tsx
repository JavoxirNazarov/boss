/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {StatisticsType, timeArray} from '../../../constants/types';
import {setPressed} from '../../../redux/slices/pressed-slice';
import * as Progress from 'react-native-progress';
import {RootState} from '../../../redux/slices';
import Icon from 'react-native-vector-icons/FontAwesome';

type propsType = {
  statistics: StatisticsType | {};
  navigation: any;
};

export default function Statistics({statistics, navigation}: propsType) {
  function percent(type: string) {
    const summ =
      statistics?.lateArray?.length + statistics?.inTimeArray?.length;

    if (summ) {
      const result = (statistics[type]?.length / summ) * 100;
      return Math.round(result) + '%';
    }

    return '0%';
  }

  return (
    <>
      {statistics?.average ? (
        <>
          <View style={styles.count}>
            <Text style={{color: '#00B686'}}>
              {statistics.average || 0} Мин
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
                  {statistics?.inTimeArray?.length || 0}
                </Text>
              </View>

              {statistics?.inTimeArray
                ?.sort((a, b) => b.time - a.time)
                .map((el, i) => (
                  <PressBar
                    color="#00B686"
                    el={el}
                    navigation={navigation}
                    key={i}
                  />
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
                  {statistics?.lateArray?.length || 0}
                </Text>
              </View>

              {statistics?.lateArray
                ?.sort((a, b) => b.time - a.time)
                ?.map((el, i) => (
                  <PressBar
                    color="#E80054"
                    el={el}
                    navigation={navigation}
                    key={i}
                  />
                ))}
            </View>
          </View>
        </>
      ) : (
        <ActivityIndicator color="blue" style={{marginTop: 25}} />
      )}
    </>
  );
}

const PressBar = ({
  color,
  navigation,
  el,
}: {
  color: string;
  navigation: any;
  el: timeArray;
}) => {
  const dispatch = useDispatch();
  const {pressed} = useSelector((state: RootState) => state.pressedState);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Order', {id: el.order});
        dispatch(setPressed(el.order));
      }}
      style={{width: 150, marginTop: 10}}>
      <View style={styles.row}>
        <Text style={styles.placeNumbers}>{el.time} минут</Text>
        <Text style={styles.placeNumbers}>
          <Text
            style={{
              color: el.detailedTime.coock.isGreen ? 'green' : 'red',
            }}>
            {el.detailedTime.coock.time}
          </Text>
          /
          <Text
            style={{
              color: el.detailedTime.wait.isGreen ? 'green' : 'red',
            }}>
            {el.detailedTime.wait.time}
          </Text>
          /
          <Text
            style={{
              color: el.detailedTime.delivery.isGreen ? 'green' : 'red',
            }}>
            {el.detailedTime.delivery.time}
          </Text>
          /
          <Text
            style={{
              color: el.detailedTime.back.isGreen ? 'green' : 'red',
            }}>
            {el.detailedTime.back.time}
          </Text>
        </Text>
        {el.longRange ? (
          <Icon name="star" color={el.isGreen ? 'green' : 'red'} size={12} />
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
        color={color}
        width={150}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  count: {
    marginVertical: 3,
    padding: 3,
    minWidth: 52,
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
