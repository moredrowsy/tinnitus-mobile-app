import React, { useState } from 'react';

// React Native
import { RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import { NAVBAR } from '../../../constants/tailwindcss';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';
import tw from 'twrnc';
import Sound from '../../Sound';

// Firebase
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../store/firebase';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { refreshReduxAsync } from '../../../store/redux/slices/common';
import { selectSounds } from '../../../store/redux/slices/sounds';
import { selectUsernames } from '../../../store/redux/slices/usernames';

const Sounds = ({ navigation }) => {
  const dispatch = useDispatch();
  const usernames = useSelector(selectUsernames);
  const [user, loading, error] = useAuthState(auth);
  const userId = user ? user.uid : null;
  const sounds = useSelector(selectSounds);
  const soundsArray = Object.keys(sounds)
    .map((key) => sounds[key])
    .sort((a, b) => b.timestamp - a.timestamp);

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
        {soundsArray.map((sound) => (
          <Sound
            key={sound.id}
            sound={sound}
            userId={userId}
            usernames={usernames}
            navigation={navigation}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Sounds;
