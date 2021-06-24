import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import restaurant from '../assets/restaurant.png';
import {LineChart} from 'react-native-svg-charts';
import {Circle, G} from 'react-native-svg';
import * as shape from 'd3-shape';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/slices';
import {formatDate} from '../utils/date';
import {makeGetRequest} from '../dataManegment';
import {addSpace, handleError} from '../utils';

type salesType = {
  Amount: number;
  Name: string;
  Percent: number;
  Sum: number;
  UIDStructure: string;
};

export default function Restaurants({
  localStructure,
  setLoacalStructure,
  scroll,
}: any) {
  const {selectedDate, prevDate} = useSelector(
    (state: RootState) => state.dateState,
  );
  const [sales, setSales] = useState<salesType[]>([]);

  useEffect(() => {
    makeGetRequest(
      `getsales/${formatDate(prevDate)}/${formatDate(selectedDate)}`,
    )
      .then((res) => setSales(res))
      .catch(handleError);
  }, [selectedDate, prevDate]);

  const data = [
    {
      data: [1, 4, 3, 4, 1],
      svg: {stroke: '#E80054', strokeWidth: 2},
    },
    {
      data: [1, 2.2, 4, 1.7, 1],
      svg: {stroke: '#00B686', strokeWidth: 2},
    },
  ];
  return (
    <>
      <Text style={styles.title}>Рестораны</Text>
      {sales.map((el, i) => (
        <ImageBackground
          style={{width: '100%', height: 113, marginBottom: 10}}
          source={restaurant}
          key={i}>
          <TouchableOpacity
            style={styles.block}
            onPress={() => {
              if (el.UIDStructure == localStructure) setLoacalStructure('');
              else setLoacalStructure(el.UIDStructure);
              scroll.current?.scrollTo({y: 300});
            }}>
            <View
              style={{
                ...styles.overlay,
                backgroundColor:
                  el.UIDStructure == localStructure
                    ? 'rgba(0, 0, 0, 0.7)'
                    : 'rgba(0, 0, 0, 0.3)',
              }}
            />

            <View style={{height: '100%', justifyContent: 'space-evenly'}}>
              <Text style={styles.name}>{el.Name}</Text>
              <Text style={styles.statistic}>
                {el.Amount} — {el.Percent} %
              </Text>
              <Text style={styles.statistic}>{addSpace(el.Sum)} сум</Text>
            </View>

            <View style={{height: '100%', width: '50%'}}>
              <LineChart
                style={{height: '100%'}}
                data={data}
                contentInset={{top: 20, bottom: 20, right: 5, left: 5}}
                curve={shape.curveNatural}>
                {data.map((el, i) => (
                  <Decorator key={i} el={el} />
                ))}
              </LineChart>
            </View>
          </TouchableOpacity>
        </ImageBackground>
      ))}
    </>
  );
}

const Decorator = ({x, y, el}: any) => {
  return (
    <G>
      {el.data.map((_: number, index: number) => {
        return (
          <Circle
            key={index}
            x={x(index)}
            y={y(_)}
            r={3}
            stroke="#FFFFFF"
            fill="#FFFFFF"
          />
        );
      })}
    </G>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginTop: 40,
  },
  block: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: 113,
    top: 0,
    left: 0,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statistic: {
    color: '#FFC700',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
