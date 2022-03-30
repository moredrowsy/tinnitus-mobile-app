import React from 'react';

// React Native
import { View, Text } from 'react-native';
import DrawerHeader from './DrawerHeader';
import SoundStackNavigator from './SoundStackNavigator';
import {
  Dashboard,
  LogOut,
  Mixes,
  NoiseGenerator,
  Profile,
  SignIn,
  SignUp,
  Sounds,
} from '../routes';

// React Native Navigation
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getHeaderTitle } from '@react-navigation/elements';
import { NavigationContainer } from '@react-navigation/native';
const Drawer = createDrawerNavigator();

import { NAVBAR } from '../../constants/tailwindcss';

const DrawerNavigator = ({ user }) => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerType='front'
        initialRouteName='SignIn'
        screenOptions={{
          drawerActiveBackgroundColor: NAVBAR.activeBackgroundColor,
          drawerActiveTintColor: NAVBAR.activeColor,
          drawerInactiveBackgroundColor: NAVBAR.backgroundColor,
          drawerInactiveTintColor: NAVBAR.color,
          drawerItemStyle: { borderRadius: 6 },
          drawerLabelStyle: {
            fontWeight: NAVBAR.fontWeight,
            fontFamily: NAVBAR.fontFamily,
            fontSize: NAVBAR.fontSize,
          },
          drawerStyle: { backgroundColor: NAVBAR.backgroundColor },
          drawerType: 'front',

          header: ({ navigation, route, options }) => {
            const title = getHeaderTitle(options, route.name);

            return (
              <DrawerHeader
                navigation={navigation}
                route={route}
                style={options.headerStyle}
                title={title}
                user={user}
              />
            );
          },
          headerStyle: {
            backgroundColor: NAVBAR.backgroundColor,
          },
          headerTitleStyle: {
            color: NAVBAR.color,
            fontFamily: NAVBAR.fontFamily,
          },
          headerTintColor: NAVBAR.color,
        }}
        backBehavior='history'
      >
        <Drawer.Screen name='Dashboard' component={Dashboard} />
        <Drawer.Screen name='Noise' component={NoiseGenerator} />
        <Drawer.Screen name='Sounds' component={SoundStackNavigator} />
        <Drawer.Screen name='Mixes' component={Mixes} />
        {user ? (
          <>
            <Drawer.Screen key='Profile' name='Profile' component={Profile} />
            <Drawer.Screen key='LogOut' name='Log Out' component={LogOut} />
          </>
        ) : (
          <>
            <Drawer.Screen key='SignIn' name='Login' component={SignIn} />
            <Drawer.Screen key='SignUp' name='Sign Up' component={SignUp} />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerNavigator;
