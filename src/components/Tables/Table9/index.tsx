import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import Clock from '../../../assets/Clock';
import { makeGetRequest } from '../../../dataManegment';
import { RootState } from '../../../redux/slices';
import { formatDate } from '../../../utils/date';
import { ErrorText, Loader } from '../../Feedbacks';

type infoType = {
  Name: string;
  TimeShift: number;
  TimeMonth: number;
  UIDStructure: string;
};

export default function Table18({ navigation }: any) {
  const { selectedDate, prevDate } = useSelector(
    (state: RootState) => state.dateState,
  );

  const { isLoading, data, isError } = useQuery<infoType[]>(
    ['table-awaittime', selectedDate, prevDate],
    () =>
      makeGetRequest(
        `awaittime/${formatDate(prevDate)}/${formatDate(selectedDate)}`,
      ),
    {},
  );

  function select(el: infoType) {
    navigation.navigate('Nineth', {
      UIDStructure: el.UIDStructure,
      Name: el.Name,
    });
  }

  function minuteToHour(time: number) {
    if (time < 60) return '0:' + time;

    const roundHours = Math.floor(time / 60);
    const minutes = time % 60 < 10 ? '0' + (time % 60) : time % 60;

    return roundHours + ':' + minutes;
  }

  if (isError) return <ErrorText />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Заказы ожидающие курьеров</Text>
      <Clock style={{ marginTop: 20 }} />
      {isLoading && <Loader />}
      {data && (
        <View style={styles.row}>
          {data.map((el, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => select(el)}
              style={{ width: '50%', alignItems: 'center', marginBottom: 15 }}>
              <Text style={styles.text}>{el.Name}</Text>
              <View style={styles.circle}>
                <Text style={styles.text}>{minuteToHour(el.TimeShift)}</Text>
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#E80054',
                    marginVertical: 2,
                  }}
                />
                <Text style={styles.text}>{minuteToHour(el.TimeMonth)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 222,
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
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 24,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333333',
  },
  circle_text: {
    fontSize: 10,
    fontWeight: '500',
    color: '#333333',
  },
  circle: {
    marginTop: 6,
    width: 60,
    height: 60,
    borderRadius: 50,
    borderColor: '#E80054',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
