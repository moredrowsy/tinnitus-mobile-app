import React from 'react';

// React Native
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Sounds, SoundPost } from '../routes';

const Stack = createStackNavigator();

const SoundStackNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='SoundsList' component={Sounds} />
      <Stack.Screen name='SoundPost' component={SoundPost} />
    </Stack.Navigator>
  );
};

export default SoundStackNavigator;
