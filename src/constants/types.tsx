export type timeArray = {
  time: number;
  order: string;
  scale: number;
  longRange: string;
  isGreen: string;
  detailedTime: {
    coock: {time: 0; isGreen: boolean};
    delivery: {time: 0; isGreen: boolean};
    wait: {time: 0; isGreen: boolean};
    back: {time: 0; isGreen: boolean};
  };
};

export type StatisticsType = {
  inTimeArray: timeArray[];
  lateArray: timeArray[];
  average: number;
};

export type blockNameTypes =
  | 'moneyStats'
  | 'coockingTime'
  | 'deliveryStats'
  | 'deliveryCStats'
  | 'deliveryCKStats'
  | 'deliveryBStats'
  | 'freeTime'
  | 'workersLate'
  | 'awaitTime'
  | 'soldPizzaG'
  | 'soldPizzaGS'
  | 'soldPizzaGY'
  | 'soldPizzaGYS'
  | 'soldPizzaGW';

export type allowedItem = {
  graph: blockNameTypes;
  show: boolean;
};
