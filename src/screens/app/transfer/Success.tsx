import {
  Button,
  Icon,
  SafeArea,
  Text,
  UnifiedIconName,
} from "@/components/base";
import { Link, Stack, useRouter } from "expo-router";
import React from "react";
import Animated, {
  Extrapolation,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
} from "react-native-reanimated";
import { View, XStack, YStack, useTheme } from "tamagui";

export default function Success() {
  const theme = useTheme();
  const router = useRouter();
  const scale = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    const size = interpolate(
      scale.value,
      [0, 1],
      [100, 140],
      Extrapolation.CLAMP
    );
    return {
      opacity: interpolate(scale.value, [0, 1], [0.5, 1], Extrapolation.CLAMP),
      width: size,
      height: size,
      transform: [
        {
          translateX: size / -2,
        },
        {
          translateY: size / -2,
        },
      ],
    };
  });
  React.useEffect(() => {
    scale.value = withRepeat(
      withSpring(1, {
        duration: 1200,
      }),
      -1
    );
    return () => cancelAnimation(scale);
  }, []);
  const options: {
    name: string;
    icon: UnifiedIconName;
    onPress: () => void;
  }[] = [
    {
      name: "Share Receipt",
      icon: "ri:share-forward-line",
      onPress: () => {},
    },
    {
      name: "Download Receipt",
      icon: "ri:download-cloud-2-line",
      onPress: () => {},
    },
    {
      name: "Repeat Transfer",
      icon: "ri:refresh-line",
      onPress: () => {},
    },
  ];
  return (
    <SafeArea flex={1} bg="$white2" px="$4.5">
      <Stack.Screen
        options={{
          animation: "fade_from_bottom",
          presentation: "modal",
          // headerBackVisible: false,
          headerShown: false,
        }}
      />
      <YStack f={1} jc="center" ai="center" gap="$4.5">
        <View ai="center" jc="center" h={140} w={140}>
          <View ai="center" jc="center" h={100} w={100} br={50} bg="#5BB552">
            <Icon
              name="ri:verified-badge-fill"
              color={theme.purple6.val}
              size={50}
            />
          </View>
          <Animated.View
            style={[
              {
                position: "absolute",
                top: "50%",
                left: "50%",
                backgroundColor: "#AAFFA1",
                borderRadius: 70,
                zIndex: -1,
              },
              animatedStyles,
            ]}
          />
        </View>
        <YStack gap="$4" mt="$4">
          <Text ta="center" fos="$7.5" fow="700" maxWidth={220} mx="auto">
            Transfer Successfully
          </Text>
          <Text ta="center" fow="500" maxWidth={320} mx="auto">
            Wow! Your transfer of <Text fow="700">#2,000.00</Text> to{" "}
            <Text fow="700">Victor Hamzat</Text> was Successful
          </Text>
        </YStack>
      </YStack>

      <YStack gap="$16" pt="$4" pb="$8">
        <XStack gap="$4">
          {options.map((option, index) => (
            <YStack
              bg="$white1"
              py="$4"
              px="$2"
              ai="center"
              jc="center"
              gap="$2"
              f={1}
              br={8}
            >
              <View h={28} w={28} bg="$black12" br="$4" ai="center" jc="center">
                <Icon name={option.icon} color={theme.purple6.val} size={24} />
              </View>
              <Text fos="$2" ta="center">
                {option.name}
              </Text>
            </YStack>
          ))}
        </XStack>
        <Link href="/(protected)/(tabs)/" asChild>
          <Button>
            <Button.Text>Done</Button.Text>
          </Button>
        </Link>
      </YStack>
    </SafeArea>
  );
}
