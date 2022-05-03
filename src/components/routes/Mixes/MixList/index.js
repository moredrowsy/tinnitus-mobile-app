import React, { useState } from 'react';

// React Native
import { RefreshControl, ScrollView } from 'react-native';
import tw from 'twrnc';
import Mix from '../../../Mix';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { refreshReduxAsync } from '../../../../store/redux/slices/common';

const MixList = ({ navigation, mixes, sounds, userId, usernames }) => {
  const dispatch = useDispatch();
  const userMixes = useSelector((state) => state.user.mixes);
  const mixesArray = Object.keys(mixes)
    .map((key) => mixes[key])
    .sort((a, b) => b.timestamp - a.timestamp);

  // Refresh control
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    dispatch(refreshReduxAsync());
  };

  return (
    <ScrollView
      style={tw`m-2`}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {mixesArray.map((mix) => (
        <Mix
          key={mix.id}
          mix={mix}
          navigation={navigation}
          sounds={sounds}
          userId={userId}
          userMix={userMixes[mix.id]}
          usernames={usernames}
        />
      ))}
    </ScrollView>
  );
};

export default MixList;
