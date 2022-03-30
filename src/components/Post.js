import React, { useEffect, useState } from 'react';

// React Native
import { Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import FocusAwareStatusBar from './FocusAwareStatusBar';
import tw from 'twrnc';

// Redux
import { useDispatch } from 'react-redux';
import {
  addPostAsync,
  fetchPostsByCollectionIdAsync,
} from '../store/redux/slices/postCollections';

import { NAVBAR } from '../constants/tailwindcss';
import { formatDate } from '../utils';

const Post = ({ collectionId, path, posts, userId, usernames }) => {
  const [body, setBody] = useState('');

  const dispatch = useDispatch();

  const addPost = () => {
    if (body) {
      const post = { authorId: userId, body, timestamp: Date.now() };
      dispatch(addPostAsync({ collectionId, post, path }));
      setBody('');
    }
  };

  const onSubmit = () => {
    addPost();
  };

  useEffect(() => {
    dispatch(fetchPostsByCollectionIdAsync({ collectionId, path }));
  }, [dispatch, collectionId, path]);

  return (
    <SafeAreaView>
      <FocusAwareStatusBar
        barStyle='light-content'
        backgroundColor={NAVBAR.backgroundColor}
      />
      <TextInput
        style={[
          tw`h-24 bg-white border border-gray-300 rounded-md p-2`,
          { textAlignVertical: 'top' },
        ]}
        multiline={true}
        numberOfLines={5}
        placeholder='Type your message here'
        value={body}
        onChangeText={setBody}
      />
      <View style={tw`flex justify-center items-center mt-2 mb-5`}>
        <Pressable
          style={tw`flex justify-center items-center bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2`}
          onPress={onSubmit}
        >
          <Text style={tw`text-gray-700 font-bold text-sm`}>Submit Post</Text>
        </Pressable>
      </View>

      {posts &&
        Object.keys(posts)
          .map((key) => ({ id: key, ...posts[key] }))
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((post) => {
            return (
              <View key={post.id} style={tw`bg-white shadow-sm p-2 mb-2`}>
                <Text style={tw`font-bold`}>
                  {usernames[posts[post.id].authorId]}
                </Text>

                <Text style={tw`mt-3 mb-3 text-gray-700`}>
                  {posts[post.id].body}
                </Text>

                <Text style={tw`text-xs text-gray-600`}>
                  {formatDate(posts[post.id].timestamp)}
                </Text>
              </View>
            );
          })}
    </SafeAreaView>
  );
};

export default Post;
