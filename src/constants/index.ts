import { blockNameTypes } from './types';

export const host = __DEV__
  ? 'http://192.168.1.102:85/apex/hs/boss/'
  : 'https://apex.lavina.uz/apex/hs/boss/';

export const blockNames: { graph: blockNameTypes; show: boolean }[] = [
  {
    graph: 'moneyStats',
    show: true,
  },
  {
    graph: 'coockingTime',
    show: true,
  },
  {
    graph: 'deliveryStats',
    show: true,
  },
  {
    graph: 'deliveryCStats',
    show: true,
  },
  {
    graph: 'deliveryCKStats',
    show: true,
  },
  {
    graph: 'deliveryBStats',
    show: true,
  },
  {
    graph: 'freeTime',
    show: true,
  },
  {
    graph: 'workersLate',
    show: true,
  },
  {
    graph: 'awaitTime',
    show: true,
  },
  {
    graph: 'soldPizzaG',
    show: true,
  },
  {
    graph: 'soldPizzaGS',
    show: true,
  },
  {
    graph: 'soldPizzaGY',
    show: true,
  },
  {
    graph: 'soldPizzaGYS',
    show: true,
  },
  {
    graph: 'soldPizzaGW',
    show: true,
  },
];
