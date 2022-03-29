import React from 'react';

// React Web
import { View, Text } from 'react-native';
import tw from 'twrnc';

const Item = ({
  children,
  commentLink,
  decrementVote,
  incrementVote,
  item,
  toggleFn,
  userId,
  usernames,
  userVote,
}) => {
  return (
    <View style={tw`flex-row bg-white shadow-md rounded`}>
      <View style={tw`bg-gray-200`}>
        <Text>Vote</Text>
      </View>
      <View style={tw`flex-1 justify-center items-center`}>
        <View style={tw`w-full border-b border-gray-200`}>
          <Text style={tw`text-center`}>{item.title}</Text>
        </View>
        <View>{children}</View>
      </View>
      <View style={tw`bg-gray-200`}>
        <Text>Vote</Text>
      </View>
    </View>
  );
};

export default Item;
