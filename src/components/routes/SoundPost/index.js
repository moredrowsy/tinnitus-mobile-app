import React, { useEffect, useState } from 'react';

// React Native
import { RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';
import tw from 'twrnc';
import Sound from '../../Sound';
import Post from '../../Post';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { refreshReduxAsync } from '../../../store/redux/slices/common';
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

  // Refresh control
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    dispatch(refreshReduxAsync({ post: { collectionId, path } }));
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
      <ScrollView
        style={tw`m-2`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default SoundPost;
