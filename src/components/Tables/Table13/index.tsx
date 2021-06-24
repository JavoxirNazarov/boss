import React, {useEffect, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Option, Select} from 'react-native-chooser';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryStack,
  VictoryTheme,
} from 'victory-native';
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

type statistcsType = {
  allYear: number;
  sizesArray: number[];
  monthsArray: {
    date: string;
    percent: number;
    amountArray: number[];
  }[];
};

export default function T1() {
  const dispatch = useDispatch();
  const {selectedStructure, structures} = useSelector(
    (state: RootState) => state.structuresState,
  );
  const {selectedDate} = useSelector((state: RootState) => state.dateState);
  const {isLoading, data, refetch, isError} = useQuery<statistcsType>(
    'table-pizzayearstructure',
    () =>
      queryRequest(
        `pizzayearstructure/${selectedStructure?.UIDStructure}/${formatDate(
          selectedDate,
        )}`,
      ),
    {retry: false},
  );

  useEffect(() => {
    refetch();
  }, [selectedStructure, selectedDate, refetch]);

  const bars = useMemo(() => {
    let arr = [];

    if (data?.sizesArray) {
      for (let i = 0; i < data.sizesArray.length; i++) {
        const inner = data.monthsArray?.map((el) => ({
          x: el.date,
          y: el.amountArray[i],
          percent: el.percent,
        }));
        arr.push(inner);
      }
    }
    return arr;
  }, [data]);

  if (isError) return <ErrorText />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Количество проданных пицц </Text>
      <Select
        transparent={true}
        indicatorIcon={<Icon name="angle-down" color="blue" size={25} />}
        onSelect={(value: string, label: string) => {
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

      {!!bars.length && (
        <View style={{paddingLeft: 30}}>
          <VictoryChart height={240} theme={VictoryTheme.material}>
            <VictoryAxis
              domainPadding={{x: 10}}
              // tickFormat={(x) => ``}
              dependentAxis={true}
              style={{
                axis: {stroke: 'transparent'},
                grid: {stroke: '#CCCCCC', strokeDasharray: 0},
              }}
            />
            <VictoryAxis
              style={{
                tickLabels: {
                  angle: 45,
                },
                grid: {stroke: '#CCCCCC', strokeDasharray: 0},
              }}
            />

            <VictoryStack colorScale={colors}>
              {bars?.map((el, i) => (
                <VictoryBar
                  labelComponent={
                    <VictoryLabel
                      angle={-90}
                      dx={-16}
                      dy={5}
                      textAnchor="middle"
                    />
                  }
                  labels={({datum}) => (datum.y ? datum.y : '')}
                  events={[
                    {
                      target: 'data',
                      eventHandlers: {
                        onPressIn: () => {
                          return [
                            {
                              target: 'data',
                              mutation: (props) => {
                                console.log(props);
                              },
                            },
                          ];
                        },
                      },
                    },
                  ]}
                  key={i}
                  style={{
                    labels: {
                      fill: '#fff',
                    },
                  }}
                  data={el}
                />
              ))}
            </VictoryStack>
          </VictoryChart>
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-start',
          marginVertical: 10,
        }}>
        {data?.sizesArray?.map((el, i) => (
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
    minHeight: 203,
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
  title: {
    fontSize: 16,
    color: '#495057',
  },
});
