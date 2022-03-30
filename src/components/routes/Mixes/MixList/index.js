import React from 'react';

// React Native
import { View, Text } from 'react-native';
import tw from 'twrnc';
import Mix from '../../../Mix';

// Redux
import { useSelector } from 'react-redux';

const MixList = ({ navigation, mixes, sounds, userId, usernames }) => {
  const userMixes = useSelector((state) => state.user.mixes);
  const mixesArray = Object.keys(mixes)
    .map((key) => mixes[key])
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <View style={tw`mt-2`}>
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
    </View>
  );
};

export default MixList;
