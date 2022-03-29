import React from 'react';

// React Native
import { Pressable, Text, View } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import tw from 'twrnc';

import { NAVBAR } from '../../constants/tailwindcss';

const AuthedHeader = ({ navigation, route, title, user }) => {
  const toggleDrawer = () => {
    navigation.toggleDrawer();
  };

  return (
    <View
      style={tw`relative flex flex-row justify-center items-center bg-gray-800 p-1`}
    >
      <Pressable onPress={toggleDrawer}>
        <MaterialIcons name='menu' size={30} color={NAVBAR.color} />
      </Pressable>
      <View style={tw`flex-1 pl-1`}>
        <Text style={tw`text-xl text-gray-300`}>{`${
          title !== 'Sign Up' && title !== 'Login' ? title : ''
        }`}</Text>
      </View>
      {!user ? (
        <>
          <Pressable onPress={() => navigation.navigate('Sign Up')}>
            <View
              style={tw`ml-5 px-3 rounded-md ${
                title === 'Sign Up' ? 'bg-gray-900 text-white' : 'text-gray-300'
              }`}
            >
              <Text style={tw`text-lg text-gray-300`}>Sign Up</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <View
              style={tw`ml-5 px-3 rounded-md ${
                title === 'Login' ? 'bg-gray-900 text-white' : 'text-gray-300'
              }`}
            >
              <Text style={tw`text-lg text-gray-300`}>Login</Text>
            </View>
          </Pressable>
        </>
      ) : (
        <Pressable onPress={() => navigation.navigate('Profile')}>
          <View>
            <MaterialIcons name='person' size={30} color={NAVBAR.color} />
          </View>
        </Pressable>
      )}
    </View>
  );
};

export default AuthedHeader;
