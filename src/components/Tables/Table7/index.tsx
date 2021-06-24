import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {queryRequest} from '../../../dataManegment';
import {RootState} from '../../../redux/slices';
import {formatDate} from '../../../utils/date';
import {ErrorText, Loader} from '../../Feedbacks';

type infoType = {
  Name: string;
  Time: number;
  UIDStructure: string;
};

export default function Table3({navigation}: any) {
  const {selectedDate, prevDate} = useSelector(
    (state: RootState) => state.dateState,
  );

  const {isLoading, data, isError} = useQuery<infoType[]>(
    `table-freetime`,
    () =>
      queryRequest(
        `freetime/${formatDate(prevDate)}/${formatDate(selectedDate)}`,
      ),
    {retry: false},
  );

  function select(el: infoType) {
    navigation.navigate('Seventh', {
      UIDStructure: el.UIDStructure,
      Name: el.Name,
    });
  }

  if (isError) return <ErrorText />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Свободное время пиццерий</Text>
      {isLoading && <Loader />}
      {data && (
        <View style={styles.row}>
          {data.map((el, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => select(el)}
              style={{width: '50%', alignItems: 'center', marginBottom: 15}}>
              <Text style={styles.text}>{el.Name}</Text>
              <View style={styles.circle}>
                <Text style={styles.text}>{el.Time} ч</Text>
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
    minHeight: 157,
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
    fontSize: 14,
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
    fontSize: 12,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
  },
  circle: {
    marginTop: 6,
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#FFC700',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
