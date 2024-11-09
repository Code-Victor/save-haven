import { SafeArea, Text } from "@/components/base";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, useTheme, YStack, XStack } from "tamagui";
import { Image } from "expo-image";
import { TABBAR_HEIGHT_OFFSET } from "@/constants";

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
const savingsOptions = [
  {
    name: "Target Savings",
    description: "Save with discipline towards a specific goal or project",
    icon: require("@/assets/images/target.png"),
    color: "#EAE6EC",
  },
  {
    name: "Group Savings",
    description:
      "Save and take turns to receive funds for your goals or business.",
    icon: require("@/assets/images/group.png"),
    color: "#E7F8F6",
  },
  {
    name: "Crowdfunding",
    description:
      "Raise funds together to achieve your dreams, launch a business, or support a cause.",
    icon: require("@/assets/images/crowdfunding.png"),
    color: "#FFF6ED",
  },
  {
    name: "Subscription",
    description:
      "Join friends or app users to share the cost of your Spotify, Apple Music, or YouTube subscription.",
    icon: require("@/assets/images/subscription.png"),
    comingSoon: true,
    color: "#F3F6FF",
  },
];

function SavingOption(props: (typeof savingsOptions)[0]) {
  return (
    <XStack
      gap="$3"
      py="$6"
      px="$6"
      ai="center"
      bg={props.color}
      br={16}
      animation="100ms"
      transform={[{ scale: 1 }]}
      pressStyle={{
        transform: [
          {
            scale: 0.98,
          },
        ],
      }}
    >
      <YStack gap="$4" py="$2.5" f={1}>
        <Text fos="$6" fow="600">
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
      {/* {props.comingSoon && (
        <Text color="$purple9" fow="600">
          Coming Soon
        </Text>
      )} */}
    </XStack>
  );
}
