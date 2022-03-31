import React, { useEffect, useState } from 'react';

// React Native
import { View, Text } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import tw from 'twrnc';
import Item from './Item';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import {
  decrementVoteAynsc,
  incrementVoteAynsc,
} from '../store/redux/slices/sounds';

import { changeSoundVolume, toggleSoundFile } from '../store/cache';
import { VOLUME } from '../constants';

const Sound = ({ navigation, sound, userId, usernames }) => {
  const dispatch = useDispatch();
  const userSound = useSelector((state) => {
    if (sound) {
      return state.user.sounds[sound.id];
    }
    return {};
  });
  const userVote = useSelector((state) => {
    if (sound && state.user && state.user.sounds.hasOwnProperty(sound.id)) {
      return state.user.sounds[sound.id].vote;
    }
    return 0;
  });
  const userVolume = useSelector((state) => {
    if (sound && state.user && state.user.sounds.hasOwnProperty(sound.id)) {
      return state.user.sounds[sound.id].volume;
    }
    return VOLUME.default;
  });

  const [volume, setVolume] = useState(Number(userVolume));

  // Update default volume to user volume if it exists
  useEffect(() => {
    if (userSound && userSound.volume && userSound.volume !== VOLUME.default) {
      setVolume(userSound.volume);
    }
  }, [userSound]);

  // Exit if no sound
  if (!sound) return null;

  const incrementVote = () => {
    dispatch(incrementVoteAynsc({ userId, soundId: sound.id }));
  };

  const decrementVote = () => {
    dispatch(decrementVoteAynsc({ userId, soundId: sound.id }));
  };

  const onToggleSound = () => {
    toggleSoundFile({
      dispatch,
      id: sound.id,
      storageKey: sound.storagePath,
      volume,
    });
  };

  const onVolChange = (newVolValue) => {
    setVolume(newVolValue);

    changeSoundVolume({
      dispatch,
      soundId: sound.id,
      storageKey: sound.storagePath,
      userId,
      volume: newVolValue,
    });
  };

  const gotoComment = () => {
    navigation.navigate('SoundPost', {
      collectionId: sound.id,
      path: 'sounds',
      userId,
      usernames,
    });
  };

  return (
    <Item
      gotoComment={gotoComment}
      decrementVote={decrementVote}
      incrementVote={incrementVote}
      item={sound}
      toggleFn={onToggleSound}
      userId={userId}
      usernames={usernames}
      userVote={userVote || 0}
    >
      <View style={tw`w-full`}>
        <Slider
          containerStyle={tw`w-full h-3`}
          minimumValue={VOLUME.min}
          maximumValue={VOLUME.max}
          step={VOLUME.step}
          minimumTrackTintColor='#3b82f6'
          maximumTrackTintColor='#dbeafe'
          thumbTintColor='#ec4899'
          thumbStyle={tw`h-3 w-3`}
          value={volume}
          onValueChange={onVolChange}
        />
      </View>
    </Item>
  );
};

export default Sound;
