import { host } from "../constants";
import { handleError } from "../utils";
import { getUser } from "../utils/getUser";

export async function makeGetRequest(reqName: string) {
  try {
    const store = await getUser();
    const user = store ? JSON.parse(store) : {};

    const response = await fetch(`${host}${reqName}`, {
      headers: {
        Authorization: 'Basic ' + user.token,
      },
    });
    if (!response.ok) {
      if (response.status === 500) {
        const text = await response.text();
        throw Error('при подключении к ' + response.url + ' ' + text);
      }
      throw Error(
        'при подключении к ' + response.url + ', получено ' + response.status,
      );
    }

    const text = await response.text();
    const correcting = text
      .replace(/\\n/g, '\\n')
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, '\\&')
      .replace(/\\r/g, '\\r')
      .replace(/\\t/g, '\\t')
      .replace(/\\b/g, '\\b')
      .replace(/\\f/g, '\\f')
      .replace(/[\u0000-\u0019]+/g, '');
    const data = JSON.parse(correcting);
    return data;
  } catch (err) {
    throw Error(err.message);
  }
}

export async function sendData(reqName: string, body: any) {
  try {
    const store = await getUser();
    const user = store ? JSON.parse(store) : {};

    const response = await fetch(`${host}${reqName}`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + user.token,
        'Content-Type': 'multipart/form-data',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      if (response.status == 500) {
        const text = await response.text();
        throw Error('при подключении к ' + response.url + '' + text);
      }
      throw Error(
        'при подключении к ' + response.url + ', получено ' + response.status
      );
    }
    const data = response.json();
    return data;
  } catch (err) {
    throw Error(err.message);
  }
}

export const queryRequest = (params: string) => {
  console.log(params);

  return makeGetRequest(params)
    .then((res) => res)
    .catch((err) => {
      handleError(err);
      throw Error(err);
    });
};

export const queryPost = (params: string, body: any) => {
  return sendData(params, body)
    .then((res) => res)
    .catch((err) => {
      handleError(err);
      throw Error(err);
    });
};
