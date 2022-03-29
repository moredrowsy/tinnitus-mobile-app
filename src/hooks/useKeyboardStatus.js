import React, { useEffect, useState } from 'react';

// Reat Native
import { Keyboard } from 'react-native';

const useKeyboardStatus = () => {
  const [keyboardStatus, setKeyboardStatus] = useState(null);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardStatus;
};

export default useKeyboardStatus;
