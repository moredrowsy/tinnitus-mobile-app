import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';

// React Native
import { StyleSheet } from 'react-native';
import { DrawerNavigator } from './navigation';
import tw from 'twrnc';

// Firebase
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../store/firebase';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchSoundsAsync,
  updateSoundStatus,
  updateSoundVolume,
  updateSound,
} from '../store/redux/slices/sounds';
import {
  getSoundFileAsync,
  getSoundFilesAsync,
} from '../store/redux/slices/soundFiles';
import {
  fetchUsernamesAsync,
  selectUsernames,
} from '../store/redux/slices/usernames';
import { fetchUserAsync } from '../store/redux/slices/user';
import {
  fetchMixesAsync,
  selectMixes,
  updateMix,
  updateMixStatus,
} from '../store/redux/slices/mixes';
import {
  setNoise,
  setNoises,
  updateNoiseVolume,
} from '../store/redux/slices/noises';
import { setAcrn } from '../store/redux/slices/acrns';

// Constants, utils, etc
import { ACRN, FREQ, NOISE_COLOR, VOLUME } from '../constants';
import { shuffleArray } from '../utils';
import { NAVBAR } from '../constants/tailwindcss';

// Ignore setTimeout duration warnings
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);

// StatusBar
const STATUS_BAR_STYLES = ['default', 'dark-content', 'light-content'];
const STATUS_BAR_TRANSITIONS = ['fade', 'slide', 'none'];

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  if (error) {
    console.log(`Firebase authentication error: ${error}`);
  }

  // Map of player storage: Each item is a json of { player }
  const [playerStorage, setPlayerStorage] = useState({});

  const dispatch = useDispatch();
  const mixes = useSelector(selectMixes);
  const usernames = useSelector(selectUsernames);

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

  // Statusbar
  const [hidden, setHidden] = useState(false);
  const [statusBarStyle, setStatusBarStyle] = useState(STATUS_BAR_STYLES[0]);
  const [statusBarTransition, setStatusBarTransition] = useState(
    STATUS_BAR_TRANSITIONS[0]
  );

  return <DrawerNavigator user={user} />;
};

export default App;

const styles = StyleSheet.create({});
