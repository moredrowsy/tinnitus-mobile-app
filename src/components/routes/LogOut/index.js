import React, { useEffect } from 'react';

// React Native
import { SafeAreaView, Text, View } from 'react-native';
import { NAVBAR } from '../../../constants/tailwindcss';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';

// Firebase
import { signOut } from 'firebase/auth';
import { auth } from '../../../store/firebase';

const LogOut = () => {
  useEffect(() => {
    signOut(auth);
  });

  return (
    <SafeAreaView>
      <FocusAwareStatusBar
        barStyle='light-content'
        backgroundColor={NAVBAR.backgroundColor}
      />
      <Text>LogOut</Text>
    </SafeAreaView>
  );
};

export default LogOut;
