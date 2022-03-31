import React from 'react';

// React Native
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { NAVBAR } from '../../../constants/tailwindcss';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';

const Dashboard = () => {
  return (
    <SafeAreaView>
      <FocusAwareStatusBar
        barStyle='light-content'
        backgroundColor={NAVBAR.backgroundColor}
      />
      <ScrollView>
        <Text>Dashboard</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
