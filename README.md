# Tinnitus Mobile App

A cross platform mobile app for the tinnitus sound therapy built using React Native.

## Install

```bash
npm install --global expo-cli
npm install
```

## Run

Dev

```bash
expo start
```

## Dev Notes

### App init

Bare minimal, non-expo managed

```bash
expo init tinnitus-mobile-app
```

### React Native Navigation changes

React Native Navigation uses Reanimated 2 configuration added to android. Changed `babel.config.js` and see link in there for more changes

### React Native SVG changes

`react-native-svg-transformer` modifies `metro.config.js`. See github for instructions

### React Native Vector Icons changes

`react-native-vector-icons` modifies `android/app/build.gradle` with `apply from`.
See github repo for notes.
