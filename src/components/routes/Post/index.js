import React from 'react';

// React Native
import { SafeAreaView, Text, View } from 'react-native';
import { NAVBAR } from '../../../constants/tailwindcss';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';

function Post() {
  return (
    <SafeAreaView>
      <FocusAwareStatusBar
        barStyle='light-content'
        backgroundColor={NAVBAR.backgroundColor}
      />
      <Text>Post</Text>
    </SafeAreaView>
  );
}

export default Post;
