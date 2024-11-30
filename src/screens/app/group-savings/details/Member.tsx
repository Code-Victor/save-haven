import { groupSavingsRouter } from "@/api/routers";
import type { Member } from "@/api/types";
import { SafeArea } from "@/components/base";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { YStack, useTheme, Spinner, XStack, Text } from "tamagui";
import { FlatList, ListRenderItem } from "react-native";
import * as React from "react";
import { getAvatar } from "@/utils";
import { useStore } from "@/stores";
import { Image } from "expo-image";

// #region Target Savings
export default function Members() {
  const theme = useTheme();
  const user = useStore((s) => s.user!);
  const { name, id } = useLocalSearchParams<{ name: string; id: string }>();
  const safeAreaInsets = useSafeAreaInsets();
  const { data: members, isLoading } = groupSavingsRouter.getDetails.useQuery({
    variables: { id },
    select: (res) => res.data.members,
  });
  const renderItem: ListRenderItem<Member> = React.useCallback(({ item }) => {
    return (
      <XStack p="$4" gap="$2" ai="center">
        <Image
          source={getAvatar({ name: item.name })}
          style={{
            width: 40,
            height: 40,
            borderRadius: 40,
          }}
        />
        <YStack>
          <Text fow="600" color="$black1">
            {item.name}
          </Text>
          <Text>{item.phone_number}</Text>
        </YStack>
      </XStack>
    );
  }, []);
  return (
    <>
      <Stack.Screen
        options={{
          title: "Group Savings Members",
        }}
      />

      <SafeArea f={1} px="$5" edges={["left", "right", "bottom"]} bg="$white2">
        <YStack mt="$3.5" bg="$white1" f={1} br={16}>
          {isLoading ? (
            <YStack f={1} ai="center" jc="center">
              <Spinner size="large" scale={1.5} />
            </YStack>
          ) : (
            <FlatList data={members ?? []} renderItem={renderItem} />
          )}
        </YStack>
      </SafeArea>
    </>
  );
}
