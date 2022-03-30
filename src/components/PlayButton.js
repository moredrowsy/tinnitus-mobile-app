import React from 'react';

// React Native
import { Pressable, View, Text } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import { Circle } from 'react-native-animated-spinkit';
import tw from 'twrnc';

const PlayButton = ({ toggleFn, status }) => {
  // Logic for sound button
  let playButton;
  switch (status) {
    case 'started':
      playButton = (
        <MaterialIcons name='pause-circle-outline' size={30} color='#fb923c' />
      );
      break;
    case 'downloading':
      playButton = (
        <View style={tw``}>
          <Circle size={25} color='#1f2937' />
        </View>
      );
      break;
    case 'none':
      playButton = (
        <MaterialIcons name='play-circle-outline' size={30} color='#9ca3af' />
      );
      break;
    default:
      playButton = (
        <MaterialIcons name='play-circle-outline' size={30} color='#60a5fa' />
      );
  }

  return (
    <View>
      <Pressable onPress={toggleFn}>{playButton}</Pressable>
    </View>
  );
};

export default PlayButton;
