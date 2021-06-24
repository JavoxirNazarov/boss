import React, {useEffect, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Option, Select} from 'react-native-chooser';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {queryRequest} from '../../../dataManegment';
import {RootState} from '../../../redux/slices';
import {selectStructure} from '../../../redux/slices/structures-slice';
import {formatDate} from '../../../utils/date';
import {ErrorText, Loader} from '../../Feedbacks';

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
  sizeArray: number[];
  monthArray: {
    name: string;
    decadeArray: {allDecade: number; array: number[]; percent: number}[];
    count: number;
  }[];
};

export default function T1() {
  const dispatch = useDispatch();
  const {selectedStructure, structures} = useSelector(
    (state: RootState) => state.structuresState,
  );
  const {selectedDate} = useSelector((state: RootState) => state.dateState);

  const {isLoading, refetch, data, isError} = useQuery<infoType>(
    'table-pizzamountstructure',
    () =>
      queryRequest(
        `pizzamountstructure/${selectedStructure?.UIDStructure}/${formatDate(
          selectedDate,
        )}`,
      ),
    {retry: false},
  );

  useEffect(() => {
    refetch();
  }, [selectedDate, selectedStructure, refetch]);

  const prevMonthCount = useMemo(() => {
    return data?.monthArray?.length ? data?.monthArray[0].count : 0;
  }, [data]);

  const currMonthCount = useMemo(() => {
    return data?.monthArray?.length ? data?.monthArray[1].count : 1;
  }, [data]);

  if (isError) return <ErrorText />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Количество проданных пицц по структуре</Text>

      <Select
        transparent={true}
        indicatorIcon={<Icon name="angle-down" color="blue" size={25} />}
        onSelect={(value: any, label: any) => {
          dispatch(selectStructure({Name: label, UIDStructure: value}));
        }}
        defaultText={selectedStructure ? selectedStructure.Name : null}
        style={styles.select}
        optionListStyle={{
          backgroundColor: '#FFF',
          height: 300,
          borderRadius: 10,
        }}>
        {structures.map((el, i) => (
          <Option
            style={{paddingVertical: 10, borderBottomWidth: 1}}
            key={i}
            value={el.UIDStructure}>
            {el.Name}
          </Option>
        ))}
      </Select>

      {isLoading && <Loader />}

      {data && (
        <>
          <View style={styles.blocksRow}>
            <View style={styles.numberBlock}>
              <Text style={{fontSize: 12, color: '#495057'}}>
                {currMonthCount}
              </Text>
            </View>

            <View style={styles.numberBlock}>
              <Text style={{fontSize: 18, color: '#00B686'}}>
                {data.percent}%
              </Text>
            </View>
            <View style={styles.numberBlock}>
              <Text style={{fontSize: 12, color: '#495057'}}>
                {prevMonthCount}
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
              <View key={index} style={{width: '48%'}}>
                {month.decadeArray.map((el, i) => (
                  <View key={i} style={{width: '100%', marginVertical: 10}}>
                    <View style={styles.textRow}>
                      <Text style={{color: '#506883', fontSize: 9}}>
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
                          color: el.percent < 0 ? '#E80054' : 'green',
                          fontSize: 11,
                          fontWeight: '300',
                        }}>
                        {el.percent}%
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
                      {el.array.map((s, n) => (
                        <View
                          key={n}
                          style={{
                            ...styles.progress_item,
                            backgroundColor: colors[n],
                          }}>
                          <Text style={{fontSize: 9, color: '#FFFFFF'}}>
                            {s}
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
          marginVertical: 10,
        }}>
        {data?.sizeArray?.map((el, i) => (
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
            <Text style={{fontSize: 8}}> - {el}</Text>
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
    textAlign: 'center',
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
