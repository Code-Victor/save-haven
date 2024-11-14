import { Text } from "@/components/base";
import { TABBAR_HEIGHT_OFFSET } from "@/constants";
import { savingsOptions } from "@/data";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, useTheme, XStack, YStack } from "tamagui";
import { useRouter } from "expo-router";
import * as React from "react";

export default function SavingsTab() {
  const theme = useTheme();
  const safeAreaInsets = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: theme.white1.val,
        paddingBottom: safeAreaInsets.bottom + 16 + TABBAR_HEIGHT_OFFSET,
        paddingTop: 16,
        paddingHorizontal: safeAreaInsets.left + 20,
      }}
    >
      <Text fow="500">
        Create a Savings Plan, Share Subscriptions, and Raise Funds.
      </Text>
      <YStack gap="$4" pt="$3">
        {savingsOptions.map((option, index) => (
          <SavingOption key={index} {...option} />
        ))}
      </YStack>
    </ScrollView>
  );
}

function SavingOption(props: (typeof savingsOptions)[0]) {
  const router = useRouter();
  const onPress = React.useCallback(() => {
    router.push(props.href);
  }, [props.href]);
  return (
    <XStack
      gap="$3"
      py="$6"
      px="$6"
      ai="center"
      bg={props.color}
      br={16}
      animation="100ms"
      disabled={props.comingSoon}
      opacity={props.comingSoon ? 0.5 : 1}
      transform={[{ scale: 1 }]}
      onPress={onPress}
      pressStyle={{
        transform: [
          {
            scale: 0.98,
          },
        ],
      }}
    >
      <YStack gap="$4" py="$2.5" f={1}>
        <Text fontFamily="$gilroy" fos="$6" fow="600">
          {props.name}
        </Text>
        <Text fos="$2" fow="500">
          {props.description}
        </Text>
      </YStack>
      <Image
        source={props.icon}
        style={{
          width: 100,
          height: 100,
          transform:
            props.name === "Target Savings" ? [{ scale: 1.5 }] : undefined,
        }}
      />
    </XStack>
  );
}
