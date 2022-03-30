import React from 'react';

// React Web
import { Pressable, Text, View } from 'react-native';
import tw from 'twrnc';

function NeedAuthedUserMsg({ authed, msg, navigation }) {
  if (!authed) {
    return (
      <View
        style={tw`flex-row justify-center items-center m-5 text-sm text-center font-medium text-gray-700`}
      >
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={tw`font-bold underline`}>Login</Text>
        </Pressable>
        <Text> or </Text>
        <Pressable onPress={() => navigation.navigate('Sign Up')}>
          <Text style={tw`font-bold underline`}>create </Text>
        </Pressable>
        <Text>an account {msg}</Text>
      </View>
    );
  }
}

export default NeedAuthedUserMsg;
