import { Button, Icon, SafeArea, Text } from "@/components/base";
import { useStore } from "@/stores";
import { getAvatar } from "@/utils";
import { Image } from "expo-image";
import { ScrollView, XStack, YStack } from "tamagui";
import * as React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

export default function ProfileTab() {
  const safeAreaInsets = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: safeAreaInsets.bottom,
        paddingHorizontal: safeAreaInsets.left + 20,
      }}
      bg="$white2"
    >
      <YStack pt="$3.5" gap="$3.5">
        <ProfilePane />
        <DetailsPane />
        <SettingsButton />
        <LogoutButton />
      </YStack>
    </ScrollView>
  );
}

function ProfilePane() {
  const user = useStore((s) => s.user!);
  const userName = React.useMemo(
    () => `${user.first_name} ${user.last_name}`,
    [user.first_name, user.last_name]
  );
  const avatarUrl = React.useMemo(
    () => getAvatar({ name: userName }),
    [userName]
  );
  return (
    <YStack bg="$white1" br={16} p="$5" gap="$2" ai="center">
      <Image
        source={avatarUrl}
        style={{ width: 80, height: 80, borderRadius: 40 }}
      />
      <Text fow="600" ta="center">
        {userName}
      </Text>
      <XStack
        alignSelf="stretch"
        jc="space-between"
        bg="$purple1"
        px="$3"
        py="$2"
        br="$4"
      >
        <XStack gap="$2" ai="center">
          <Icon name="ri:medal-2-fill" size={24} color="#5BB552" />
          <Text color="#5BB552" fow="600">
            Tier 1
          </Text>
        </XStack>
        <Button
          size="sm"
          variant="outlined"
          rounded="pill"
          bg="$colorTransparent"
        >
          <Button.Text>Upgrade</Button.Text>
        </Button>
      </XStack>
    </YStack>
  );
}

function DetailsPane() {
  const user = useStore((s) => s.user!);

  return (
    <YStack bg="$white1" br={16} p="$5" gap="$2">
      <YStack gap="$1">
        <Text color="$black6" fos="$1" fow="500">
          Phone Number
        </Text>
        <Text color="$black2" fow="500">
          {user.telephone_no}
        </Text>
      </YStack>
      <YStack gap="$1">
        <Text color="$black6" fos="$1" fow="500">
          Email
        </Text>
        <Text color="$black2" fow="500">
          {user.email}
        </Text>
      </YStack>
      <XStack jc="center" mt="$4">
        <Button size="sm" rounded="pill">
          <Button.Icon>
            <Icon name="ri:edit-line" size={24} />
          </Button.Icon>
          <Button.Text>Update</Button.Text>
        </Button>
      </XStack>
    </YStack>
  );
}

function SettingsButton() {
  return (
    <XStack bg="$white1" br={16} ai="center" jc="space-between" px="$5" py="$4">
      <XStack ai="center" gap="$2">
        <Icon name="ri:settings-line" color="black" size={24} />
        <Text fow="500">Settings</Text>
      </XStack>
      <Icon name="ri:arrow-right-s-line" color="black" size={24} />
    </XStack>
  );
}

function LogoutButton() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearUser = useStore((s) => s.clearUser);
  const handleLogout = React.useCallback(() => {
    clearUser();
    queryClient.clear();
    router.replace("/(auth)/onboarding");
  }, [clearUser]);
  return (
    <XStack
      bg="$white1"
      br={16}
      ai="center"
      jc="space-between"
      px="$5"
      py="$4"
      onPress={handleLogout}
    >
      <XStack ai="center" gap="$2">
        <Icon name="ri:logout-box-line" color="#FF3B30" size={24} />
        <Text fow="500" color="#FF3B30">
          Logout
        </Text>
      </XStack>
      <Icon name="ri:arrow-right-s-line" color="black" size={24} />
    </XStack>
  );
}
