import React, { useState } from 'react';

// React Native
import { RefreshControl, SafeAreaView, ScrollView, Text } from 'react-native';
import { NAVBAR } from '../../../constants/tailwindcss';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';
import tw from 'twrnc';
import Noise from '../../Noise';

// Firebase
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../store/firebase';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { refreshReduxAsync } from '../../../store/redux/slices/common';
import { selectNoises } from '../../../store/redux/slices/noises';

const noiseBgColors = {
  brown: '#c4a484',
  pink: '#f9a8d4',
  white: '#fff',
};

const noiseDescriptions = {
  white:
    'It contains all frequencies at equal intensity. Sounds like untuned radio or old television static. ',
  pink: 'It is a white noise but with reduced higher frequencies. It is often considered more soothing than white noise.',
  brown:
    'Similar to pink noise but with evenmore reduced higher frequencies. It sounds similar to river or strong wind.',
};

const NoiseGenerator = () => {
  const dispatch = useDispatch();
  const [user, loading, error] = useAuthState(auth);
  const userId = user ? user.uid : null;

  const noises = useSelector(selectNoises);
  const noiseArray = Object.keys(noises).map(
    (noiseColor) => noises[noiseColor]
  );

  // Refresh control
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    dispatch(refreshReduxAsync());
  };

  return (
    <SafeAreaView>
      <FocusAwareStatusBar
        barStyle='light-content'
        backgroundColor={NAVBAR.backgroundColor}
      />
      <ScrollView
        style={tw`m-2`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={tw`mb-5 text-sm text-center font-medium text-gray-700`}>
          Generate noise sounds. There are different{' '}
          <Text style={tw`font-bold italic`}>colors</Text> of noise and each
          impart a different feel.
        </Text>
        {noiseArray.map((noise) => (
          <Noise
            key={noise.color}
            description={noiseDescriptions[noise.color]}
            noise={noise}
            noiseBgColor={noiseBgColors[noise.color]}
            userId={userId}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NoiseGenerator;
