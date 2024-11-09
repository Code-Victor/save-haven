import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNetInfo } from "@react-native-community/netinfo";
import { Text } from "tamagui";

const minHeight = 0;

export function OfflineBanner() {
  const netinfo = useNetInfo();
  const insets = useSafeAreaInsets();
  const height = useSharedValue(0);
  const bannerColor = useSharedValue("#212121");
  const isOffline = netinfo.isInternetReachable === false;
  const maxHeight = 24 + insets.bottom / 2;

  useEffect(() => {
    if (isOffline) {
      height.value = withTiming(maxHeight);
    } else {
      bannerColor.value = withTiming("#2ba640");
      height.value = withDelay(
        2000,
        withTiming(minHeight, undefined, (isFinished) => {
          if (isFinished) {
            bannerColor.value = withTiming("#212121");
          }
        })
      );
    }
  }, [isOffline, height, maxHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    marginTop: interpolate(
      height.value,
      [minHeight, maxHeight],
      [minHeight, -insets.bottom + 4]
    ),
  }));
  const bannerColorStyle = useAnimatedStyle(() => ({
    backgroundColor: bannerColor.value,
  }));

  return (
    <Animated.View style={bannerColorStyle}>
      <Animated.View style={animatedStyle}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text color="white" fow="600" fos="$1">
              {isOffline ? "No internet connection" : "Back online"}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
  },
  textContainer: {
    flexGrow: 1,
    alignItems: "center",
  },
});
