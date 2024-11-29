import { Icon, IconButton, Text } from "@/components/base";
import { useStore } from "@/stores";
import { Image } from "expo-image";
import { View, XStack } from "tamagui";
import * as React from "react";
import { getAvatar } from "@/utils";
export function ProfilePanel() {
  const user = useStore((s) => s.user!);
  const userName = React.useMemo(() => user.name.trim(), [user.name]);
  const avatarUrl = React.useMemo(
    () => getAvatar({ name: userName }),
    [userName]
  );

  return (
    <XStack
      bg="$white1"
      px="$3"
      gap="$4"
      mt="$4"
      ai="center"
      h="$6"
      mx="$4"
      br={16}
    >
      <Image
        source={avatarUrl}
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
      <View f={1}>
        <Text fow="500" color="#333333">
          {`Hello, ${userName}`}
        </Text>
      </View>
      <XStack gap="$1">
        <IconButton rounded="pill" size="md" variant="ghost">
          <IconButton.Icon>
            <Icon name="ri:customer-service-2-fill" size={22} />
          </IconButton.Icon>
        </IconButton>
        <IconButton rounded="pill" size="md" variant="ghost">
          <IconButton.Icon>
            <Icon name="ri:notification-3-fill" size={22} />
          </IconButton.Icon>
        </IconButton>
      </XStack>
    </XStack>
  );
}
