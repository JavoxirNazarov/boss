import React, {useEffect, useState} from 'react';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {makeGetRequest, queryRequest} from '../dataManegment';
import {RootState} from '../redux/slices';
import {IStats} from '../types/fetch';
import {formatDate} from '../utils/date';
import useRole from '../utils/useRole';
import Amount from './Amount';
import DeliveryBlock from './DeliveryBlock';
import {ErrorText, Loader} from './Feedbacks';
import Restaurants from './Restaurants';

export default function MainBlock({scroll}: any) {
  const {isBoss} = useRole();
  const {selectedDate, prevDate} = useSelector(
    (state: RootState) => state.dateState,
  );
  const [localStructure, setLoacalStructure] = useState('');

  const {isLoading, data: stats, refetch, isError} = useQuery<Partial<IStats>>(
    'stats',
    () =>
      queryRequest(
        `getstats?${
          localStructure ? 'UIDStructure=' + localStructure : ''
        }&DateStart=${formatDate(prevDate)}&DateEnd=${formatDate(
          selectedDate,
        )}`,
      ),
    {retry: false, initialData: {}, refetchInterval: 10000},
  );

  useEffect(() => {
    refetch();
  }, [selectedDate, localStructure, prevDate]);

  if (isError) return <ErrorText />;

  return (
    <>
      {isLoading && <Loader />}
      <Amount
        Summa={stats.Summa}
        Amount={stats.Amount}
        Percent1={stats.Percent1}
        Without={stats.Without}
        WithoutAmount={stats.WithoutAmount}
        Advance={stats.Advance}
        AdvanceAmount={stats.AdvanceAmount}
        Consumption={stats.Consumption}
        ConsumptionAmount={stats.ConsumptionAmount}
        CashCollection={stats.CashCollection}
        CashCollectionAmount={stats.CashCollectionAmount}
        PartnersAmountGreen={stats.PartnersAmountGreen}
        PartnersAmountYellow={stats.PartnersAmountYellow}
        PartnersSumGreen={stats.PartnersSumGreen}
        PartnersSumYellow={stats.PartnersSumYellow}
        AdvertisingAmount={stats.AdvertisingAmount}
        AdvertisingSum={stats.AdvertisingSum}
        AllAdvertisingAccepted={stats.AllAdvertisingAccepted}
        AllExpensesAccepted={stats.AllExpensesAccepted}
        AllWithoutPaymentAccepted={stats.AllWithoutPaymentAccepted}
      />
      <DeliveryBlock
        DeliverySum={stats.DeliverySum}
        DeliveryAmount={stats.DeliveryAmount}
        Percent2={stats.Percent2}
        Click={stats.Click}
        Cash={stats.Cash}
        CashAmount={stats.CashAmount}
        ClickAmount={stats.ClickAmount}
        Payme={stats.Payme}
        PaymeAmount={stats.PaymeAmount}
        Terminal={stats.Terminal}
        TerminalAmount={stats.TerminalAmount}
      />

      {isBoss && (
        <Restaurants
          scroll={scroll}
          localStructure={localStructure}
          setLoacalStructure={setLoacalStructure}
        />
      )}
    </>
  );
}
