import { Button, Icon, Text, UnifiedIconName } from "@/components/base";
import { TABBAR_HEIGHT_OFFSET } from "@/constants";
import { savingsOptions } from "@/data";
import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, useTheme, View, XStack, YStack } from "tamagui";

export default function TargetSavingsScreen() {
  const theme = useTheme();
  const safeAreaInsets = useSafeAreaInsets();
  return (
    <>
      <Stack.Screen
        options={{
          title: "Target Savings",
        }}
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.white2.val,
          paddingBottom: safeAreaInsets.bottom + 16 + TABBAR_HEIGHT_OFFSET,
          paddingTop: 16,
          paddingHorizontal: safeAreaInsets.left + 20,
        }}
      >
        <YStack p="$3" br={28} bg="$white1">
          <PreviewCard />
          <YStack gap="$4" mt="$6">
            {options.map((option, index) => (
              <SavingOption key={index} {...option} />
            ))}
          </YStack>
        </YStack>
        <YStack gap="$2" mt="$16">
          <Link href="/(protected)/target-savings/all" asChild>
            <Button variant="outlined">
              <Button.Text>View Target Savings</Button.Text>
            </Button>
          </Link>
          <Link href="/(protected)/target-savings/create" asChild>
            <Button>
              <Button.Text>Create Target Saving</Button.Text>
            </Button>
          </Link>
        </YStack>
        <YStack gap="$4" pt="$3"></YStack>
      </ScrollView>
    </>
  );
}

function PreviewCard() {
  return (
    <XStack
      gap="$3"
      py="$6"
      px="$6"
      ai="center"
      bg={"$purple6"}
      br={16}
      animation="100ms"
      position="relative"
      overflow="hidden"
    >
      <View
        h={100}
        w={100}
        bg="$purple4"
        br={50}
        position="absolute"
        left={-40}
        top={-22.5}
      />
      <YStack gap="$4" py="$2.5" f={1}>
        <Text fontFamily="$gilroy" fos="$6" fow="600" color="$white1">
          {savingsOptions[0].name}
        </Text>
        <Text color="#D2D3D8" fos="$2">
          {savingsOptions[0].description}
        </Text>
      </YStack>
      <Image
        source={savingsOptions[0].icon}
        style={{
          width: 80,
          height: 80,
          transform: [{ scale: 1.9 }],
        }}
      />
    </XStack>
  );
}

const options: { name: string; description: string; icons: UnifiedIconName }[] =
  [
    {
      name: "Saving Period",
      icons: "ri:timer-fill",
      description:
        "Minimum saving period is one months. No maximum saving period.",
    },
    {
      name: "Top-up Saving Anytime",
      icons: "ri:money-dollar-circle-fill",
      description: "You can top-up savings anytime, manually or automatically.",
    },
    {
      name: "Withdraw Anytime For Free",
      icons: "ri:arrow-left-right-fill",
      description:
        "You can withdraw your savings anytime for free without breakage fee.",
    },
  ];

function SavingOption(props: (typeof options)[0]) {
  const theme = useTheme();
  return (
    <XStack gap="$2.5" ai="flex-start" py="$2.5" br={16}>
      <View h={48} w={48} br={8} bg="#EAE6EC" ai="center" jc="center">
        <Icon name={props.icons} size={24} color={theme.purple6.val} />
      </View>
      <YStack gap="$1" f={1}>
        <Text fontFamily="$gilroy" fow="600" color="$black2">
          {props.name}
        </Text>
        <Text color="$black4" fos="$2">
          {props.description}
        </Text>
      </YStack>
    </XStack>
  );
}
