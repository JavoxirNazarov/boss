import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { convertDate, startDate } from '../utils/date';
import {
  Calendar,
  DateCallbackHandler,
  LocaleConfig,
} from 'react-native-calendars';

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

interface IProps {
  showModal: () => void;
  showDate: string;
  onDayPress: DateCallbackHandler;
  modalVisible: boolean;
  minDate?: string;
  maxDate?: string;
}

export default function DatePicker({
  showModal,
  showDate,
  onDayPress,
  modalVisible,
  minDate,
  maxDate,
}: IProps) {
  return (
    <>
      <TouchableOpacity onPress={showModal} style={styles.dateContainer}>
        <Text style={{ fontSize: 14, color: '#333333' }}>
          {convertDate(showDate)}
        </Text>
      </TouchableOpacity>
      <Modal
        fullScreen={false}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onBackdropPress={showModal}>
        <Calendar
          minDate={minDate}
          maxDate={maxDate}
          current={startDate()}
          markedDates={{
            [showDate]: { selected: true, selectedColor: 'blue' },
          }}
          onDayPress={onDayPress}
          monthFormat={'yyyy MMM'}
          hideExtraDays={true}
          disableMonthChange={true}
          firstDay={1}
          hideDayNames={false}
          showWeekNumbers={true}
          disableAllTouchEventsForDisabledDays={true}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    width: '40%',
    height: 37,
    backgroundColor: '#FFC700',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
