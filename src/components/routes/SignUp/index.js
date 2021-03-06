import React, { useState } from 'react';

// React Native
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
} from 'react-native';
import { FontAwesome5 } from 'react-native-vector-icons';
import { NAVBAR } from '../../../constants/tailwindcss';
import FocusAwareStatusBar from '../../FocusAwareStatusBar';
import tw from 'twrnc';
import { useKeyboardStatus } from '../../../hooks';

// Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../store/firebase';

import EarLogo from '../../../assets/images/ear-logo.svg';

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState(null);

  const keyboardStatus = useKeyboardStatus();

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        displayName: user.email,
      });

      setErrMsg(null);
      navigation.navigate('Dashboard');
    } catch (err) {
      const errCode = err.code;

      if (errCode === 'auth/email-already-in-use') {
        setErrMsg('Email already in use');
      } else if (errCode === 'auth/weak-password') {
        setErrMsg('Password must be 6 or more characters long.');
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
      {!keyboardStatus && (
        <View style={{ marginTop: -150 }}>
          <EarLogo width={75} height={75} />
        </View>
      )}
      <View>
        <Text style={tw`mt-5 text-center text-3xl font-bold text-gray-900`}>
          Create an account
        </Text>
      </View>
      <View
        style={tw`w-full mt-5 bg-white border border-gray-300 rounded-tl-md rounded-tr-md`}
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
      <Pressable
        style={tw`mt-5 w-full py-2 px-4 text-sm font-medium rounded-md bg-indigo-600`}
        onPress={signUp}
      >
        <View style={tw`absolute top-1 left-2`}>
          <FontAwesome5 name='lock' size={25} color='#6366f1' />
        </View>
        <Text style={tw`text-center text-white`}>Sign Up</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({});
