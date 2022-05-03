import React, { useState } from 'react';

// React Native
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import tw from 'twrnc';
import NeedAuthedUserMsg from '../../../NeedAuthedUserMsg';
import Track from '../../../Track';

// Redux
import { useDispatch } from 'react-redux';
import { addMixAsync } from '../../../../store/redux/slices/mixes';

import { MIX_LIMIT, TAGS, VOLUME } from '../../../../constants';
import { toggleSoundFile } from '../../../../store/cache';

const AddMix = ({ navigation, sounds, userId }) => {
  const dispatch = useDispatch();
  const [selectedSounds, setSelectedSounds] = useState(new Set());
  const [mixTitle, setMixTitle] = useState('');
  const [mixTags, setMixTags] = useState(new Set());
  const [toSounds, setToSounds] = useState({});
  const fromSoundsKeys = Object.keys(sounds)
    .sort((a, b) => sounds[a].title.localeCompare(sounds[b].title))
    .filter((key) => !toSounds.hasOwnProperty(key));

  // React Native for toggling the arrow button to open/close
  const [isOpen, setIsOpen] = useState(false);

  const toggleSelected = (soundId) => {
    if (selectedSounds.has(soundId)) selectedSounds.delete(soundId);
    else selectedSounds.add(soundId);
    setSelectedSounds(new Set(selectedSounds));
  };

  const addToMix = () => {
    let count = 0;
    for (const soundId of selectedSounds) {
      if (Object.keys(toSounds).length + count > MIX_LIMIT) break;

      toSounds[soundId] = sounds[soundId];
      ++count;
    }
    setSelectedSounds(new Set());
    setToSounds({ ...toSounds });
  };

  const removeFromMix = () => {
    for (const soundId of selectedSounds) {
      if (toSounds.hasOwnProperty(soundId)) {
        delete toSounds[soundId];
      }
    }

    setToSounds({ ...toSounds });
    setSelectedSounds(new Set());
  };

  const createMix = () => {
    if (Object.keys(toSounds).length !== 0) {
      const onSuccess = () => {
        setMixTitle('');
        setSelectedSounds(new Set());
        setToSounds({});
      };

      const mixVolumes = {};
      Object.keys(toSounds).forEach(
        (soundId) => (mixVolumes[soundId] = VOLUME.default)
      );
      const mix = {
        authorId: userId,
        title: mixTitle,
        soundIDs: Object.keys(toSounds),
        timestamp: Date.now(),
        tags: Array.from(mixTags),
        mixVolumes,
        volume: VOLUME.default,
        votes: 1,
      };

      dispatch(addMixAsync({ userId, mix, onSuccess }));

      setIsOpen(false);

      setMixTags(new Set());
    }
  };

  const onToggleMixTag = (tag) => {
    if (mixTags.has(tag)) {
      mixTags.delete(tag);
    } else {
      mixTags.add(tag);
    }

    setMixTags(new Set(mixTags));
  };

  if (!userId) {
    return <NeedAuthedUserMsg navigation={navigation} msg='to add mixes' />;
  }

  return (
    <View>
      <Pressable onPress={() => setIsOpen(!isOpen)}>
        <View
          style={tw`relative bg-gray-700 p-2 w-full flex justify-center items-center`}
        >
          <Text style={tw`text-white text-center`}>Add Mix</Text>
          <View
            style={[
              tw`w-10 absolute ${isOpen ? 'bottom-2' : 'top-2'} right-0`,
              isOpen
                ? { transform: [{ rotate: '-90deg' }] }
                : { transform: [{ rotate: '90deg' }] },
            ]}
          >
            <MaterialIcons name='chevron-left' size={30} color='#fff' />
          </View>
        </View>
      </Pressable>
      {isOpen && (
        <View>
          <TextInput
            style={tw`mt-2 px-2 py-1 bg-white border border-gray-300 rounded-sm`}
            keyboardType='default'
            placeholder='Mix Title'
            value={mixTitle}
            onChangeText={setMixTitle}
          />
          <ScrollView
            style={[
              tw`mt-2 bg-white rounded-sm shadow-sm w-full`,
              { height: 150 },
            ]}
          >
            {fromSoundsKeys.map((soundId) => (
              <View style={tw`border-b border-gray-300 p-1`} key={soundId}>
                <Track
                  isSelcted={selectedSounds.has(soundId)}
                  sound={sounds[soundId]}
                  toggleSoundFile={toggleSoundFile}
                  toggleSelected={toggleSelected}
                />
              </View>
            ))}
          </ScrollView>
          <View style={tw`mt-2 flex-row justify-center items-center`}>
            <View style={tw`mr-1`}>
              <Pressable onPress={addToMix}>
                <MaterialIcons
                  name='arrow-circle-down'
                  size={30}
                  color='#6b7280'
                />
              </Pressable>
            </View>
            <View style={tw`ml-1`}>
              <Pressable onPress={removeFromMix}>
                <MaterialIcons
                  name='arrow-circle-up'
                  size={30}
                  color='#6b7280'
                />
              </Pressable>
            </View>
          </View>
          <ScrollView
            style={[
              tw`mt-2 bg-white rounded-sm shadow-sm w-full`,
              { height: 150 },
            ]}
          >
            {Object.keys(toSounds).map((soundId) => (
              <View style={tw`p-1`} key={soundId}>
                <Track
                  key={soundId}
                  isSelcted={selectedSounds.has(soundId)}
                  sound={sounds[soundId]}
                  toggleSelected={toggleSelected}
                  toggleSoundFile={toggleSoundFile}
                />
              </View>
            ))}
          </ScrollView>
          <View style={tw`mt-2 flex-row flex-wrap`}>
            {TAGS.map((tag) => {
              const hasTag = mixTags.has(tag);
              return (
                <Pressable key={tag} onPress={() => onToggleMixTag(tag)}>
                  <Text
                    style={tw`text-xs bg-gray-300 rounded-full px-1 ${
                      hasTag
                        ? 'bg-gray-400 text-white'
                        : 'bg-gray-200 text-gray-700'
                    } m-1`}
                  >
                    #{tag}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={tw`flex justify-center items-center mt-2 mb-5`}>
            <Pressable
              style={tw`flex justify-center items-center bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2`}
              onPress={createMix}
            >
              <Text style={tw`text-gray-700 font-bold text-sm`}>
                Create Mix
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default AddMix;
