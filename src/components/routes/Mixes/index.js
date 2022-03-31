import React, { useState } from 'react';

// React Native
import { RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import { NAVBAR } from '../../../constants/tailwindcss';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';
import tw from 'twrnc';
import AddMix from './AddMix';
import MixList from './MixList';

// Firebase
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../store/firebase';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { refreshReduxAsync } from '../../../store/redux/slices/common';
import { selectMixes } from '../../../store/redux/slices/mixes';
import { selectSounds } from '../../../store/redux/slices/sounds';
import { selectUsernames } from '../../../store/redux/slices/usernames';

const Mixes = ({ navigation }) => {
  const dispatch = useDispatch();
  const usernames = useSelector(selectUsernames);
  const [user, loading, error] = useAuthState(auth);
  const userId = user ? user.uid : null;
  const sounds = useSelector(selectSounds);
  const mixes = useSelector(selectMixes);

  // Refresh control
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    dispatch(refreshReduxAsync());
  };

  return (
    <SafeAreaView>
      <FocusAwareStatusBar
        barStyle='light-content'
        backgroundColor={NAVBAR.backgroundColor}
      />
      <ScrollView
        style={tw`m-2`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <AddMix navigation={navigation} sounds={sounds} userId={userId} />
        <MixList
          mixes={mixes}
          sounds={sounds}
          userId={userId}
          usernames={usernames}
          navigation={navigation}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Mixes;
