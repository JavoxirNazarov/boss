import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/slices';
import {selectDate, selectDateAll} from '../redux/slices/date-slice';
import {convertDate, startDate} from '../utils/date';
import useRole from '../utils/useRole';

LocaleConfig.locales['fr'] = {
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август ',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthNamesShort: [
    'Янв.',
    'Фев.',
    'Март.',
    'Апр.',
    'Май.',
    'Июнь.',
    'Июль.',
    'Авг.',
    'Сент.',
    'Окт.',
    'Ноя.',
    'Дек.',
  ],
  dayNames: [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ],
  dayNamesShort: ['Воскр.', 'Пон.', 'Втор.', 'Ср.', 'Чет.', 'Пят.', 'Суб.'],
};
LocaleConfig.defaultLocale = 'fr';

export default function DatePicker() {
  const dispatch = useDispatch();
  const {isManager} = useRole();
  const {prevDate, selectedDate} = useSelector(
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
      }}>
      {!isManager && (
        <>
          <TouchableOpacity
            onPress={() => setShowPrevModal(!showPrevModal)}
            style={styles.dateContainer}>
            <Text style={{fontSize: 14, color: '#333333'}}>
              {convertDate(prevDate)}
            </Text>
          </TouchableOpacity>
          <Modal
            fullScreen={false}
            animationType="slide"
            transparent={true}
            visible={showPrevModal}
            onBackdropPress={() => setShowPrevModal(!showPrevModal)}>
            <Calendar
              current={startDate()}
              markedDates={{
                [prevDate]: {selected: true, selectedColor: 'blue'},
              }}
              onDayPress={(day) => {
                dispatch(selectDate({day: day.dateString, type: 'prevDate'}));
                setShowPrevModal(!showPrevModal);
              }}
              monthFormat={'yyyy MMM'}
              hideExtraDays={true}
              disableMonthChange={true}
              firstDay={1}
              hideDayNames={false}
              showWeekNumbers={true}
              onPressArrowLeft={(substractMonth) => substractMonth()}
              onPressArrowRight={(addMonth) => addMonth()}
              disableAllTouchEventsForDisabledDays={true}
              maxDate={selectedDate}
            />
          </Modal>
        </>
      )}

      <Text style={{color: '#00B686', marginTop: 18}}>v_2.2</Text>

      <TouchableOpacity
        onPress={() => showModal(!modal)}
        style={styles.dateContainer}>
        <Text style={{fontSize: 14, color: '#333333'}}>
          {convertDate(selectedDate)}
        </Text>
      </TouchableOpacity>
      <Modal
        fullScreen={false}
        animationType="slide"
        transparent={true}
        visible={modal}
        onBackdropPress={() => showModal(!modal)}>
        <Calendar
          minDate={isManager ? undefined : prevDate}
          current={startDate()}
          markedDates={{
            [selectedDate]: {selected: true, selectedColor: 'blue'},
          }}
          onDayPress={(day) => {
            isManager
              ? dispatch(selectDateAll(day.dateString))
              : dispatch(
                  selectDate({day: day.dateString, type: 'selectedDate'}),
                );
            showModal(!modal);
          }}
          monthFormat={'yyyy MMM'}
          hideExtraDays={true}
          disableMonthChange={true}
          firstDay={1}
          hideDayNames={false}
          showWeekNumbers={true}
          onPressArrowLeft={(substractMonth) => substractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          disableAllTouchEventsForDisabledDays={true}
        />
      </Modal>
      {isManager && <View />}
    </View>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    marginTop: 25,
    width: '40%',
    height: 37,
    backgroundColor: '#FFC700',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
