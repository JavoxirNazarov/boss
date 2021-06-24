import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Logo from '../assets/Logo';
import {host} from '../constants';
import {Base64} from 'js-base64';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {setUser} from '../redux/slices/user-slice';

export default function Registration() {
  const dispatch = useDispatch();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function auth() {
    let token = Base64.encode(`${login}:${password}`);
    try {
      setLoading(true);
      const response = await fetch(`${host}auth`, {
        headers: {
          Authorization: 'Basic ' + token,
        },
      });
      setLoading(false);
      if (response.status == 403) {
        throw Error('У вас не подходящая роль для входа');
      }
      if (response.status == 401) {
        throw Error('Введены не правильные данные');
      }
      if (!response.ok) {
        throw Error(response.status.toString() + ' ' + response.url);
      }
      if (response.status == 200) {
        const obj = await response.json();
        console.log(obj);

        return {
          token,
          structure: obj.UIDStructure,
          role: obj.type,
          structureName: obj.NameStructure,
        };
      }
    } catch (err) {
      Alert.alert('Ошибка', err.message);
      setLoading(false);
      return false;
    }
  }

  async function setAppUser() {
    if (!login || !password) {
      Alert.alert('', 'Заполните все поля');
      return;
    }

    auth().then((res) => {
      if (res) {
        AsyncStorage.setItem('@user', JSON.stringify(res));
        dispatch(setUser(res));
      }
    });
  }

  return (
    <View style={styles.container}>
      <Logo />

      <TextInput
        style={styles.input}
        placeholder="Ваш логин"
        placeholderTextColor="#A5A5A5"
        onChangeText={setLogin}
        value={login}
      />

      <TextInput
        style={styles.input}
        placeholder="Ваш пароль"
        placeholderTextColor="#A5A5A5"
        onChangeText={setPassword}
        value={password}
        textContentType={'password'}
        secureTextEntry={true}
      />

      <TouchableOpacity onPress={setAppUser} style={styles.btn}>
        {loading ? (
          <ActivityIndicator color="blue" size="small" />
        ) : (
          <Text style={{color: '#fff', fontSize: 18}}>Войти</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    backgroundColor: '#666565',
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#eff319',
    paddingLeft: 10,
    color: '#000000',
  },
  btn: {
    width: '100%',
    height: 40,
    backgroundColor: '#1373e6',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
});
