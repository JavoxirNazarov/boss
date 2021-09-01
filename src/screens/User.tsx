import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import GoBack from '../components/Tables/GoBack';
import { makeGetRequest, sendData } from '../dataManegment';
import ModalSelector from 'react-native-modal-selector-searchable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface IUserProduct {
  uidProduct: string;
  product: string;
}

export default function User({ route }: any) {
  const { UIDUser } = route.params;
  const [productList, setProductList] = useState<IUserProduct[]>([]);
  const [products, setProducts] = useState<IUserProduct[]>([]);

  useEffect(() => {
    if (UIDUser) {
      makeGetRequest(`users?uidUser=${UIDUser}`)
        .then((res) => {
          setProductList(res);
          return makeGetRequest('products');
        })
        .then((res) => setProducts(res))
        .catch(() => {});
    }

    return () => {
      saveChanges();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToProducts = (item: IUserProduct) => {
    setProductList((prev) => [item, ...prev]);
  };

  const deleteFromProducts = (UID: string) => {
    setProductList((prev) => prev.filter((el) => el.uidProduct !== UID));
  };

  const saveChanges = () => {
    const body = {
      uidUser: UIDUser,
      goods: productList,
    };
    sendData('users', body)
      .then(() => {})
      .catch(() => {});
  };

  return (
    <ScrollView style={styles.wraper}>
      <GoBack />

      <ModalSelector
        keyExtractor={(data) => data.uidProduct}
        labelExtractor={(data) => data.product}
        data={products}
        initValue="Добавить продукт"
        onChange={addToProducts}
        fullHeight
      />

      <View style={styles.container}>
        {productList.length ? (
          productList?.map((el, i) => (
            <View key={i} style={styles.block}>
              <Text>{el.product}</Text>
              <Icon
                onPress={() => deleteFromProducts(el.uidProduct)}
                name="delete-outline"
                size={25}
                color="red"
              />
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Пусто</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wraper: {
    flex: 1,
    padding: 10,
  },
  container: {
    marginVertical: 20,
    width: '100%',
    minHeight: 224,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    padding: 15,
  },
  select: {
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
    borderWidth: 0,
  },
  block: {
    width: '100%',
    minHeight: 78,
    marginVertical: 10,
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
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
