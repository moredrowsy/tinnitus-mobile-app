import React from 'react';

// React Native
import { SafeAreaView, Text, View } from 'react-native';
import { NAVBAR } from '../../../constants/tailwindcss';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';

const SoundPost = () => {
  return (
    <SafeAreaView>
      <FocusAwareStatusBar
        barStyle='light-content'
        backgroundColor={NAVBAR.backgroundColor}
      />
      <Text>SoundPost</Text>
    </SafeAreaView>
  );
};

export default SoundPost;
