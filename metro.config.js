// Learn more https://docs.expo.io/guides/customizing-metro
/**
 * @type {import('expo/metro-config').MetroConfig}
 */
const { getDefaultConfig } = require("expo/metro-config");
const { withMonicon } = require("@monicon/metro");
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
};
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],
};

// Enable Tamagui and add nice web support with optimizing compiler + CSS extraction
const { withTamagui } = require("@tamagui/metro-plugin");
module.exports = withMonicon(
  withTamagui(config, {
    components: ["tamagui"],
    config: "./src/config/tamagui.config.ts",
    themeBuilder: {
      input: "./src/config/themes-in.ts",
      output: "./src/config/themes.ts",
    },
  }),
  {
    icons: [],
    // Load all icons from the listed collections
    collections: [],
  }
);

config.resolver.sourceExts.push("mjs");

// module.exports = config;
