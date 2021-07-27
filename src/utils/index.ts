import { Alert } from "react-native";

export function addSpace(nums: any) {
  if (nums) {
    let num = nums.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
    return num;
  }
  return '0';
}

export const wait = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};


export const handleError = (err: Error) => {
  Alert.alert('Ошибка', err.message);
}