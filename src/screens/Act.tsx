import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { makeGetRequest } from '../dataManegment';
import { RootState } from '../redux/slices';
import { formatDate } from '../utils/date';
import XLSX from 'xlsx';
import { DownloadDirectoryPath, writeFile } from 'react-native-fs';
import { handleError } from '../utils';
import GoBack from '../components/Tables/GoBack';

type ActType = {
  UIDPartner: string;
  Partner: string;
  StringArray: {
    Филиал: string;
    Процент: number;
    Реализация: number;
    Доход: number;
    Нал: number;
    Payme: number;
    Разница: number;
  }[];
};

export default function Act() {
  const { selectedDate, prevDate } = useSelector(
    (state: RootState) => state.dateState,
  );
  const [act, setAct] = useState<ActType[]>([]);

  useEffect(() => {
    makeGetRequest(
      `reconciliation/${formatDate(prevDate)}/${formatDate(selectedDate)}`,
    )
      .then((data) => setAct(data))
      .catch(() => {});
  }, []);

  const download = async () => {
    const filePath = `${DownloadDirectoryPath}/Акт-сверки${formatDate(
      prevDate,
    )}-${formatDate(selectedDate)}.xlsx`;

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
      var wb = XLSX.utils.book_new();
      act.forEach((el) => {
        wb.SheetNames.push(el.Partner);
        var ws = XLSX.utils.json_to_sheet(el.StringArray);
        ws.G2.s = {
          fill: {
            bgColor: { rgb: ws.G2.v > 0 ? '#16F75A' : '#F71616' }, // Add background color
          },
        };
        wb.Sheets[el.Partner] = ws;
      });

      const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });

      writeFile(filePath, wbout, 'ascii')
        .then(() => Alert.alert('', 'Сохранено'))
        .catch(() => {});
    }
  };

  return (
    <ScrollView style={styles.wraper}>
      <GoBack />

      <TouchableOpacity onPress={download} style={styles.downloadBtn}>
        <Text style={{ color: '#fff', fontSize: 16 }}>Скачать</Text>
      </TouchableOpacity>

      {act.length ? (
        act.map((el, i) => (
          <View key={i} style={{ alignItems: 'center', marginVertical: 15 }}>
            <Text style={{ marginVertical: 5, fontSize: 16 }}>
              {el.Partner}
            </Text>

            <View style={styles.block}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 5,
                  borderBottomWidth: 1,
                }}>
                <Text style={styles.tableText}>Филиал</Text>
                <Text style={styles.tableText}>Процент</Text>
                <Text style={styles.tableText}>Реализация</Text>
                <Text style={styles.tableText}>Доход</Text>
                <Text style={styles.tableText}>Нал</Text>
                <Text style={styles.tableText}>Payme</Text>
                <Text style={styles.tableText}>Разница</Text>
              </View>
              {el.StringArray.map((table, idx) => (
                <View
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 7,
                  }}>
                  <Text style={styles.tableText}>{table.Филиал}</Text>
                  <Text style={styles.tableText}>{table.Процент}</Text>
                  <Text style={styles.tableText}>{table.Реализация}</Text>
                  <Text style={styles.tableText}>{table.Доход}</Text>
                  <Text style={styles.tableText}>{table.Нал}</Text>
                  <Text style={styles.tableText}>{table.Payme}</Text>
                  <Text
                    style={{
                      ...styles.tableText,
                      color: table.Разница > 0 ? 'green' : 'red',
                    }}>
                    {table.Разница}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))
      ) : (
        <ActivityIndicator color="blue" style={{ marginTop: 50 }} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wraper: {
    flex: 1,
    padding: 10,
  },
  downloadBtn: {
    width: 150,
    height: 30,
    borderRadius: 5,
    backgroundColor: '#9457EB',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  block: {
    marginVertical: 10,
    borderRadius: 4,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-evenly',
    paddingHorizontal: 5,
  },
  tableText: {
    fontSize: 9,
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
