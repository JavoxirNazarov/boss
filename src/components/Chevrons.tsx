import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Dispatch, SetStateAction} from 'react';
import {
  Alert,
  PermissionsAndroid,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {DownloadDirectoryPath, writeFile} from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import XLSX from 'xlsx';
import {RootState} from '../redux/slices';
import {setUser} from '../redux/slices/user-slice';
import {formatDate} from '../utils/date';
import useRole from '../utils/useRole';

type chevronProps = {
  step: number;
  length: number;
  goBack: () => void;
  goNext: () => void;
  navigation: any;
};

const Chevrons: React.FC<chevronProps> = ({
  step,
  navigation,
  length,
  goNext,
  goBack,
}) => {
  const dispatch = useDispatch();
  const {isBoss} = useRole();
  const {user} = useSelector((state: RootState) => state.userState);
  const {selectedDate, prevDate} = useSelector(
    (state: RootState) => state.dateState,
  );
  const {selectedStructure} = useSelector(
    (state: RootState) => state.structuresState,
  );

  function logOut() {
    dispatch(setUser(null));
    AsyncStorage.removeItem('@user');
  }

  const download = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Разрешение',
        message: 'Ваш телефон нуждается а разрешениииспользавния памяти.',
        buttonNeutral: 'Напомнить позже',
        buttonNegative: 'Назад',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const res = await fetch(
        `https://apex.lavina.uz/apex/hs/deskorder/reportdinners?UIDStructure=${
          selectedStructure?.UIDStructure
        }&startdate=${formatDate(prevDate)}&enddate=${formatDate(
          selectedDate,
        )}`,
        {
          headers: {
            Authorization: 'Basic ' + user?.token,
          },
        },
      );

      if (!res.ok) {
        Alert.alert('Ошибка ', res.status.toString() + ' ' + res.url);
        return false;
      }

      const data = await res.json();
      let ws = XLSX.utils.json_to_sheet(data);

      let wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Prova');

      const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});
      let file =
        DownloadDirectoryPath +
        `/продажи${formatDate(prevDate)}-${formatDate(selectedDate)}.xlsx`;
      writeFile(file, wbout, 'ascii')
        .then(() => Alert.alert('', 'Сохранено'))
        .catch((e) => console.log(e.message));
    }
  };

  return (
    <View
      style={{
        width: '100%',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
      }}>
      <Text style={{fontSize: 14, color: '#00B686'}} onPress={logOut}>
        Выйти
      </Text>

      <TouchableOpacity onPress={download}>
        <Text style={{color: '#00B686'}}>Скачать продажи</Text>
      </TouchableOpacity>

      {isBoss && (
        <Icon
          onPress={() => navigation.navigate('Settings')}
          name="cog-outline"
          size={25}
          color={'#00B686'}
        />
      )}

      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}>
        <Icon
          name="chevron-left"
          size={50}
          color={step === 0 ? '#ccc' : '#00B686'}
          onPress={goBack}
        />
        <Text style={{fontSize: 14, color: '#333333'}}>
          {step + 1} / {length}
        </Text>
        <Icon
          onPress={goNext}
          name="chevron-right"
          size={50}
          color={step === length - 1 ? '#ccc' : '#00B686'}
        />
      </View>
    </View>
  );
};

export default Chevrons;
