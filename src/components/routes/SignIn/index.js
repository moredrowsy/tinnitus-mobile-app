import React, { useState } from 'react';

// React Native
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import { NAVBAR } from '../../../constants/tailwindcss';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';
import tw from 'twrnc';
import EarLogo from '../../../assets/images/ear-logo.svg';

// Firebase
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../store/firebase';

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState(null);

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setErrMsg(null);

      navigation.navigate('Dashboard');
    } catch (err) {
      const errCode = err.code;

      if (errCode === 'auth/wrong-password') {
        setErrMsg('Wrong password');
      } else if (errCode === 'auth/too-many-requests') {
        setErrMsg('Too many attempts. Try again in a few minutes');
      } else {
        setErrMsg('Something went wrong');
      }
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 justify-center items-center m-2`}>
      <FocusAwareStatusBar
        barStyle='light-content'
        backgroundColor={NAVBAR.backgroundColor}
      />
      <View style={tw`-mt-24`}>
        <EarLogo width={100} height={100} />
      </View>
      <View>
        <Text style={tw`mt-5 text-center text-3xl font-bold text-gray-900`}>
          Log into your account
        </Text>
      </View>
      <View
        style={tw`w-full mt-5 bg-white border border-gray-300 rounded-tl-md rounded-tr--md`}
      >
        <TextInput
          style={tw`px-3 py-2`}
          keyboardType='email-address'
          placeholder='Email address'
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View
        style={tw`w-full bg-white border-l border-r border-b border-gray-300 rounded-bl-md rounded-br-md`}
      >
        <TextInput
          style={tw`px-3 py-2`}
          keyboardType='default'
          secureTextEntry={true}
          placeholder='Passowrd'
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity
        style={tw`mt-5 w-full py-2 px-4 text-sm font-medium rounded-md bg-indigo-600`}
        onPress={signIn}
      >
        <Text style={tw`text-center text-white`}>Sign In</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({});
