import { walletRouter } from "@/api/routers";
import { useRegisterRefetch } from "@/components/RefreshScrollView";
import { TransactionItem } from "@/components/TransactionItem";
import { Icon, Text } from "@/components/base";
import { Link } from "expo-router";
import * as React from "react";
import { Spinner, XStack, YStack, useTheme } from "tamagui";

export function TransactionPanel() {
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = walletRouter.getTransactions.useQuery({
    select: (data) => data.items,
  });
  const theme = useTheme();

  useRegisterRefetch(refetchTransactions);

  const transactionUI = React.useMemo(() => {
    if (isLoadingTransactions) {
      return (
        <YStack bg="$white1" br={16} height="$12" ai="center" jc="center">
          <Spinner size="large" color="$purple6" />
        </YStack>
      );
    } else if (transactions?.length === 0) {
      return (
        <YStack
          bg="$white1"
          br={16}
          px="$3"
          py="$4"
          gap="$2"
          ai="center"
          jc="center"
        >
          <Icon name="ri:search-line" size={32} color={theme.purple6.val} />
          <Text fow="500" color="$black8" fos="$2">
            No transactions yet
          </Text>
        </YStack>
      );
    }
    if (transactions) {
      return (
        <YStack bg="$white1" br={16} px="$3" py="$4">
          {transactions?.slice(0, 4).map((transaction) => {
            return (
              <TransactionItem
                key={transaction.id}
                channel={transaction.channel}
                variant={
                  transaction.transaction_type === "CREDIT"
                    ? "received"
                    : "sent"
                }
                amount={transaction.amount}
                date={transaction.transaction_date}
              />
            );
          })}
        </YStack>
      );
    }
  }, [transactions, isLoadingTransactions]);
  return (
    <YStack mt="$5" gap="$2.5" px="$4">
      <XStack ai="center" gap="$2" jc="space-between">
        <Text fos="$2" color="$black9" fow="600">
          Recent Transactions
        </Text>
        <Link href="/(protected)/(tabs)/history">
          <Text fos="$3" color="$green8" fow="600">
            View All
          </Text>
        </Link>
      </XStack>
      {transactionUI}
    </YStack>
  );
}
