import React from 'react';

// React Native
import { SafeAreaView, Text, View } from 'react-native';
import { NAVBAR } from '../../../constants/tailwindcss';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';
import tw from 'twrnc';
import Sound from '../../Sound';

// Redux
import { useSelector } from 'react-redux';
import { selectSounds } from '../../../store/redux/slices/sounds';

const Sounds = () => {
  const sounds = useSelector(selectSounds);
  const soundsArray = Object.keys(sounds)
    .map((key) => sounds[key])
    .sort((a, b) => b.timestamp - a.timestamp);

  const changeSoundVolume = () => {};
  const toggleSoundFile = () => {};
  const usernames = {};
  const userId = '123';

  return (
    <SafeAreaView>
      <FocusAwareStatusBar
        barStyle='light-content'
        backgroundColor={NAVBAR.backgroundColor}
      />
      <View style={tw`m-5`}>
        <Sound
          key={soundsArray[0].id}
          sound={soundsArray[0]}
          userId={userId}
          usernames={usernames}
        />
        {/* {soundsArray.map((sound) => (
          <Sound
            key={sound.id}
            sound={sound}
            userId={userId}
            usernames={usernames}
          />
        ))} */}
      </View>
    </SafeAreaView>
  );
};

export default Sounds;
