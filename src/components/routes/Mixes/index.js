import React, { useState } from 'react';

// React Native
import { SafeAreaView, View } from 'react-native';
import { NAVBAR } from '../../../constants/tailwindcss';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';
import tw from 'twrnc';
import AddMix from './AddMix';
import MixList from './MixList';

// Firebase
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../store/firebase';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { selectMixes } from '../../../store/redux/slices/mixes';
import { selectSounds } from '../../../store/redux/slices/sounds';
import { selectUsernames } from '../../../store/redux/slices/usernames';

const Mixes = ({ navigation }) => {
  const usernames = useSelector(selectUsernames);
  const [user] = useAuthState(auth);
  const userId = user ? user.uid : null;
  const sounds = useSelector(selectSounds);
  const mixes = useSelector(selectMixes);

  return (
    <SafeAreaView>
      <FocusAwareStatusBar
        barStyle='light-content'
        backgroundColor={NAVBAR.backgroundColor}
      />
      <View style={tw`m-2`}>
        <AddMix navigation={navigation} sounds={sounds} userId={userId} />
        <MixList
          mixes={mixes}
          sounds={sounds}
          userId={userId}
          usernames={usernames}
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
};

export default Mixes;
