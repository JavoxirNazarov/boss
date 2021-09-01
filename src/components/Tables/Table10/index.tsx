import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { makeGetRequest } from '../../../dataManegment';
import { RootState } from '../../../redux/slices';
import { formatDate } from '../../../utils/date';
import { ErrorText, Loader } from '../../Feedbacks';

const colors = [
  '#FFC700',
  '#6666FF',
  '#00B686',
  '#9457EB',
  '#E80054',
  '#495057',
  '#FFC700',
  '#6666FF',
  '#00B686',
];

type infoType = {
  percent: number;
  currentMonth: number;
  prevMonth: number;
  monthArray: any[];
};

export default function T1() {
  const { selectedDate } = useSelector((state: RootState) => state.dateState);
  const { structures } = useSelector(
    (state: RootState) => state.structuresState,
  );

  const { isLoading, data, isError } = useQuery<infoType>(
    ['table-pizzamount', selectedDate, structures],
    () => makeGetRequest('pizzamount/' + formatDate(selectedDate)),
    {},
  );

  if (isError) return <ErrorText />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Количество проданных пицц </Text>
      {isLoading && <Loader />}

      {data && (
        <>
          <View style={styles.blocksRow}>
            <View style={styles.numberBlock}>
              <Text style={{ fontSize: 12, color: '#495057' }}>
                {data.prevMonth}
              </Text>
            </View>

            <View style={styles.numberBlock}>
              <Text style={{ fontSize: 18, color: '#00B686' }}>
                {data.percent} %
              </Text>
            </View>
            <View style={styles.numberBlock}>
              <Text style={{ fontSize: 12, color: '#495057' }}>
                {data.currentMonth}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            {[...data.monthArray].reverse().map((month, index) => (
              <View key={index} style={{ width: '48%' }}>
                {month.decadeArray.map((el, i) => (
                  <View key={i} style={{ width: '100%', marginVertical: 10 }}>
                    <View style={styles.textRow}>
                      <Text style={{ color: '#506883', fontSize: 9 }}>
                        {month.name}
                      </Text>
                      <Text
                        style={{
                          color: '#506883',
                          fontSize: 11,
                          fontWeight: '300',
                        }}>
                        {i + 1}–декада
                      </Text>
                      <Text
                        style={{
                          color: el.percentDecade < 0 ? '#E80054' : 'green',
                          fontSize: 11,
                          fontWeight: '300',
                        }}>
                        {el.percentDecade}%
                      </Text>
                      <Text
                        style={{
                          color: '#506883',
                          fontSize: 11,
                          fontWeight: '300',
                        }}>
                        {el.allDecade}
                      </Text>
                    </View>
                    <View style={styles.progress}>
                      {el.structuresArray.map((s, n) => (
                        <View
                          key={n}
                          style={{
                            ...styles.progress_item,
                            backgroundColor: colors[n],
                          }}>
                          <Text style={{ fontSize: 9, color: '#FFFFFF' }}>
                            {s.amount}
                          </Text>
                          <Text
                            style={{
                              fontSize: 9,
                              color: s.percentStructure < 0 ? 'red' : 'green',
                            }}>
                            {s.percentStructure}%
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-start',
          marginTop: 30,
        }}>
        {structures.map((el, i) => (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 20,
            }}>
            <View
              style={{
                height: 10,
                width: 10,
                borderRadius: 50,
                backgroundColor: colors[i],
              }}
            />
            <Text style={{ fontSize: 8 }}> - {el.Name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
    fontSize: 16,
    color: '#495057',
  },
  blocksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    marginVertical: 15,
  },
  numberBlock: {
    padding: 10,
    minWidth: 48,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progress: {
    width: '100%',
    height: 15,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progress_item: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
