import { Button, Icon, Text, UnifiedIconName } from "@/components/base";
import { TABBAR_HEIGHT_OFFSET } from "@/constants";
import { savingsOptions } from "@/data";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, useTheme, View, XStack, YStack } from "tamagui";

export default function CrowdfundingScreen() {
  const theme = useTheme();
  const safeAreaInsets = useSafeAreaInsets();
  return (
    <>
      <Stack.Screen
        options={{
          title: "Crowfunding",
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
        <Button mt="$16">
          <Button.Text>Create Target Saving</Button.Text>
        </Button>
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
          {savingsOptions[2].name}
        </Text>
        <Text color="#D2D3D8" fos="$2">
          {savingsOptions[2].description}
        </Text>
      </YStack>
      <Image
        source={savingsOptions[2].icon}
        style={{
          width: 80,
          height: 80,
          transform: [{ scale: 1.5 }],
        }}
      />
    </XStack>
  );
}

const options: { name: string; description: string; icons: UnifiedIconName }[] =
  [
    {
      name: "Set Your Goal, Share Your Vision",
      icons: "target",
      description:
        "Define your funding goal and easily share your project to attract backers who support your vision.",
    },
    {
      name: "Build a Supportive Community",
      icons: "ri:community-fill",
      description:
        "Connect with a network of backers who are passionate about supporting your project.",
    },
    {
      name: "Track Progress in Real-Time",
      icons: "ri:calendar-schedule-fill",
      description:
        "Monitor your campaign’s progress, share updates, and celebrate milestones as you reach your goal.",
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
