import React, {useEffect, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
} from 'victory-native';
import {queryRequest} from '../../../dataManegment';
import {RootState} from '../../../redux/slices';
import {formatDate} from '../../../utils/date';
import {ErrorText, Loader} from '../../Feedbacks';

type infoType = {
  allYear: number;
  monthsArray: {date: string; amount: number; percent: number}[];
};

export default function T1() {
  const {selectedDate} = useSelector((state: RootState) => state.dateState);

  const {isLoading, data, isError, refetch} = useQuery<infoType>(
    `table-pizzayear`,
    () => queryRequest('pizzayear/' + formatDate(selectedDate)),
    {retry: false},
  );

  useEffect(() => {
    refetch();
  }, [selectedDate, refetch]);

  const statistics = useMemo(() => {
    return data?.monthsArray?.map((el) => ({
      ...el,
      x: el.date,
      y: el.amount,
    }));
  }, [data]);

  if (isError) return <ErrorText />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>График всех проданных пицц </Text>

      {isLoading && <Loader />}

      {data && (
        <View style={{paddingLeft: 30}}>
          <VictoryChart height={270} theme={VictoryTheme.material}>
            <VictoryAxis
              dependentAxis={true}
              style={{
                axis: {stroke: 'transparent'},
                grid: {stroke: '#CCCCCC', strokeDasharray: 0},
                axisLabel: {width: 5},
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

            <VictoryBar
              style={{
                labels: {
                  fill: ({datum}) => (datum.percent > 0 ? 'green' : 'red'),
                },
                data: {fill: '#6666FF'},
              }}
              labels={({datum}) => (datum.percent ? datum.percent + '%' : '')}
              data={statistics}
            />
          </VictoryChart>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 250,
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
});
