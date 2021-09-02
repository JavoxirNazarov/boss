import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Progress from 'react-native-progress';
import GoBack from '../../components/Tables/GoBack';
import { makeGetRequest } from '../../dataManegment';
import { handleError } from '../../utils';

type timeArray = { goods: string[]; scale: number; time: number };

type StatisticsType = {
  inTimeArray: timeArray[];
  lateArray: timeArray[];
  average: number;
  all: number;
};

export default function Table({ navigation, route }: any) {
  const { id } = route.params;
  const [statistcs, setStatistics] = useState<Partial<StatisticsType>>({});

  useEffect(() => {
    makeGetRequest(`longorderdetail/${id}`)
      .then((res) => setStatistics(res))
      .catch(() => {});
  }, []);

  function percent(type: string) {
    const summ = statistcs?.lateArray?.length + statistcs?.inTimeArray?.length;

    if (summ) {
      const result = (statistcs[type]?.length / summ) * 100;

      return Math.round(result) + '%';
    } else return '0%';
  }

  return (
    <ScrollView style={styles.wraper}>
      <GoBack clear={false} />

      <View style={styles.container}>
        <Text style={styles.title}>
          Среднее время приготовления пиццы на текущий день
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Order', { id })}
          style={{
            padding: 7,
            backgroundColor: '#506883',
            borderRadius: 5,
            marginVertical: 8,
          }}>
          <Text style={{ fontSize: 15, color: '#fff' }}>Посмотреть чек</Text>
        </TouchableOpacity>

        {statistcs?.average ? (
          <>
            <View style={styles.count}>
              <Text style={{ color: '#00B686' }}>{statistcs.average} Мин</Text>
            </View>
            <View
              style={{
                ...styles.row,
                marginVertical: 13,
              }}>
              <View
                style={{
                  width: '50%',
                  alignItems: 'center',
                }}>
                <Text>{percent('inTimeArray')}</Text>
                <View style={styles.count}>
                  <Text style={{ color: '#00B686' }}>
                    {statistcs?.inTimeArray?.length || 0}
                  </Text>
                </View>

                {statistcs?.inTimeArray
                  ?.sort((a, b) => b.time - a.time)
                  .map((el, i) => (
                    <Bar color="#00B686" el={el} key={i} />
                  ))}
              </View>
              <View
                style={{
                  width: '50%',
                  alignItems: 'center',
                }}>
                <Text>{percent('lateArray')}</Text>
                <View style={styles.count}>
                  <Text style={{ color: '#E80054' }}>
                    {statistcs?.lateArray?.length || 0}
                  </Text>
                </View>

                {statistcs?.lateArray
                  ?.sort((a, b) => b.time - a.time)
                  .map((el, i) => (
                    <Bar color="#E80054" el={el} key={i} />
                  ))}
              </View>
            </View>
          </>
        ) : (
          <ActivityIndicator style={{ marginTop: 20 }} color="blue" />
        )}
      </View>
    </ScrollView>
  );
}

const Bar = ({ el, color }: { el: timeArray; color: string }) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(!visible)}
        style={{
          width: 150,
          marginTop: 10,
        }}>
        <View style={styles.row}>
          <Text style={styles.placeNumbers}>{el.time} минут</Text>
        </View>
        <Progress.Bar
          style={{ marginTop: 10 }}
          unfilledColor="#D8D8D8"
          borderColor="transparent"
          progress={el.scale}
          height={5}
          color={color}
          width={150}
        />
      </TouchableOpacity>
      {visible &&
        el.goods.map((g, i) => (
          <Text style={{ marginVertical: 4 }} key={i}>
            {g}
          </Text>
        ))}
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 16,
    marginVertical: 10,
  },
  wraper: {
    flex: 1,
    padding: 10,
  },
  container: {
    width: '100%',
    minHeight: 224,
    marginTop: 20,
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
