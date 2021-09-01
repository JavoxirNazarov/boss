import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { RefreshControl, ScrollView } from 'react-native';
// import GestureRecognizer from 'react-native-swipe-gestures';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import Chevrons from '../components/Chevrons';
import DatePickers from '../components/DatePickers';
import MainBlock from '../components/MainBlock';
import Tables from '../components/Tables';
import { blockNames } from '../constants';
import { allowedItem } from '../constants/types';
import { makeGetRequest } from '../dataManegment';
import { setStructuresThunk } from '../redux/thunks/structures-thunk';
import { handleError, wait } from '../utils';
import useRole from '../utils/useRole';
// const {width} = Dimensions.get('screen');

type propType = {
  navigation: any;
};

export default function Main({ navigation }: propType) {
  const query = useQueryClient();
  const [step, setStep] = useState(0);
  const scroll = useRef<null | ScrollView>(null);
  const { isManager } = useRole();
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const [listAllowed, setListAllowed] = useState<allowedItem[]>([]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    query.refetchQueries();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    dispatch(setStructuresThunk());
  }, []);

  useEffect(() => {
    if (isManager) {
      makeGetRequest('mset')
        .then((res) => setListAllowed(res))
        .catch(handleError);
      return;
    }
    setListAllowed(blockNames);
  }, [isManager]);

  const filteredAllowed = useMemo(
    () => listAllowed.filter((el) => el.show),
    [listAllowed],
  );

  const length = useMemo(() => filteredAllowed.length, [filteredAllowed]);

  function goNext() {
    if (step === length - 1) return;
    else setStep(step + 1);
  }

  function goBack() {
    if (step === 0) return;
    else setStep(step - 1);
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ref={(list) => (scroll.current = list)}
      style={{ width: '100%' }}
      contentContainerStyle={{
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}>
      <DatePickers />

      <Chevrons
        length={length}
        step={step}
        goNext={goNext}
        goBack={goBack}
        navigation={navigation}
      />

      {/* <GestureRecognizer
        style={{width, alignItems: 'center', paddingHorizontal: 20}}
        config={{velocityThreshold: 0.3, directionalOffsetThreshold: 80}}
        onSwipeLeft={goNext}
        onSwipeRight={goBack}> */}
      <Tables stepName={filteredAllowed[step]?.graph} navigation={navigation} />
      {/* </GestureRecognizer> */}

      <MainBlock />
    </ScrollView>
  );
}
