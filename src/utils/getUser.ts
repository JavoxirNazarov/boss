import AsyncStorage from "@react-native-async-storage/async-storage"

export const getUser = async () => {
  try {
    const value = await AsyncStorage.getItem('@user');
    return value;
  } catch (e) {
    console.log(e);
    return false;
  }
};
