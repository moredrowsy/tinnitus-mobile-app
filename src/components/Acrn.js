import React, { useEffect, useState } from 'react';

// React Native
import { Pressable, Text, View } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import PlayButton from './PlayButton';
import tw from 'twrnc';
import { toneFiles } from '../store/cache/tones';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { selectAcrns } from '../store/redux/slices/acrns';

import { ACRN, FREQ, VOLUME } from '../constants';
import { acrnVolChange, toggleAcrnPlay } from '../store/cache';

const Acrn = ({}) => {
  const toneKeys = Object.keys(toneFiles);
  const dispatch = useDispatch();
  const acrns = useSelector(selectAcrns);
  const [type, setType] = useState(ACRN.type.tone);
  const [frequency, setFrequency] = useState(FREQ.default);
  const [volume, setVolume] = useState(VOLUME.default);

  let acrnStatus = 'stopped';
  switch (type) {
    case ACRN.type.tone:
      if (acrns.hasOwnProperty(type)) {
        acrnStatus = acrns[type].status;
      }
      break;
    case ACRN.type.sequence:
      if (acrns.hasOwnProperty(type)) {
        acrnStatus = acrns[type].status;
      }
      break;
    default:
      acrnStatus = 'stopped';
  }

  const onFreqChange = (newFreqValue) => {
    let value = newFreqValue[0];

    // Adjust freq over 1000 Hz to increments of 500
    // because tone files over 1000 Hz are incremented by 500
    const freqFromToneFiles = toneKeys.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );

    setFrequency(freqFromToneFiles);
  };

  const onVolChange = (newVolValue) => {
    acrnVolChange({ frequency, type, volume: newVolValue });
    setVolume(newVolValue);
  };

  const onToggleAcrnPlay = () => {
    toggleAcrnPlay({ acrns, dispatch, frequency, type, volume });
  };

  let isDisabledBySequence = false;
  if (type === ACRN.type.sequence && acrns.hasOwnProperty(type)) {
    const { status } = acrns[type];

    if (status === 'started') {
      isDisabledBySequence = true;
    }
  }

  return (
    <View style={tw`shadow-md mb-2`}>
      <View style={tw`flex-row bg-gray-200`}>
        <Pressable
          style={tw`flex-1 justify-center rounded-tl p-2 ${
            type === ACRN.type.tone ? 'bg-gray-400' : ''
          }`}
          disabled={isDisabledBySequence}
          onPress={() => setType(ACRN.type.tone)}
        >
          <Text
            style={tw`font-bold text-lg text-center ${
              type === ACRN.type.tone ? 'text-gray-100' : 'text-gray-700'
            } ${isDisabledBySequence ? 'text-gray-300' : ''}`}
          >
            Tone
          </Text>
        </Pressable>
        <Pressable
          style={tw`flex-1 justify-center rounded-tr p-2 ${
            type === ACRN.type.sequence ? 'bg-gray-400' : ''
          }`}
          disabled={isDisabledBySequence}
          onPress={() => setType(ACRN.type.sequence)}
        >
          <Text
            style={tw`font-bold text-lg text-center ${
              type === ACRN.type.sequence ? 'text-gray-100' : 'text-gray-700'
            }`}
          >
            Sequence
          </Text>
        </Pressable>
      </View>
      <View style={tw`flex-row bg-white rounded-bl rounded-br`}>
        <View style={tw`flex-1 justify-center items-center bg-gray-200 w-full`}>
          <View
            style={tw`flex-1 justify-center items-center bg-gray-200 w-full mb-2`}
          >
            <Text style={tw`text-center text-gray-600 text-sm font-bold py-2`}>
              FREQUENCY: {frequency} Hz
            </Text>
            <View style={tw`w-full`}>
              <Slider
                containerStyle={tw`w-full h-4`}
                minimumValue={Number(toneKeys[0])}
                maximumValue={Number(toneKeys[toneKeys.length - 1])}
                step={100}
                minimumTrackTintColor={
                  acrnStatus === 'started' ? '#dbeafe' : '#3b82f6'
                }
                maximumTrackTintColor='#dbeafe'
                thumbTintColor={
                  acrnStatus === 'started' ? '#d1d5db' : '#ec4899'
                }
                thumbStyle={tw`h-4 w-4`}
                value={frequency}
                onValueChange={onFreqChange}
                disabled={acrnStatus === 'started'}
              />
            </View>
          </View>
          <View
            style={tw`flex-1 justify-center items-center bg-gray-200 w-full`}
          >
            <Text style={tw`text-center text-gray-600 text-sm font-bold pb-2`}>
              Volume
            </Text>
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
        </View>

        <View style={[tw`flex justify-center items-center bg-gray-200 w-10`]}>
          <PlayButton status={acrnStatus} toggleFn={onToggleAcrnPlay} />
        </View>
      </View>
    </View>
  );
};

export default Acrn;
