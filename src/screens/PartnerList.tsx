import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import GoBack from '../components/Tables/GoBack';
import {makeGetRequest} from '../dataManegment';
import {RootState} from '../redux/slices';
import {addSpace, handleError, wait} from '../utils';
import {formatDate} from '../utils/date';
import {Option, Select} from 'react-native-chooser';
import Icon from 'react-native-vector-icons/FontAwesome';

type partnerType = {
  UIDPartner: string;
  Name: string;
};

type listType = {
  Name: string;
  UIDStructure: string;
  Sum: number;
  Amount: number;
};

export default function PartnerList({navigation}: any) {
  const {selectedDate, prevDate} = useSelector(
    (state: RootState) => state.dateState,
  );

  const [partners, setPartners] = useState<partnerType[]>([]);
  const [selected, setSelected] = useState({UIDPartner: '', Name: ''});
  // ========
  const [yellowList, setYellowList] = useState<listType[]>([]);
  const [greenList, setGreenList] = useState<listType[]>([]);

  // =====

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (selected.UIDPartner) refresh();
    else getPartners();
    wait(2000).then(() => setRefreshing(false));
  }, [selected]);

  const getPartners = () => {
    makeGetRequest('partnerlist')
      .then((res: partnerType[]) => {
        setPartners(res);
        setSelected(res[0]);
      })
      .catch(handleError);
  };

  useEffect(getPartners, []);

  function refresh() {
    makeGetRequest(
      `partners/${formatDate(prevDate)}/${formatDate(
        selectedDate,
      )}?UIDPartner=${selected.UIDPartner}&Payment=yellow`,
    )
      .then((res) => setYellowList(res))
      .catch(handleError);

    makeGetRequest(
      `partners/${formatDate(prevDate)}/${formatDate(
        selectedDate,
      )}?UIDPartner=${selected.UIDPartner}&Payment=green`,
    )
      .then((res) => setGreenList(res))
      .catch(handleError);
  }

  useEffect(() => {
    if (selected.UIDPartner) refresh();
  }, [selected]);

  function routeByType(structure: string, color: string) {
    navigation.navigate('Orders', {
      uid: structure,
      type: 'Партнеры ' + selected.Name,
      UIDPartner: selected.UIDPartner,
      color,
    });
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.wraper}>
      <GoBack />

      <TouchableOpacity
        style={{
          width: 150,
          height: 30,
          borderRadius: 5,
          backgroundColor: '#9457EB',
          alignSelf: 'flex-end',
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 10,
        }}>
        <Text style={{color: '#fff', fontSize: 16}}>Акт сверки</Text>
      </TouchableOpacity>

      <Select
        transparent={true}
        indicatorIcon={<Icon name="angle-down" color="blue" size={25} />}
        onSelect={(value: string, label: string) =>
          setSelected({Name: label, UIDPartner: value})
        }
        defaultText={selected.Name}
        style={styles.select}
        optionListStyle={{
          backgroundColor: '#FFF',
          height: 300,
          borderRadius: 10,
        }}>
        {partners.map((el, i) => (
          <Option
            style={{paddingVertical: 10, borderBottomWidth: 1}}
            key={i}
            value={el.UIDPartner}>
            {el.Name}
          </Option>
        ))}
      </Select>

      {greenList.length ? (
        <>
          {greenList.map((gr, i) => {
            const yl = yellowList[i];

            return (
              <View key={i} style={{alignItems: 'center', marginVertical: 15}}>
                <Text
                  style={{marginVertical: 5, fontSize: 19, fontWeight: 'bold'}}>
                  {gr.Name}: {selected.Name}
                </Text>
                <View style={styles.block}>
                  <TouchableOpacity
                    onPress={() => routeByType(gr.UIDStructure, 'green')}
                    style={{...styles.block_half, backgroundColor: 'green'}}>
                    <>
                      <View style={styles.block_circle}>
                        <Text style={styles.block_circle_num}>{gr.Amount}</Text>
                      </View>
                      <Text style={styles.block_sum}>
                        {addSpace(gr.Sum)} сум
                      </Text>
                    </>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => routeByType(yl.UIDStructure, 'yellow')}
                    style={{...styles.block_half, backgroundColor: 'yellow'}}>
                    <>
                      <View style={styles.block_circle}>
                        <Text style={styles.block_circle_num}>{yl.Amount}</Text>
                      </View>
                      <Text style={styles.block_sum}>
                        {addSpace(yl.Sum)} сум
                      </Text>
                    </>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </>
      ) : (
        <ActivityIndicator color="blue" style={{marginTop: 50}} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wraper: {
    flex: 1,
    padding: 10,
  },

  select: {
    marginTop: 10,
    alignSelf: 'center',
    minWidth: 187,
    height: 47,
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 2.22,
    marginBottom: 12,
    borderWidth: 0,
  },
  block: {
    width: '100%',
    height: 110,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  block_half: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100%',
  },
  block_circle: {
    minWidth: 50,
    minHeight: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9457EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  block_circle_num: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '500',
  },

  block_sum: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
