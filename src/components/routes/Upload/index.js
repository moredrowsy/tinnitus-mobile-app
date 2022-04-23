import React, { useState } from 'react';

// React Native
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import {
  MaterialIcons,
  MaterialCommunityIcons,
} from 'react-native-vector-icons';
import { NAVBAR } from '../../../constants/tailwindcss';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';
import tw from 'twrnc';

// Redux
import { useDispatch } from 'react-redux';
import { addSound } from '../../../store/redux/slices/sounds';
import { addSoundFile } from '../../../store/redux/slices/soundFiles';
import { updateUserSoundsAsync } from '../../../store/redux/slices/user';

// Firebase
import { auth, db } from '../../../store/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';

import { TAGS, VOLUME } from '../../../constants';
import { blobToDataURL } from '../../../utils';
import { addPlayer } from '../../../store/cache';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [user] = useAuthState(auth);
  const [files, setFiles] = useState({});
  const [recording, setRecording] = useState(undefined);
  const [recordingItems, setRecordingItems] = useState([]);

  const onChangeFileTitle = (title, filename) => {
    files[filename].title = title;
    setFiles({ ...files });
  };

  const onToggleFileTag = (filename, tag) => {
    const tags = files[filename].tags;

    if (tags.has(tag)) {
      tags.delete(tag);
    } else {
      tags.add(tag);
    }

    setFiles({ ...files });
  };

  const onRemoveFile = (filename) => {
    delete files[filename];
    setFiles({ ...files });
  };

  const onRecordHandle = () => {
    if (!recording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const uploadFile = async (filename) => {
    try {
      const file = files[filename];

      // add sound file to firebase storage
      const storage = getStorage();
      const storagePath = `sounds/${user.uid}/${filename}`;
      const soundPathRef = ref(storage, storagePath);

      // Upload to Firebase Storage
      await uploadBytes(soundPathRef, file.data);

      // Add to player storage locallly
      const dataURL = file.dataURL;
      addPlayer({
        storageKey: storagePath,
        dataURL,
        volume: VOLUME.default,
      });

      // add sounds to firebase database;
      const sound = {
        authorId: user.uid,
        title: file.title,
        filename: filename,
        timestamp: Date.now(),
        storagePath,
        tags: Array.from(file.tags),
        votes: 1,
      };
      const docRef = await addDoc(collection(db, 'sounds'), sound);
      sound.id = docRef.id;
      dispatch(addSound({ sound }));
      const storageKey = `sounds/${user.uid}/${file.name}`;
      dispatch(addSoundFile({ storageKey }));

      const userSound = {
        vote: 1,
        volume: VOLUME.default,
      };

      // update user's sound array to firebase database
      dispatch(
        updateUserSoundsAsync({
          userId: user.uid,
          soundId: docRef.id,
          userSound,
        })
      );

      // update file on client to 'uploaded' status
      files[filename] = { ...file, status: 'uploaded' };
      setFiles({ ...files });
    } catch (e) {
      console.log(e);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // TODO: Limit recording to MAX_FILE_SIZE_BYTES
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );

      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const audioURI = recording.getURI();
    const fileInfo = await FileSystem.getInfoAsync(audioURI);
    const name = audioURI.substring(audioURI.lastIndexOf('/') + 1);

    // Use xhr to get audio uri/file as a blob
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', audioURI, true);
      xhr.send(null);
    });

    // Convert to dataURL to later use?
    const dataURL = await blobToDataURL(blob);

    const file = {
      type: 'Blob',
      data: blob,
      dataURL,
      name,
      size: fileInfo.size,
      title: name,
      tags: new Set(),
      status: 'none',
    };
    files[file.name] = file;
    setRecordingItems({ ...files, file });
  };

  return (
    <SafeAreaView>
      <FocusAwareStatusBar
        barStyle='light-content'
        backgroundColor={NAVBAR.backgroundColor}
      />
      <ScrollView style={tw`m-2`}>
        <Text style={tw`font-bold text-lg text-center mb-5`}>
          Record Your Own Sounds
        </Text>
        <Pressable
          onPress={onRecordHandle}
          style={tw`justify-center items-center mb-5`}
        >
          <MaterialCommunityIcons
            name={recording ? 'record-circle' : 'record-circle-outline'}
            size={30}
            color={recording ? '#e11d48' : '#9ca3af'}
          />
        </Pressable>
        {Object.keys(files).map((filename) => (
          <View
            key={files[filename].name}
            style={tw`flex bg-white shadow-md rounded mb-5`}
          >
            <View style={tw`bg-gray-300 p-1 flex-row justify-between`}>
              <Text style={tw`text-gray-800 font-bold uppercase`}>title</Text>
              <Pressable onPress={() => onRemoveFile(filename)}>
                <MaterialCommunityIcons
                  name='close-circle'
                  size={20}
                  color='#e11d48'
                />
              </Pressable>
            </View>
            <TextInput
              style={tw`p-1`}
              onChangeText={(title) => onChangeFileTitle(title, filename)}
              value={files[filename].title}
              placeholder='File title'
              keyboardType='default'
            />
            <View style={tw`bg-gray-300 p-1`}>
              <Text style={tw`text-gray-800 font-bold uppercase`}>
                size (bytes)
              </Text>
            </View>
            <Text style={tw`p-1`}>{files[filename].size}</Text>
            <View style={tw`bg-gray-300 p-1`}>
              <Text style={tw`text-gray-800 font-bold uppercase`}>tags</Text>
            </View>
            <View style={tw`flex-row flex-wrap`}>
              {TAGS.map((tag) => {
                const hasTag = files[filename].tags.has(tag);
                let className = 'text-xs rounded-full px-1 text-gray-700 m-1';
                const unSelectedColors = 'bg-gray-200 text-gray-700';
                const selectedColors = 'bg-gray-400 text-white';

                if (hasTag) {
                  className = `${className} ${selectedColors}`;
                } else {
                  className = `${className} ${unSelectedColors}`;
                }

                return (
                  <Pressable
                    key={tag}
                    onPress={() => onToggleFileTag(filename, tag)}
                  >
                    <View style={tw`${className}`}>
                      <Text style={hasTag ? tw`text-white` : tw`text-gray-700`}>
                        #{tag}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
            <Pressable
              style={tw`justify-center items-center`}
              onPress={() => uploadFile(filename)}
            >
              <MaterialIcons
                name='file-upload'
                size={30}
                color={
                  files[filename].status === 'none' ? '#2563eb' : '#d1d5db'
                }
              />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
