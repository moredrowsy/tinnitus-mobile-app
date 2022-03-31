import React, { useEffect, useState } from 'react';

// React Native
import { Pressable, Text, View } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import tw from 'twrnc';
import PlayButton from './PlayButton';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { changeMixSoundVolume, toggleSoundFile } from '../store/cache';
import { VOLUME } from '../constants';

const Track = ({ isSelcted, mixId, sound, toggleSelected, userId }) => {
  const trackVolume = useSelector((state) => {
    if (
      sound &&
      mixId &&
      state.user &&
      state.user.mixes.hasOwnProperty(mixId) &&
      state.user.mixes[mixId].mixVolumes.hasOwnProperty(sound.id)
    ) {
      return state.user.mixes[mixId].mixVolumes[sound.id];
    }
    return VOLUME.default;
  });
  const dispatch = useDispatch();
  const [volume, setVolume] = useState(trackVolume);

  // Update default volume to user volume if it exists
  useEffect(() => {
    if (trackVolume !== VOLUME.default) {
      setVolume(trackVolume);
    }
  }, [trackVolume]);

  const onVolChange = (newVolValue) => {
    setVolume(newVolValue);
    changeMixSoundVolume({
      dispatch,
      mixId,
      soundId: sound.id,
      storageKey: sound.storagePath,
      userId,
      volume: newVolValue,
    });
  };

  const onToggleSound = () => {
    toggleSoundFile({
      dispatch,
      id: sound.id,
      storageKey: sound.storagePath,
      volume,
    });
  };

  return (
    <View style={tw`${isSelcted ? 'bg-sky-400' : ''}`}>
      <Pressable
        style={tw`flex-row justify-center items-center`}
        onPress={toggleSelected ? () => toggleSelected(sound.id) : null}
      >
        <Text style={tw`flex-1`}>{sound.title}</Text>
        <PlayButton status={sound.status} toggleFn={onToggleSound} />
      </Pressable>
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
    </View>
  );
};

export default Track;
