import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import Humans from '../../../assets/Humans';
import {queryRequest} from '../../../dataManegment';
import {RootState} from '../../../redux/slices';
import {formatDate} from '../../../utils/date';
import {ErrorText, Loader} from '../../Feedbacks';

type infoType = {
  Name: string;
  lateDay: number;
  lateMonth: number;
  UIDStructure: string;
};

export default function Table18({navigation}: any) {
  const {selectedDate, prevDate} = useSelector(
    (state: RootState) => state.dateState,
  );
  const {isLoading, data, refetch, isError} = useQuery<infoType[]>(
    `table-latetime`,
    () =>
      queryRequest(
        `latetime/${formatDate(prevDate)}/${formatDate(selectedDate)}`,
      ),
    {retry: false},
  );

  useEffect(() => {
    refetch();
  }, [selectedDate, prevDate, refetch]);

  function select(el: infoType) {
    navigation.navigate('Eighth1', {
      UIDStructure: el.UIDStructure,
      Name: el.Name,
    });
  }

  if (isError) return <ErrorText />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Опоздания сотрудников на работу</Text>
      <Humans style={{marginTop: 20}} />
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
                <Text style={styles.text}>{el.lateMonth}</Text>
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#E80054',
                    marginVertical: 2,
                  }}
                />
                <Text style={styles.text}>{el.lateDay}</Text>
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
  },
  circle: {
    marginTop: 6,
    width: 50,
    height: 50,
    borderRadius: 50,
    borderColor: '#E80054',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
