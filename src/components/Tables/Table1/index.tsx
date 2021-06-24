import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as Progress from 'react-native-progress';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {queryRequest} from '../../../dataManegment';
import {RootState} from '../../../redux/slices';
import {addSpace} from '../../../utils';
import {formatDate} from '../../../utils/date';
import {ErrorText, Loader} from '../../Feedbacks';

type summType = {
  Name: string;
  Percent: number;
  Sum: number;
  UIDStructure: string;
};

export default function Table1({navigation}: any) {
  const {selectedDate, prevDate} = useSelector(
    (state: RootState) => state.dateState,
  );
  const {isLoading, data, refetch, isError} = useQuery<summType[]>(
    'table-allsum',
    () =>
      queryRequest(
        `allsum/${formatDate(prevDate)}/${formatDate(selectedDate)}`,
      ),
    {retry: false},
  );

  useEffect(() => {
    refetch();
  }, [selectedDate, prevDate, refetch]);

  function select(el: summType) {
    navigation.navigate('First', {
      UIDStructure: el.UIDStructure,
      Name: el.Name,
    });
  }

  if (isError) return <ErrorText />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Сумма продаж</Text>
      {isLoading && <Loader />}
      {data && (
        <View style={{...styles.row, marginTop: 50}}>
          {data.map((el, i) => (
            <TouchableOpacity
              onPress={() => select(el)}
              key={i}
              style={{width: 145, marginBottom: 15}}>
              <Text style={styles.placeName}>{el.Name}</Text>
              <View style={styles.row}>
                <Text style={styles.placeNumbers}>{addSpace(el.Sum)} сум</Text>
                <Text style={styles.placeNumbers}>
                  {Math.round(el.Percent * 100)} %
                </Text>
              </View>
              <Progress.Bar
                style={{marginTop: 5}}
                unfilledColor="#D8D8D8"
                borderColor="transparent"
                progress={1 + el.Percent}
                height={5}
                color={el.Percent > 10 ? '#00B686' : '#E80054'}
                width={145}
              />
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
    minHeight: 201,
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
    color: '#333333',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  placeName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 12,
  },
  placeNumbers: {
    fontWeight: '300',
    fontSize: 11.5,
    color: '#506883',
  },
});
