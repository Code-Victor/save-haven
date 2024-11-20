import { Button, Icon, Text, UnifiedIconName } from "@/components/base";
import { FRONTEND_URL, TABBAR_HEIGHT_OFFSET } from "@/constants";
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
import { crowdfundingRouter } from "@/api/routers";
import { FlatList, ListRenderItem, RefreshControl, Share } from "react-native";
import { Campaign, TargetSaving } from "@/api/types";
import { monify } from "@/utils";

export default function CreateTargetSavingsScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const safeAreaInsets = useSafeAreaInsets();
  const { data, isLoading, isRefetching, refetch } =
    crowdfundingRouter.getAll.useQuery({
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
              No Crowdfunding campaigns yet
            </Text>
          </>
        )}
      </YStack>
    );
  }, [isLoading]);

  const renderItem: ListRenderItem<Campaign> = React.useCallback(({ item }) => {
    return (
      <CampaignCard
        id={item.id}
        name={item.campaign_title}
        targetAmount={item.target_amount}
        amountRaised={item.amount_raised}
      />
    );
  }, []);

  return (
    <YStack f={1} pos="relative">
      <Stack.Screen
        options={{
          title: "Crowdfunding Campaigns",
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
      <Link href="/(protected)/crowdfunding/create" asChild>
        <Button pos="absolute" bottom={48 + safeAreaInsets.bottom} right={20}>
          <Button.Icon>
            <Icon name="ri:add-large-fill" />
          </Button.Icon>
          <Button.Text>New campaign </Button.Text>
        </Button>
      </Link>
    </YStack>
  );
}

function CampaignCard({
  id,
  name,
  targetAmount,
  amountRaised,
}: {
  id: string;
  name: string;
  targetAmount: number;
  amountRaised: number;
}) {
  const { data: transactionRef, isLoading: isLoadingTransactionRef } =
    crowdfundingRouter.shareCampaign.useQuery({
      variables: { id },
      select(data) {
        return data.data.transaction_reference;
      },
    });
  const percentage = React.useMemo(() => {
    if (targetAmount === 0 && amountRaised === 0) {
      return 100;
    }
    return Math.round((amountRaised / targetAmount) * 100);
  }, [amountRaised, targetAmount]);
  const onShare = React.useCallback(() => {
    const url = `${FRONTEND_URL}/campaign?id=${id}&transaction_ref=${transactionRef}`;
    Share.share({
      message: url,
    });
  }, [id, transactionRef]);
  // const
  return (
    <Link
      href={{
        pathname: "/(protected)/crowdfunding/[id]/",
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
            <Text color="$purple5" fos="$2" fow="500">
              <Text color="$green9" fos="$2" fow="500">
                Progress:
              </Text>{" "}
              {monify(amountRaised)}
            </Text>
            <Text color="$purple5" fos="$2" fow="500">
              <Text color="$green9" fos="$2" fow="500">
                Target:
              </Text>{" "}
              {monify(targetAmount)}
            </Text>
          </YStack>
          <Button
            size="sm"
            disabled={isLoadingTransactionRef}
            onPress={onShare}
          >
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
