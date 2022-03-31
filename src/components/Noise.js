import React, { useEffect, useState } from 'react';

// React Native
import { Pressable, Text, View } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { MaterialIcons } from 'react-native-vector-icons';
import tw from 'twrnc';

// Redux
import { useDispatch, useSelector } from 'react-redux';

import { changeNoiseVolume, toggleNoise } from '../store/cache';
import { VOLUME } from '../constants';

const Noise = ({ description, noise, noiseBgColor, userId }) => {
  const dispatch = useDispatch();
  const userVolume = useSelector((state) => {
    if (noise && state.user && state.user.noises.hasOwnProperty(noise.color)) {
      return state.user.noises[noise.color].volume;
    }
    return VOLUME.default;
  });
  const [volume, setVolume] = useState(userVolume);

  // Update default volume to user volume if it exists
  useEffect(() => {
    if (userVolume && userVolume !== VOLUME.default) {
      setVolume(userVolume);
    }
  }, [userVolume]);

  const onVolChange = (newVolValue) => {
    setVolume(newVolValue);
    changeNoiseVolume({
      color: noise.color,
      dispatch,
      userId,
      volume: newVolValue,
    });
  };

  const onToggleNoise = ({ color, volume }) => {
    toggleNoise({ color, dispatch, volume });
  };

  return (
    <View
      style={[
        tw`flex-row justify-center items-center bg-white shadow-md rounded mb-2 p-1`,
        { backgroundColor: noiseBgColor },
      ]}
    >
      <View style={tw`flex-1 flex justify-center items-center`}>
        <View>
          <Text style={tw`text-xs font-bold uppercase mb-1 ml-5`}>
            {noise.color} noise
          </Text>
        </View>
        <View style={tw`w-full`}>
          <Slider
            containerStyle={tw`w-full h-4`}
            minimumValue={VOLUME.min}
            maximumValue={VOLUME.max}
            step={VOLUME.step}
            minimumTrackTintColor='#3b82f6'
            maximumTrackTintColor='#dbeafe'
            thumbTintColor='#ec4899'
            thumbStyle={tw`h-4 w-4`}
            value={volume}
            onValueChange={onVolChange}
          />
        </View>
      </View>
      <View style={[tw`flex justify-center items-center w-10`]}>
        <Pressable
          onPress={() => onToggleNoise({ color: noise.color, volume })}
        >
          {noise.status === 'started' ? (
            <MaterialIcons
              name='pause-circle-filled'
              size={30}
              color='#4b5563'
            />
          ) : (
            <MaterialIcons
              name='play-circle-filled'
              size={30}
              color='#4b5563'
            />
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default Noise;
