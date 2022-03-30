import React from 'react';

// React Native
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Mixes, MixPost } from '../routes';

const Stack = createStackNavigator();

const MixesStackNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='MixesList' component={Mixes} />
      <Stack.Screen name='MixPost' component={MixPost} />
    </Stack.Navigator>
  );
};

export default MixesStackNavigator;
