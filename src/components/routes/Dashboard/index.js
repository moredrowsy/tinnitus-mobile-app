import React from 'react';

// React Native
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { NAVBAR } from '../../../constants/tailwindcss';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';
import tw from 'twrnc';

const Dashboard = () => {
  return (
    <SafeAreaView>
      <FocusAwareStatusBar
        barStyle='light-content'
        backgroundColor={NAVBAR.backgroundColor}
      />
      <ScrollView style={tw`m-2`}>
        <Text style={tw`font-bold text-lg text-center mb-5`}>
          Welcome to Tinnitus Relief - A Sound Therapy Application
        </Text>
        <Text style={tw`font-bold text-lg text-center text-pink-600`}>
          PLEASE LOWER YOUR VOLUME
        </Text>
        <Text style={tw`font-bold text-lg text-center mb-5 text-pink-600`}>
          BEFORE USING THIS APP TO PROTECT YOUR EARS
        </Text>
        <Text style={tw`mb-2`}>Sound Therapy consists of:</Text>
        <Text style={tw`mb-2`}>
          - ACRN Tonal - Use the tone sound generator to test your tinnitus
          frequency
        </Text>
        <Text style={tw`mb-2`}>
          - ACRN Sequence - The sequence generator shoud be played at your
          tinnitus frequency
        </Text>
        <Text style={tw`mb-2`}>
          - Sounds - Play sounds uploaded by other users for masking your
          tinnitus
        </Text>
        <Text style={tw`mb-2`}>
          - Mixes - Create a combination of sounds for an immersive ambient
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
