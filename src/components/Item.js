import React from 'react';

// React Native
import { Pressable, Text, View } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import tw from 'twrnc';
import PlayButton from './PlayButton';

// Redux
import { useDispatch } from 'react-redux';
import { getUsernameByIdAsync } from '../store/redux/slices/usernames';

const Item = ({
  children,
  gotoComment,
  decrementVote,
  incrementVote,
  item,
  toggleFn,
  userId,
  usernames,
  userVote,
}) => {
  const dispatch = useDispatch();

  // Exit if no item
  if (!item) return null;

  // Check for usersname display
  const username = usernames[item.authorId];
  if (username === undefined) {
    dispatch(getUsernameByIdAsync({ id: item.authorId }));
  }

  return (
    <View style={tw`flex-row bg-white shadow-md rounded mb-2`}>
      <View style={tw`flex justify-center items-center bg-gray-200`}>
        <View style={[tw`w-10`, { transform: [{ rotate: '90deg' }] }]}>
          <Pressable onPress={incrementVote} disabled={!userId || userVote > 0}>
            <MaterialIcons
              name='chevron-left'
              size={30}
              color={userVote > 0 ? '#f87171' : '#9ca3af'}
            />
          </Pressable>
        </View>
        <View style={{ marginBottom: -10, marginTop: -10 }}>
          <Text>{item.votes}</Text>
        </View>
        <View style={{ transform: [{ rotate: '-90deg' }] }}>
          <Pressable onPress={decrementVote} disabled={!userId || userVote < 0}>
            <MaterialIcons
              name='chevron-left'
              size={30}
              color={userVote < 0 ? '#f87171' : '#9ca3af'}
            />
          </Pressable>
        </View>
      </View>
      <View style={tw`flex-1 justify-center items-center bg-gray-200 w-full`}>
        <Pressable onPress={gotoComment}>
          <View>
            <Text style={tw`text-center text-sm font-bold underline`}>
              {item.title}
            </Text>
          </View>
        </Pressable>
        <View>
          <Text style={tw`text-center text-xs`}>{username}</Text>
        </View>
        <View style={{ width: '100%' }}>{children}</View>
        <View style={tw`flex flex-row justify-start w-full pb-1`}>
          {item.tags &&
            item.tags.map((tag) => (
              <View key={tag}>
                <Text
                  style={tw`text-xs bg-gray-300 rounded-full px-1 text-gray-700 m-1`}
                >
                  #{tag}
                </Text>
              </View>
            ))}
        </View>
      </View>
      <View style={[tw`flex justify-center items-center bg-gray-200 w-10`]}>
        <PlayButton status={item.status} toggleFn={toggleFn} />
      </View>
    </View>
  );
};

export default Item;
