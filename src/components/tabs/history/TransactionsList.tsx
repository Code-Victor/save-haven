// React Native imports would go here
import { SectionList } from "react-native";
import { format } from "date-fns";
import { Spinner, View, YStack, useTheme, useWindowDimensions } from "tamagui";
import { Icon, Text } from "@/components/base";
import { TransactionItem } from "@/components/TransactionItem";
import { TABBAR_HEIGHT_OFFSET } from "@/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMemo, useCallback, useState } from "react";
import { walletRouter } from "@/api/routers";
import { Transaction } from "@/api/types";

// Define types for the data structure
interface TransactionSection {
  title: string;
  data: Transaction[];
}

const TransactionList = () => {
  const safeAreaInsets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const { data, isLoading } = walletRouter.getTransactions.useQuery({
    select: (data) => data.items,
  });
  const formatDate = useCallback((dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  }, []);

  // Memoize grouped transactions to prevent unnecessary recalculations
  const groupedTransactions = useMemo(() => {
    const grouped: Record<string, Transaction[]> = {};

    data?.forEach((transaction) => {
      const date = transaction.transaction_date.split(" ")[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });

    return Object.entries(grouped)
      .map(([date, data]) => ({
        title: date,
        data,
      }))
      .sort(
        (a, b) => new Date(b.title).getTime() - new Date(a.title).getTime()
      );
  }, [data]); // Depend on transactions.items

  // Memoize render functions to prevent unnecessary recreations
  const renderSectionHeader = useCallback(
    ({ section: { title } }: { section: TransactionSection }) => (
      <View py="$2.5" bg="$white2">
        <Text fow="700">{formatDate(title)}</Text>
      </View>
    ),
    [formatDate]
  );

  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionItem
        channel={item.channel}
        variant={item.transaction_type === "CREDIT" ? "received" : "sent"}
        amount={item.amount}
        date={item.transaction_date}
      />
    ),
    []
  );
  const ListEmptyComponent = useMemo(() => {
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
              No transactions yet
            </Text>
          </>
        )}
      </YStack>
    );
  }, [isLoading]);
  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  const contentContainerStyle = useMemo(
    () => ({
      flex: 1,
      paddingHorizontal: 20,
      paddingBottom: safeAreaInsets.bottom + 16 + TABBAR_HEIGHT_OFFSET,
    }),
    [theme.white1, safeAreaInsets.bottom]
  );

  return (
    <SectionList<Transaction, TransactionSection>
      sections={groupedTransactions}
      keyExtractor={keyExtractor}
      contentContainerStyle={contentContainerStyle}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      stickySectionHeadersEnabled={true}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
};

export default TransactionList;
