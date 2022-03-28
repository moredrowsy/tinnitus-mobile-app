module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],

    plugins: [
      // For using React Native Reaniamted 2
      // @see https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/
      "react-native-reanimated/plugin",
    ],
  };
};
