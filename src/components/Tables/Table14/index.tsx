import React, { useEffect, useMemo } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import Svg from 'react-native-svg';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryTheme,
} from 'victory-native';
import { makeGetRequest } from '../../../dataManegment';
import { RootState } from '../../../redux/slices';
import { formatDate } from '../../../utils/date';
import { ErrorText, Loader } from '../../Feedbacks';
const { width } = Dimensions.get('screen');

type tableType = {
  date: string;
  amount: number;
  dateBack: string;
};

export default function Table141({ navigation }: any) {
  const { selectedDate } = useSelector((state: RootState) => state.dateState);

  const { isLoading, data, isError } = useQuery<tableType[]>(
    ['data-pizzamountweek', selectedDate],
    () => makeGetRequest('pizzamountweek/' + formatDate(selectedDate)),
    {},
  );

  const bars = useMemo(() => {
    return data?.map((el) => ({
      ...el,
      x: el.date,
      y: el.amount,
    }));
  }, [data]);

  if (isError) return <ErrorText />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Количество проданных пицц</Text>

      {isLoading && <Loader />}

      {Platform.OS == 'android' ? (
        <Svg width={width - 40} height={270} style={{ paddingLeft: 20 }}>
          <VictoryChart
            domainPadding={{ x: 10 }}
            height={270}
            theme={VictoryTheme.material}>
            <VictoryAxis
              dependentAxis={true}
              style={{
                grid: { stroke: '#CCCCCC', strokeDasharray: 0 },
                axisLabel: { width: 5 },
              }}
            />
            <VictoryAxis
              style={{
                grid: { stroke: '#CCCCCC', strokeDasharray: 0 },
              }}
            />
            <VictoryBar
              barWidth={30}
              labelComponent={<VictoryLabel dy={20} />}
              style={{
                labels: {
                  fill: '#fff',
                },
                data: { fill: '#495057' },
              }}
              labels={({ datum }) => (datum.y ? datum.y : '')}
              data={bars}
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onPressIn: () => {
                      return [
                        {
                          target: 'data',
                          mutation: ({ datum }) => {
                            if (datum.dateBack) {
                              navigation.navigate('Fourteenth', {
                                date: datum.dateBack,
                              });
                            }
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
            />
          </VictoryChart>
        </Svg>
      ) : (
        <VictoryChart
          domainPadding={{ x: 15 }}
          height={270}
          theme={VictoryTheme.material}>
          <VictoryAxis
            dependentAxis={true}
            style={{
              grid: { stroke: '#CCCCCC', strokeDasharray: 0 },
              axisLabel: { width: 5 },
            }}
          />
          <VictoryAxis
            style={{
              grid: { stroke: '#CCCCCC', strokeDasharray: 0 },
            }}
          />
          <VictoryBar
            barWidth={30}
            labelComponent={<VictoryLabel dy={20} />}
            style={{
              labels: {
                fill: '#fff',
              },
              data: { fill: '#495057' },
            }}
            labels={({ datum }) => (datum.y ? datum.y : '')}
            data={bars}
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onPressIn: () => {
                    return [
                      {
                        target: 'data',
                        mutation: ({ datum }) => {
                          if (datum.dateBack) {
                            navigation.navigate('Fourteenth', {
                              date: datum.dateBack,
                            });
                          }
                        },
                      },
                    ];
                  },
                },
              },
            ]}
          />
        </VictoryChart>
      )}
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
  title: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    textAlign: 'center',
  },
});
