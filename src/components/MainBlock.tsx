import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { makeGetRequest } from '../dataManegment';
import { RootState } from '../redux/slices';
import { IStats } from '../types/fetch';
import { formatDate } from '../utils/date';
import AmauntBlock from './AmauntBlock';
import Amount from './Amount';
import DeliveryBlock from './DeliveryBlock';
import { ErrorText, Loader } from './Feedbacks';

export default function MainBlock() {
  const navigation = useNavigation();
  const { selectedDate, prevDate } = useSelector(
    (state: RootState) => state.dateState,
  );

  const {
    isLoading,
    data: stats,
    isError,
  } = useQuery<Partial<IStats>>(
    ['stats', selectedDate, prevDate],
    () =>
      makeGetRequest(
        `getstats?DateStart=${formatDate(prevDate)}&DateEnd=${formatDate(
          selectedDate,
        )}`,
      ),
    { initialData: {}, refetchInterval: 10000 },
  );

  if (isError) return <ErrorText />;

  return (
    <>
      {isLoading && <Loader />}
      <Amount
        Summa={stats?.Summa}
        Amount={stats?.Amount}
        Percent1={stats?.Percent1}
        Without={stats?.Without}
        WithoutAmount={stats?.WithoutAmount}
        Advance={stats?.Advance}
        AdvanceAmount={stats?.AdvanceAmount}
        Consumption={stats?.Consumption}
        ConsumptionAmount={stats?.ConsumptionAmount}
        CashCollection={stats?.CashCollection}
        CashCollectionAmount={stats?.CashCollectionAmount}
        PartnersAmountGreen={stats?.PartnersAmountGreen}
        PartnersAmountYellow={stats?.PartnersAmountYellow}
        PartnersSumGreen={stats?.PartnersSumGreen}
        PartnersSumYellow={stats?.PartnersSumYellow}
        AdvertisingAmount={stats?.AdvertisingAmount}
        AdvertisingSum={stats?.AdvertisingSum}
        AllAdvertisingAccepted={stats?.AllAdvertisingAccepted}
        AllExpensesAccepted={stats?.AllExpensesAccepted}
        AllWithoutPaymentAccepted={stats?.AllWithoutPaymentAccepted}
        PenaltiesAmount={stats?.PenaltiesAmount}
        PenaltiesSum={stats?.PenaltiesSum}
        PrizesAmount={stats?.PrizesAmount}
        PrizesSum={stats?.PrizesSum}
        PitStopsAmount={stats?.PitStopsAmount}
      />
      <DeliveryBlock
        DeliverySum={stats?.DeliverySum}
        DeliveryAmount={stats?.DeliveryAmount}
        Percent2={stats?.Percent2}
        Click={stats?.Click}
        Cash={stats?.Cash}
        CashAmount={stats?.CashAmount}
        ClickAmount={stats?.ClickAmount}
        Payme={stats?.Payme}
        PaymeAmount={stats?.PaymeAmount}
        Terminal={stats?.Terminal}
        TerminalAmount={stats?.TerminalAmount}
      />

      <AmauntBlock
        onPress={() => {
          navigation.navigate('TypeSales', { type: 'Списания' });
        }}
        titleText="Списания"
        amount={stats?.WriteOffAmount}
        withFlag
        collorActive={stats?.AllWriteOffsAccepted}
      />
      <AmauntBlock
        onPress={() => navigation.navigate('Balance')}
        titleText="Остатки"
      />
    </>
  );
}
