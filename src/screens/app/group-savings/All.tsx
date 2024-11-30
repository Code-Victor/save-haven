import { crowdfundingRouter, groupSavingsRouter } from "@/api/routers";
import { Campaign, GroupSaving } from "@/api/types";
import { Button, Icon, Text } from "@/components/base";
import { FRONTEND_URL, TABBAR_HEIGHT_OFFSET } from "@/constants";
import { handleError, monify } from "@/utils";
import { Link, Stack } from "expo-router";
import * as React from "react";
import { FlatList, ListRenderItem, RefreshControl, Share } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Progress,
  Spinner,
  View,
  XStack,
  YStack,
  useTheme,
  useWindowDimensions,
} from "tamagui";

export default function CreateGroupSavingsScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const safeAreaInsets = useSafeAreaInsets();
  const { data, isLoading, isRefetching, refetch } =
    groupSavingsRouter.getAll.useQuery({
      select: (data) => data.items,
    });

  const ListEmptyComponent = React.useMemo(() => {
    return (
      <YStack ai="center" jc="center" f={1}>
        {isLoading ? (
          <Spinner size="large" color="$purple6" scale={1.5} />
        ) : (
          <>
            <Icon
              name="not-found"
              size={width * 0.7}
              color={theme.black6.val}
            />
            <Text fow="500" fos="$4" color="$black6">
              No group savings yet
            </Text>
          </>
        )}
      </YStack>
    );
  }, [isLoading]);

  const renderItem: ListRenderItem<GroupSaving> = React.useCallback(
    ({ item }) => {
      return (
        <GroupSavingCard
          id={item.id}
          name={item.group_name}
          targetAmount={item.group_target}
          groupRef={item.group_reference}
          noOfMembers={item.members_list.length}
          maxNoOfMembers={item.number_in_group}
        />
      );
    },
    []
  );

  return (
    <YStack f={1} pos="relative">
      <Stack.Screen
        options={{
          title: "Group Savings",
        }}
      />
      <FlatList
        data={data ?? []}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.white2.val,
          paddingBottom: safeAreaInsets.bottom + 16 + TABBAR_HEIGHT_OFFSET,
          paddingTop: 16,
          paddingHorizontal: safeAreaInsets.left + 20,
        }}
        ItemSeparatorComponent={() => <View h={16} />}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.purple6.val}
          />
        }
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
      />
      <Link href="/(protected)/group-savings/create" asChild>
        <Button pos="absolute" bottom={48 + safeAreaInsets.bottom} right={20}>
          <Button.Icon>
            <Icon name="ri:add-fill" />
          </Button.Icon>
          <Button.Text>Create</Button.Text>
        </Button>
      </Link>
    </YStack>
  );
}

function GroupSavingCard({
  id,
  name,
  targetAmount,
  groupRef,
  noOfMembers,
  maxNoOfMembers,
}: {
  id: string;
  name: string;
  targetAmount: number;
  groupRef: string;
  noOfMembers: number;
  maxNoOfMembers: number;
}) {
  const theme = useTheme();
  const onShare = React.useCallback(async () => {
    const url = `${FRONTEND_URL}/group-savings?ref=${groupRef}`;
    Share.share({
      message: url,
    });
  }, [id, groupRef]);

  // const
  return (
    <Link
      href={{
        pathname: "/(protected)/group-savings/[id]/",
        params: {
          name,
          id,
        },
      }}
      asChild
    >
      <YStack ai="center" py="$6" px="$4" gap="$2" bg="$green2" br={16}>
        <XStack>
          <YStack f={1}>
            <Text
              fos="$5"
              fow="700"
              color="$purple5"
              numberOfLines={1}
              mb="$2"
              tt="capitalize"
            >
              {name}
            </Text>

            <Text color="$purple9" fos="$6" fow="700">
              {monify(targetAmount)}
            </Text>
          </YStack>
          <YStack gap="$2" ai="flex-end">
            <Button size="sm" onPress={onShare}>
              <Button.Icon>
                <Icon name="ri:share-forward-line" />
              </Button.Icon>
              <Button.Text>Share</Button.Text>
            </Button>
            <XStack ai="center" gap="$1">
              <Icon name="ri:group-fill" size={16} color={theme.purple9.val} />
              <Text color="$purple9" fos="$2" fow="500">
                {noOfMembers}/{maxNoOfMembers}
              </Text>
            </XStack>
          </YStack>
        </XStack>
      </YStack>
    </Link>
  );
}
