import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Option, Select } from 'react-native-chooser';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
} from 'victory-native';
import { makeGetRequest } from '../../../dataManegment';
import { RootState } from '../../../redux/slices';
import { selectStructure } from '../../../redux/slices/structures-slice';
import { formatDate } from '../../../utils/date';
import { ErrorText, Loader } from '../../Feedbacks';

type statistcsType = {
  allYear: number;
  sizesArray?: number[];
  monthsArray: {
    date: string;
    percent?: number;
    amountArray?: number[];
    amountSum: number;
  }[];
};

export default function T1() {
  const dispatch = useDispatch();
  const { selectedStructure, structures } = useSelector(
    (state: RootState) => state.structuresState,
  );
  const { selectedDate } = useSelector((state: RootState) => state.dateState);
  const { isLoading, data, isError } = useQuery<statistcsType>(
    ['table-pizzayearstructure', selectedStructure, selectedDate],
    () =>
      makeGetRequest(
        `pizzayearstructure/${selectedStructure?.UIDStructure}/${formatDate(
          selectedDate,
        )}`,
      ),
    {},
  );

  const bars = useMemo(() => {
    return (
      data?.monthsArray?.map((el) => ({
        x: el.date,
        y: el.amountSum,
      })) || []
    );
  }, [data]);

  if (isError) return <ErrorText />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Количество проданных пицц </Text>
      <Select
        transparent={true}
        indicatorIcon={<Icon name="angle-down" color="blue" size={25} />}
        onSelect={(value: string, label: string) => {
          dispatch(selectStructure({ Name: label, UIDStructure: value }));
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
            style={{ paddingVertical: 10, borderBottomWidth: 1 }}
            key={i}
            value={el.UIDStructure}>
            {el.Name}
          </Option>
        ))}
      </Select>

      {isLoading && <Loader />}

      {!!bars.length && (
        <ScrollView horizontal>
          <VictoryChart height={240} width={600} domainPadding={{ x: 10 }}>
            <VictoryAxis
              domainPadding={{ x: 10 }}
              dependentAxis={true}
              style={{
                axis: { stroke: 'transparent' },
                grid: { stroke: '#CCCCCC', strokeDasharray: 0 },
              }}
            />
            <VictoryAxis
              style={{
                tickLabels: {
                  angle: 45,
                },
                grid: { stroke: '#CCCCCC', strokeDasharray: 0 },
              }}
            />

            <VictoryBar
              style={{
                data: { fill: '#6666FF' },
              }}
              labelComponent={<VictoryLabel textAnchor="middle" />}
              labels={({ datum }) => datum.y}
              data={bars}
            />
          </VictoryChart>
        </ScrollView>
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
    borderWidth: 0,
  },
  title: {
    fontSize: 16,
    color: '#495057',
  },
});
