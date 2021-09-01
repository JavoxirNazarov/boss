/**
 * @format
 */
import React from 'react';
import { AppRegistry, LogBox } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import App from './App';
import { name as appName } from './app.json';
import { store } from './src/redux/slices';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
LogBox.ignoreLogs(['Setting a timer']);

const app = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>
  </QueryClientProvider>
);

AppRegistry.registerComponent(appName, () => app);
