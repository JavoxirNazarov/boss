export interface IStats {
  Advance: number | string;
  AdvanceAmount: number | string;
  Cash: number | string;
  CashAmount: number | string;
  CashCollection: number | string;
  CashCollectionAmount: number | string;
  Click: number | string;
  ClickAmount: number | string;
  DeliveryAmount: number | string;
  DeliverySum: number | string;
  Payme: number | string;
  PaymeAmount: number | string;
  Percent1: number | string;
  Percent2: number | string;
  Summa: number | string;
  Amount: number | string;
  Terminal: number | string;
  TerminalAmount: number | string;
  Without: number | string;
  WithoutAmount: number | string;
  Consumption: number | string;
  ConsumptionAmount: number | string;
  PartnersAmountGreen: number | string;
  PartnersAmountYellow: number | string;
  PartnersSumGreen: number | string;
  PartnersSumYellow: number | string;
  AdvertisingAmount: number | string;
  AdvertisingSum: number | string;
  AllAdvertisingAccepted: boolean;
  AllExpensesAccepted: boolean;
  AllWithoutPaymentAccepted: boolean;
  PenaltiesAmount: number;
  PenaltiesSum: number;
  PitStopsAmount: number;
  PrizesAmount: number;
  PrizesSum: number;
}

export interface IStructures {
  UIDStructure: string;
  Name: string;
}
