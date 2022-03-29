import React, { useEffect, useState } from 'react';

// React Native
import { View, Text } from 'react-native';
import Item from './Item';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import {
  decrementVoteAynsc,
  incrementVoteAynsc,
} from '../store/redux/slices/sounds';

import { changeSoundVolume, toggleSoundFile } from '../store/cache';
import { VOLUME } from '../constants';

const Sound = ({ sound, userId, usernames }) => {
  const dispatch = useDispatch();
  const userSound = useSelector((state) => state.user.sounds[sound.id]);
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

  const [volume, setVolume] = useState(userVolume);

  // Update default volume to user volume if it exists
  useEffect(() => {
    if (userSound && userSound.volume !== VOLUME.default) {
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
      volume,
    });
  };

  return (
    <Item
      commentLink={`/sounds/${sound.id}`}
      decrementVote={decrementVote}
      incrementVote={incrementVote}
      item={sound}
      toggleFn={onToggleSound}
      userId={userId}
      usernames={usernames}
      userVote={userVote || 0}
    >
      <View>
        <Text>Content</Text>
      </View>
    </Item>
  );
};

export default Sound;
