import { groupSavingsRouter } from "@/api/routers";
import type { LeaderboardItem } from "@/api/types";
import { SafeArea } from "@/components/base";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { YStack, useTheme, Spinner, XStack, Text } from "tamagui";
import { FlatList, ListRenderItem } from "react-native";
import * as React from "react";
import { getAvatar, monify } from "@/utils";
import { useStore } from "@/stores";
import { Image } from "expo-image";

// #region Target Savings
export default function Leaderboard() {
  const theme = useTheme();
  const { name, id } = useLocalSearchParams<{ name: string; id: string }>();
  const safeAreaInsets = useSafeAreaInsets();
  const { data: leaderboard, isLoading } =
    groupSavingsRouter.getLeaderboard.useQuery({
      variables: { id },
      select: (res) => res.data,
    });
  const firstThree = React.useMemo(
    () => leaderboard?.slice(0, 3) ?? [],
    [leaderboard]
  );
  const rest = React.useMemo(() => leaderboard?.slice(3) ?? [], [leaderboard]);
  const renderItem: ListRenderItem<LeaderboardItem> = React.useCallback(
    ({ item, index }) => {
      return (
        <XStack p="$4" gap="$2" ai="center" bg="$white1" br={16}>
          <XStack ai="center" jc="center" bg="$purple6" h={24} w={24} br={8}>
            <Text color="$white1" fos="$1">
              {index + 1}
            </Text>
          </XStack>
          <Image
            source={getAvatar({ name: item.name })}
            style={{
              width: 40,
              height: 40,
              borderRadius: 40,
            }}
          />
          <YStack f={1}>
            <Text fow="600" color="$black1">
              {item.name}
            </Text>
            <Text>{item.phone_number}</Text>
          </YStack>
          <Text color="$purple6" fow="500" fos="$3" numberOfLines={1}>
            {monify(item.amount_saved)}
          </Text>
        </XStack>
      );
    },
    []
  );
  return (
    <>
      <Stack.Screen
        options={{
          title: "Leaderboard",
          headerStyle: {
            backgroundColor: theme.purple6.val,
          },
          headerTintColor: theme.white1.val,
        }}
      />
      <SafeArea f={1} px="$5" edges={["left", "right", "bottom"]} bg="$purple6">
        {/* <FirstThree data={firstThree} /> */}
        <FlatList
          data={leaderboard ?? []}
          renderItem={renderItem}
          keyExtractor={(item) => item.user}
          contentContainerStyle={{
            gap: 12,
          }}
        />
      </SafeArea>
    </>
  );
}

const FirstThree: React.FC<{ data: LeaderboardItem[] }> = ({ data }) => {
  return <YStack />;
};
