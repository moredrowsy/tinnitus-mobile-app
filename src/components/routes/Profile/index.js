import React, { useEffect, useState } from 'react';

// React Native
import { Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import { FontAwesome5 } from 'react-native-vector-icons';
import tw from 'twrnc';
import { NAVBAR } from '../../../constants/tailwindcss';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';

// Firebase
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../store/firebase';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUser,
  updateUserDisplayNameAsync,
} from '../../../store/redux/slices/user';

const Profile = () => {
  const [user, loading, error] = useAuthState(auth);
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUser);
  const [displayName, setDisplayName] = useState(userProfile.displayName);
  const [errMsg, setErrMsg] = useState(null);

  useEffect(() => {
    setDisplayName(userProfile.displayName);
  }, [userProfile.displayName]);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (userProfile !== displayName) {
      const onSuccess = () => {
        setErrMsg(null);
      };
      const onError = (err) => {
        setErrMsg('Something went wrong...');
      };
      dispatch(
        updateUserDisplayNameAsync(
          { displayName, userId: user.uid },
          onSuccess,
          onError
        )
      );
    }
  };

  if (!user) {
    return <NeedAuthedUserMsg navigation={navigation} msg='' />;
  }

  return (
    <SafeAreaView style={tw`flex-1 justify-center items-center m-2 mt-0`}>
      <FocusAwareStatusBar
        barStyle='light-content'
        backgroundColor={NAVBAR.backgroundColor}
      />
      <View>
        <Text style={tw`-mt-10 text-center text-3xl font-bold text-gray-900`}>
          Profile
        </Text>
      </View>
      <View
        style={tw`w-full mt-5 bg-gray-100 border border-gray-300 rounded-tl-md rounded-tr-md`}
      >
        <Text style={tw`px-3 py-3`}>{user.email}</Text>
      </View>
      <View
        style={tw`w-full bg-white border-l border-r border-b border-gray-300 rounded-bl-md rounded-br-md`}
      >
        <TextInput
          style={tw`px-3 py-2`}
          keyboardType='default'
          placeholder='Display Name'
          autoComplete='name'
          value={displayName}
          onChangeText={setDisplayName}
        />
      </View>
      <Pressable
        style={tw`relative mt-5 w-full py-2 px-4 text-sm font-medium rounded-md bg-indigo-600`}
        onPress={handleSubmit}
      >
        <View style={tw`absolute top-1 left-2`}>
          <FontAwesome5 name='lock' size={25} color='#6366f1' />
        </View>
        <Text style={tw`text-center text-white`}>Update Profile</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Profile;
