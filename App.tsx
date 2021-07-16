/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import SplashScreen from 'react-native-splash-screen';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from './src/redux/slices';
import {setUser} from './src/redux/slices/user-slice';
import Advances from './src/screens/Advances';
import AdvanceTypes from './src/screens/AdvanceTypes';
import CollectionAndPrize from './src/screens/CollectionAndPrize';
import Deliveries from './src/screens/Deliveries';
import Expense from './src/screens/Expense';
import Eighth1 from './src/screens/InnerTables/Eighth1';
import Eighth2 from './src/screens/InnerTables/Eighth2';
import Fifth1 from './src/screens/InnerTables/Fifth1';
import Fifth2 from './src/screens/InnerTables/Fifth2';
//
import First from './src/screens/InnerTables/First';
import Second1 from './src/screens/InnerTables/Second1';
import Second2 from './src/screens/InnerTables/Second2';
import Fourteenth from './src/screens/InnerTables/Fourteenth';
import Fourth1 from './src/screens/InnerTables/Fourth1';
import Fourth2 from './src/screens/InnerTables/Fourth2';
import Nineth from './src/screens/InnerTables/Nineth';
import Seventh from './src/screens/InnerTables/Seventh';
import Sixth1 from './src/screens/InnerTables/Sixth1';
import Sixth2 from './src/screens/InnerTables/Sixth2';
import Third from './src/screens/InnerTables/Third';
//
import Main from './src/screens/Main';
import Order from './src/screens/Order';
import Orders from './src/screens/Orders';
import PartnerList from './src/screens/PartnerList';
import Payments from './src/screens/Payments';
import Registration from './src/screens/Registration';
import Sales from './src/screens/Sales';
import Section from './src/screens/Section';
import Sections from './src/screens/Sections';
import TypeSales from './src/screens/TypeSales';
import Without from './src/screens/Without';
import {getUser} from './src/utils/getUser';
import Settings from './src/screens/Settings';
import Act from './src/screens/Act';

const Stack = createStackNavigator();

const App: React.FC = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.userState);

  useEffect(() => {
    SplashScreen.hide();
    getUser().then((res) => {
      if (res) {
        FingerprintScanner.isSensorAvailable()
          .then((biometry) => {
            if (biometry !== null && biometry !== undefined) {
              FingerprintScanner.authenticate({
                description:
                  biometry === 'Face ID'
                    ? 'Scan your Face on the device to continue'
                    : 'Scan your Fingerprint on the device scanner',
              })
                .then(() => dispatch(setUser(JSON.parse(res))))
                .catch((err) => console.log('Auth error is: ', err));
            } else {
              console.log('biometric authentication is not available');
            }
          })
          .catch(() => dispatch(setUser(JSON.parse(res))));
      }
    });
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <NavigationContainer>
          <Stack.Navigator headerMode="none">
            {user ? (
              <>
                <Stack.Screen name="Main" component={Main} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="PartnerList" component={PartnerList} />
                <Stack.Screen name="Act" component={Act} />
                <Stack.Screen name="Sales" component={Sales} />
                <Stack.Screen name="Deliveries" component={Deliveries} />
                <Stack.Screen name="TypeSales" component={TypeSales} />
                <Stack.Screen name="AdvanceTypes" component={AdvanceTypes} />
                <Stack.Screen name="Advances" component={Advances} />
                <Stack.Screen name="Expense" component={Expense} />
                <Stack.Screen name="Without" component={Without} />
                <Stack.Screen
                  name="CollectionAndPrize"
                  component={CollectionAndPrize}
                />
                <Stack.Screen name="Payments" component={Payments} />
                <Stack.Screen name="Orders" component={Orders} />
                <Stack.Screen name="Order" component={Order} />

                <Stack.Screen name="Sections" component={Sections} />
                <Stack.Screen name="Section" component={Section} />

                <Stack.Screen name="First" component={First} />
                <Stack.Screen name="Second1" component={Second1} />
                <Stack.Screen name="Second2" component={Second2} />
                <Stack.Screen name="Third" component={Third} />
                <Stack.Screen name="Fourth1" component={Fourth1} />
                <Stack.Screen name="Fourth2" component={Fourth2} />
                <Stack.Screen name="Fifth1" component={Fifth1} />
                <Stack.Screen name="Fifth2" component={Fifth2} />
                <Stack.Screen name="Sixth1" component={Sixth1} />
                <Stack.Screen name="Sixth2" component={Sixth2} />
                <Stack.Screen name="Seventh" component={Seventh} />
                <Stack.Screen name="Eighth1" component={Eighth1} />
                <Stack.Screen name="Eighth2" component={Eighth2} />
                <Stack.Screen name="Nineth" component={Nineth} />
                <Stack.Screen name="Fourteenth" component={Fourteenth} />
              </>
            ) : (
              <Stack.Screen name="Registration" component={Registration} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
};

export default App;
