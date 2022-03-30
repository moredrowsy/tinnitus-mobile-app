import React from 'react';

// React Native
import { SafeAreaView, Text, View } from 'react-native';
import { NAVBAR } from '../../../constants/tailwindcss';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';
import tw from 'twrnc';
import Sound from '../../Sound';

// Firebase
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../store/firebase';

// Redux
import { useSelector } from 'react-redux';
import { selectSounds } from '../../../store/redux/slices/sounds';
import { selectUsernames } from '../../../store/redux/slices/usernames';

const Sounds = ({ navigation }) => {
  const usernames = useSelector(selectUsernames);
  const [user, loading, error] = useAuthState(auth);
  const userId = user ? user.uid : null;
  const sounds = useSelector(selectSounds);
  const soundsArray = Object.keys(sounds)
    .map((key) => sounds[key])
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <SafeAreaView>
      <FocusAwareStatusBar
        barStyle='light-content'
        backgroundColor={NAVBAR.backgroundColor}
      />
      <View style={tw`m-2`}>
        {soundsArray.map((sound) => (
          <Sound
            key={sound.id}
            sound={sound}
            userId={userId}
            usernames={usernames}
            navigation={navigation}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Sounds;
