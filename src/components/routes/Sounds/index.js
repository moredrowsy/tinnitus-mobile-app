import React from 'react';

// React Native
import { SafeAreaView, Text, View } from 'react-native';
import { NAVBAR } from '../../../constants/tailwindcss';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';

function Sounds() {
  return (
    <SafeAreaView>
      <FocusAwareStatusBar
        barStyle='light-content'
        backgroundColor={NAVBAR.backgroundColor}
      />
      <Text>Sounds</Text>
    </SafeAreaView>
  );
}

export default Sounds;
