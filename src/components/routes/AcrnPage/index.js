import React, { useEffect } from 'react';

// React Native
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { NAVBAR } from '../../../constants/tailwindcss';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';
import tw from 'twrnc';
import Acrn from '../../Acrn';

// Redux
import { useDispatch } from 'react-redux';
import { setAcrn } from '../../../store/redux/slices/acrns';

import { ACRN } from '../../../constants';

const AcrnPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAcrn({ type: ACRN.type.tone, acrn: { status: 'stopped' } }));
    dispatch(
      setAcrn({ type: ACRN.type.sequence, acrn: { status: 'stopped' } })
    );
  }, []);

  return (
    <SafeAreaView>
      <FocusAwareStatusBar
        barStyle='light-content'
        backgroundColor={NAVBAR.backgroundColor}
      />
      <ScrollView>
        <View style={tw`flex-row justify-center items-center m-2`}>
          <Text style={tw`font-bold`}>A</Text>
          <Text>coustic </Text>
          <Text style={tw`font-bold`}>C</Text>
          <Text>oordinated </Text>
          <Text style={tw`font-bold`}>R</Text>
          <Text>eset </Text>
          <Text style={tw`font-bold`}>N</Text>
          <Text>euromodulation</Text>
        </View>
        <View style={tw`m-2`}>
          <Acrn />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AcrnPage;
