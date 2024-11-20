import { Button, Icon, Text, UnifiedIconName } from "@/components/base";
import { TABBAR_HEIGHT_OFFSET } from "@/constants";
import { savingsOptions } from "@/data";
import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ScrollView,
  Spinner,
  useTheme,
  useWindowDimensions,
  View,
  XStack,
  YStack,
  Progress,
} from "tamagui";
import * as React from "react";
import { targetSavingRouter } from "@/api/routers";
import { FlatList, ListRenderItem } from "react-native";
import { TargetSaving } from "@/api/types";
import { monify } from "@/utils";

export default function CreateTargetSavingsScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const safeAreaInsets = useSafeAreaInsets();
  const { data, isLoading } = targetSavingRouter.getAll.useQuery({
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
              No Target Savings yet
            </Text>
          </>
        )}
      </YStack>
    );
  }, [isLoading]);
  const renderItem: ListRenderItem<TargetSaving> = React.useCallback(
    ({ item }) => {
      return (
        <TargetItem
          id={item.id}
          name={item.savings_name}
          targetAmount={item.target_amount}
          amountSaved={item.amount_saved}
        />
      );
    },
    []
  );

  return (
    <YStack f={1} pos="relative">
      <Stack.Screen
        options={{
          title: "Target Savings List",
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
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
      />
      <Link href="/(protected)/target-savings/create" asChild>
        <Button pos="absolute" bottom={48 + safeAreaInsets.bottom} right={20}>
          <Button.Icon>
            <Icon name="ri:add-large-fill" />
          </Button.Icon>
          <Button.Text>New Target Savings </Button.Text>
        </Button>
      </Link>
    </YStack>
  );
}

function TargetItem({
  id,
  name,
  targetAmount,
  amountSaved,
}: {
  id: string;
  name: string;
  targetAmount: number;
  amountSaved: number;
}) {
  const percentage = React.useMemo(() => {
    return Math.round((amountSaved / targetAmount) * 100);
  }, [amountSaved, targetAmount]);

  // const
  return (
    <Link
      href={{
        pathname: "/(protected)/target-savings/[id]/",
        params: {
          name,
          id,
        },
      }}
      asChild
    >
      <YStack ai="center" py="$6" px="$4" gap="$2" bg="$purple1" br={16}>
        <XStack>
          <YStack f={1}>
            <Text fow="500">{name}</Text>
            <Text fos="$6" fow="700">
              {monify(targetAmount)}
            </Text>
          </YStack>
          <Button size="sm">
            <Button.Icon>
              <Icon name="ri:share-forward-line" />
            </Button.Icon>
            <Button.Text>Share</Button.Text>
          </Button>
        </XStack>
        <XStack ai="center" gap="$2">
          <Progress
            flex={1}
            size="$2"
            value={percentage}
            max={100}
            bg="$purple3"
          >
            <Progress.Indicator animation="100ms" br="$4" bg="$purple6" />
          </Progress>
          <Text fos="$1" fow="600" color="$purple6">
            {percentage}%
          </Text>
        </XStack>
      </YStack>
    </Link>
  );
}
