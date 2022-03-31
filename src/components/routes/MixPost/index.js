import React, { useEffect, useState } from 'react';

// React Native
import { RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import { NAVBAR } from '../../../constants/tailwindcss';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';
import tw from 'twrnc';
import Mix from '../../Mix';
import Post from '../../Post';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { refreshReduxAsync } from '../../../store/redux/slices/common';
import {
  selectPostCollections,
  fetchPostsByCollectionIdAsync,
} from '../../../store/redux/slices/postCollections';
import { selectSounds } from '../../../store/redux/slices/sounds';
import { selectMixes } from '../../../store/redux/slices/mixes';

const MixPost = ({ navigation, route }) => {
  const { collectionId, path, userId, usernames } = route.params;

  const sounds = useSelector(selectSounds);
  const mixes = useSelector(selectMixes);
  const postCollections = useSelector(selectPostCollections);
  const posts = postCollections[collectionId];
  const mix = mixes[collectionId];
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
        <Mix mix={mix} sounds={sounds} userId={userId} usernames={usernames} />
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

export default MixPost;
