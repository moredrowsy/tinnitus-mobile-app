import React, { useEffect, useState } from 'react';

// React Native
import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import tw from 'twrnc';
import {
  Dashboard,
  Mixes,
  NoiseGenerator,
  SignIn,
  SignUp,
  Sounds,
} from './routes';

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

// React Native Navigation
const Drawer = createDrawerNavigator();
const drawerItems = [
  {
    name: 'Dashboard',
    component: Dashboard,
    iconType: 'Material',
    iconName: 'face-profile',
  },
  {
    name: 'Noise',
    component: NoiseGenerator,
    iconType: 'Feather',
    iconName: 'settings',
  },
  {
    name: 'Sounds',
    component: Sounds,
    iconType: 'Material',
    iconName: 'bookmark-check-outline',
  },
  {
    name: 'Mixes',
    component: Mixes,
    iconType: 'FontAwesome5',
    iconName: 'user-friends',
  },
  {
    name: 'Sign In',
    component: SignIn,
    iconType: 'FontAwesome5',
    iconName: 'user-friends',
  },
  {
    name: 'Sign Up',
    component: SignUp,
    iconType: 'FontAwesome5',
    iconName: 'user-friends',
  },
];

// Ignore setTimeout duration warnings
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);

// StatusBar
const STATUS_BAR_STYLES = ['default', 'dark-content', 'light-content'];
const STATUS_BAR_TRANSITIONS = ['fade', 'slide', 'none'];

export default function App() {
  const [user, loading, error] = useAuthState(auth);

  if (error) {
    console.log(`Firebase authentication error: ${error}`);
  }

  // Map of player storage: Each item is a json of { player }
  const [playerStorage, setPlayerStorage] = useState({});

  const dispatch = useDispatch();
  const mixes = useSelector(selectMixes);
  const usernames = useSelector(selectUsernames);

  console.log({ usernames });

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

  const changeStatusBarVisibility = () => setHidden(!hidden);

  const changeStatusBarStyle = () => {
    const styleId = STATUS_BAR_STYLES.indexOf(statusBarStyle) + 1;
    if (styleId === STATUS_BAR_STYLES.length) {
      setStatusBarStyle(STATUS_BAR_STYLES[0]);
    } else {
      setStatusBarStyle(STATUS_BAR_STYLES[styleId]);
    }
  };

  const changeStatusBarTransition = () => {
    const transition = STATUS_BAR_TRANSITIONS.indexOf(statusBarTransition) + 1;
    if (transition === STATUS_BAR_TRANSITIONS.length) {
      setStatusBarTransition(STATUS_BAR_TRANSITIONS[0]);
    } else {
      setStatusBarTransition(STATUS_BAR_TRANSITIONS[transition]);
    }
  };

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerType='front'
        initialRouteName='SignIn'
        screenOptions={{
          activeTintColor: '#e91e63',
          itemStyle: { marginVertical: 10 },
          drawerActiveBackgroundColor: '#111827',
          drawerActiveTintColor: '#fff',
          drawerInactiveBackgroundColor: '#1f2937',
          drawerInactiveTintColor: '#d1d5db',
          drawerLabelStyle: {
            fontWeight: '500',
            fontFamily: 'sans-serif',
            fontSize: 18,
          },
          drawerStyle: { backgroundColor: '#1f2937' },
          drawerType: 'front',
          headerStyle: {
            backgroundColor: '#1f2937',
          },
          headerTitleStyle: {
            color: '#d1d5db',
            fontFamily: 'sans-serif',
          },
          headerTintColor: '#d1d5db',
        }}
        backBehavior='history'
      >
        {drawerItems.map((drawerItem) => {
          console.log({ drawerItem });
          return (
            <Drawer.Screen
              key={drawerItem.name}
              name={drawerItem.name}
              component={drawerItem.component}
            />
          );
        })}
      </Drawer.Navigator>
    </NavigationContainer>

    // <SafeAreaView style={tw`flex-1 bg-slate-100`}>
    //   <StatusBar
    //     animated={true}
    //     backgroundColor="#1f2937"
    //     barStyle={"light-content"}
    //     showHideTransition={statusBarTransition}
    //     hidden={hidden}
    //   />
    //   <SignIn />
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({});