import React, { useEffect } from 'react';

// React Native
import { SafeAreaView, Text, View } from 'react-native';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';
import tw from 'twrnc';
import Sound from '../../Sound';
import Post from '../../Post';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPostCollections,
  fetchPostsByCollectionIdAsync,
} from '../../../store/redux/slices/postCollections';
import { selectSounds } from '../../../store/redux/slices/sounds';

import { NAVBAR } from '../../../constants/tailwindcss';

const SoundPost = ({ navigation, route }) => {
  const { collectionId, path, userId, usernames } = route.params;

  const sounds = useSelector(selectSounds);
  const postCollections = useSelector(selectPostCollections);
  const posts = postCollections[collectionId];
  const sound = sounds[collectionId];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPostsByCollectionIdAsync({ collectionId, path }));
  }, [dispatch, collectionId, path]);

  return (
    <SafeAreaView>
      <FocusAwareStatusBar
        barStyle='light-content'
        backgroundColor={NAVBAR.backgroundColor}
      />
      <View style={tw`m-2`}>
        <Sound
          sound={sound}
          userId={userId}
          usernames={usernames}
          navigation={navigation}
        />
        <Post
          collectionId={collectionId}
          path={path}
          posts={posts}
          userId={userId}
          usernames={usernames}
        />
      </View>
    </SafeAreaView>
  );
};

export default SoundPost;
