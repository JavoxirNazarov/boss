import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/slices';
import { selectDate, selectDateAll } from '../redux/slices/date-slice';
import useRole from '../utils/useRole';
import DatePicker from './DatePicker';

export default function DatePickers() {
  const dispatch = useDispatch();
  const { isManager } = useRole();
  const { prevDate, selectedDate } = useSelector(
    (state: RootState) => state.dateState,
  );
  const [showPrevModal, setShowPrevModal] = useState(false);
  const [modal, showModal] = useState(false);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginTop: 25,
      }}>
      {!isManager && (
        <DatePicker
          showModal={() => setShowPrevModal(!showPrevModal)}
          showDate={prevDate}
          onDayPress={(day) => {
            dispatch(selectDate({ day: day.dateString, type: 'prevDate' }));
            setShowPrevModal(!showPrevModal);
          }}
          modalVisible={showPrevModal}
          maxDate={selectedDate}
        />
      )}

      <Text style={{ color: '#00B686' }}>v_2.2</Text>

      <DatePicker
        showModal={() => showModal(!modal)}
        showDate={selectedDate}
        onDayPress={(day) => {
          isManager
            ? dispatch(selectDateAll(day.dateString))
            : dispatch(
                selectDate({ day: day.dateString, type: 'selectedDate' }),
              );
          showModal(!modal);
        }}
        modalVisible={modal}
        minDate={isManager ? undefined : prevDate}
      />

      {isManager && <View />}
    </View>
  );
}
