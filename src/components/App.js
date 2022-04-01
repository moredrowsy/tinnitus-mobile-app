import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';

// React Native
import { StyleSheet } from 'react-native';
import { DrawerNavigator } from './navigation';
import { ensureDirExists, getDirUri } from '../store/localFS';

// Firebase
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../store/firebase';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { fetchSoundsAsync } from '../store/redux/slices/sounds';
import {
  fetchUsernamesAsync,
  selectUsernames,
} from '../store/redux/slices/usernames';
import { fetchUserAsync } from '../store/redux/slices/user';
import { fetchMixesAsync, selectMixes } from '../store/redux/slices/mixes';
import { setNoises } from '../store/redux/slices/noises';
import { setAcrn } from '../store/redux/slices/acrns';

// Constants, utils, etc
import { ACRN, FREQ, NOISE_COLOR, VOLUME } from '../constants';
import { shuffleArray } from '../utils';
import { NAVBAR } from '../constants/tailwindcss';

import { soundCache } from '../store/cache';
import { Sound } from '../store/cache/sound';
import { noiseFiles } from '../store/cache/noises';

// Ignore setTimeout duration warnings
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  if (error) {
    console.log(`Firebase authentication error: ${error}`);
  }

  const dispatch = useDispatch();

  // Create 'sounds' and 'mixes' directory in local 'FileSystem.documentDirectory'
  useEffect(() => {
    const createLocalDirectories = async () => {
      const soundsDir = getDirUri('sounds');
      const mixesDir = getDirUri('mixes');

      ensureDirExists(soundsDir);
      ensureDirExists(mixesDir);
    };
    createLocalDirectories();
  });

  // Add noise color players
  useEffect(() => {
    const loadNoises = async () => {
      const noiseInfos = [];

      for (const [color, file] of Object.entries(noiseFiles)) {
        if (!soundCache.hasOwnProperty(color)) {
          const player = new Sound();
          await player.loadLocalFile(file);
          await player.setLoop(true);
          await player.setVolume(VOLUME.default);
          soundCache[color] = { player };

          const noise = {
            noise: {
              color,
              status: 'stopped',
              volume: VOLUME.default,
            },
          };
          noiseInfos.push(noise);
        }
      }

      if (noiseInfos.length > 0) {
        dispatch(setNoises(noiseInfos));
      }
    };
    loadNoises();
  }, [dispatch]);

  // Fetch and update user information
  // Only fetch when user object is different
  useEffect(() => {
    if (user) {
      dispatch(fetchUserAsync({ userId: user.uid }));
    }
  }, [dispatch, user]);

  // Update sound and usernames information
  useEffect(() => {
    dispatch(fetchUsernamesAsync());
    dispatch(fetchSoundsAsync());
    dispatch(fetchMixesAsync());
  }, [dispatch]);

  return <DrawerNavigator user={user} />;
};

export default App;

const styles = StyleSheet.create({});
