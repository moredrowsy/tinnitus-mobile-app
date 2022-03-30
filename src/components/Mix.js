import React from 'react';

// React Native
import { View, Text } from 'react-native';
import Track from './Track';
import Item from './Item';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import {
  decrementVoteAynsc,
  incrementVoteAynsc,
} from '../store/redux/slices/mixes';

import { toggleMix } from '../store/cache';

const Mix = ({
  changeSoundVolume,
  mix,
  navigation,
  sounds,
  toggleSoundFile,
  userId,
  userMix,
  usernames,
}) => {
  const dispatch = useDispatch();
  const userVote = useSelector((state) => {
    if (mix && state.user && state.user.mixes.hasOwnProperty(mix.id)) {
      return state.user.mixes[mix.id].vote;
    }
    return 0;
  });

  if (!mix) return null;

  const soundsArray = mix.soundIDs.map((soundId) => sounds[soundId]);

  const toggleMixSounds = () => {
    toggleMix({ dispatch, mix, soundList: soundsArray, userMix });
  };

  const incrementVote = () => {
    dispatch(incrementVoteAynsc({ userId, mixId: mix.id }));
  };

  const decrementVote = () => {
    dispatch(decrementVoteAynsc({ userId, mixId: mix.id }));
  };

  const gotoComment = () => {
    navigation.navigate('MixPost', {
      collectionId: mix.id,
      path: 'mixes',
      userId,
      usernames,
    });
  };

  return (
    <Item
      gotoComment={gotoComment}
      decrementVote={decrementVote}
      incrementVote={incrementVote}
      item={mix}
      toggleFn={toggleMixSounds}
      userId={userId}
      usernames={usernames}
      userVote={userVote}
    >
      <View>
        {soundsArray.map((sound) => (
          <View key={sound.id}>
            <Track
              mixId={mix.id}
              changeSoundVolume={changeSoundVolume}
              sound={sound}
              toggleSoundFile={toggleSoundFile}
              userId={userId}
            />
          </View>
        ))}
      </View>
    </Item>
  );
};

export default Mix;
