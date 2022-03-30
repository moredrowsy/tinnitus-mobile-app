import React, { useEffect } from 'react';

// React Native
import { SafeAreaView, Text, View } from 'react-native';
import { NAVBAR } from '../../../constants/tailwindcss';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';
import tw from 'twrnc';
import Mix from '../../Mix';
import Post from '../../Post';

// Redux
import { useDispatch, useSelector } from 'react-redux';
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
        <Mix mix={mix} sounds={sounds} userId={userId} usernames={usernames} />
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

export default MixPost;
