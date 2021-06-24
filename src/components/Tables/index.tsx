import React from 'react';
import {ActivityIndicator, StyleSheet, Text} from 'react-native';
import CarIcon from '../../assets/Car2';
import MotoBackIcon from '../../assets/MotoBackIcon';
import MotoIcon from '../../assets/MotoIcon';
import {blockNameTypes} from '../../constants/types';
import Table1 from './Table1';
import Table10 from './Table10';
import Table11 from './Table11';
import Table12 from './Table12';
import Table13 from './Table13';
import Table14 from './Table14';
import Table2TO6 from './Table2-6';
import Table7 from './Table7';
import Table8 from './Table8';
import Table9 from './Table9';

type propType = {
  stepName: blockNameTypes;
  navigation: any;
};

export default ({stepName, navigation}: propType) => {
  const Blocks = {
    moneyStats: <Table1 navigation={navigation} />,
    coockingTime: (
      <Table2TO6
        navigation={navigation}
        request="avgtime"
        nestedRoute="Second1">
        <Text style={styles.title}>
          Среднее время приготовления пиццы на текущий день
        </Text>
      </Table2TO6>
    ),
    deliveryStats: (
      <Table2TO6
        navigation={navigation}
        request="avgdelivery"
        nestedRoute="Third">
        <Text style={styles.title}>
          Среднее время доставки заказа на текущий день
        </Text>
        <CarIcon style={{marginTop: 20}} />
      </Table2TO6>
    ),
    deliveryCStats: (
      <Table2TO6
        navigation={navigation}
        request="avgdelivery"
        nestedRoute="Fourth1">
        <Text style={styles.title}>
          Среднее время доставки заказа на текущий день по курьерам
        </Text>
        <MotoIcon style={{marginTop: 20}} />
      </Table2TO6>
    ),
    deliveryCKStats: (
      <Table2TO6
        navigation={navigation}
        request="avgdelivery2"
        nestedRoute="Fifth1">
        <Text style={styles.title}>
          Среднее время доставки заказа на текущий день по курьерам
        </Text>
        <Text style={styles.subtitle}>
          (от получения из кухни до получения клиентом)
        </Text>
        <MotoIcon style={{marginTop: 20}} />
      </Table2TO6>
    ),
    deliveryBStats: (
      <Table2TO6 navigation={navigation} request="avgback" nestedRoute="Sixth1">
        <Text style={styles.title}>Среднее время возвращения курьера</Text>
        <MotoBackIcon style={{marginTop: 20}} />
      </Table2TO6>
    ),
    freeTime: <Table7 navigation={navigation} />,
    workersLate: <Table8 navigation={navigation} />,
    awaitTime: <Table9 navigation={navigation} />,
    soldPizzaG: <Table10 />,
    soldPizzaGS: <Table11 />,
    soldPizzaGY: <Table12 />,
    soldPizzaGYS: <Table13 />,
    soldPizzaGW: <Table14 navigation={navigation} />,
  };

  return Blocks[stepName] ? (
    Blocks[stepName]
  ) : (
    <ActivityIndicator color="blue" style={{marginVertical: 20}} />
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#828282',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
