import { crowdfundingRouter } from "@/api/routers";
import BottomSheetKeyboardAwareScrollView from "@/components/BottomSheetKeyboardAwareScrollView";
import {
  RefreshScrollView,
  useRegisterRefetch,
} from "@/components/RefreshScrollView";
import { Skeleton } from "@/components/Skeleton";
import { TransactionItem } from "@/components/TransactionItem";
import { Button, Icon, Input, Text } from "@/components/base";
import { FRONTEND_URL } from "@/constants";
import { useStore } from "@/stores";
import { handleError, monify, paymentGenerator } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Share } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import {
  Progress,
  Spinner,
  XStack,
  YStack,
  useTheme,
  useWindowDimensions,
  Tabs,
  SizableText,
} from "tamagui";
import { z } from "zod";

// #region Crowdfunding Details
export default function CrowdfundingDetails() {
  const user = useStore((state) => state.user!);
  const theme = useTheme();
  const { name, id } = useLocalSearchParams<{ name: string; id: string }>();
  const safeAreaInsets = useSafeAreaInsets();
  const { data: crowdfundingCampaign } = crowdfundingRouter.getById.useQuery({
    variables: { id },
    select(data) {
      return data.data;
    },
  });

  const isOriginalPoster = user._id === crowdfundingCampaign?.user;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Crowdfunding Campaign",
        }}
      />
      <RefreshScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.white2.val,
          paddingBottom: safeAreaInsets.bottom + 16,
          paddingTop: 16,
          paddingHorizontal: safeAreaInsets.left + 20,
        }}
      >
        <YStack gap="$3.5">
          <PreviewCard {...{ id, name, isOriginalPoster }} />
          {isOriginalPoster && <InfoTabs id={id} />}
        </YStack>
      </RefreshScrollView>
    </>
  );
}
// #endregion

// #region Preview Card
function PreviewCard({
  name,
  id,
  isOriginalPoster,
}: {
  id: string;
  name: string;
  isOriginalPoster: boolean;
}) {
  const { mutate: withdraw, isPending: isWithdrawing } =
    crowdfundingRouter.withdraw.useMutation({
      onError: handleError(),
      onSuccess({ message }) {
        toast.success(message);
      },
    });
  const {
    data: transactionRef,
    isLoading: isLoadingTransactionRef,
    refetch: refetchTransactionRef,
  } = crowdfundingRouter.shareCampaign.useQuery({
    variables: { id },
    select(data) {
      return data.data.transaction_reference;
    },
  });
  const { data: crowdfundingCampaign, refetch: refetchTargetSaving } =
    crowdfundingRouter.getById.useQuery({
      variables: { id },
      select(data) {
        return data.data;
      },
    });
  useRegisterRefetch(refetchTargetSaving, refetchTransactionRef);
  const isLocked = crowdfundingCampaign?.is_locked ?? true;
  const targetAmount = crowdfundingCampaign?.target_amount ?? 0;
  const amountRaised = crowdfundingCampaign?.amount_raised ?? 0;

  const percentage = React.useMemo(() => {
    return Math.round((amountRaised / targetAmount) * 100);
  }, [amountRaised, targetAmount]);
  const onWithdrawPress = React.useCallback(() => {
    Alert.alert(
      "Are you sure?",
      "Funds would be withdrawn from your target saving into your wallet",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Ok",
          style: "cancel",
          onPress: () => withdraw({ id }),
        },
      ],
      {
        cancelable: true,
        userInterfaceStyle: "light",
      }
    );
  }, []);

  const onSharePress = React.useCallback(() => {
    const url = `${FRONTEND_URL}/campaign?id=${id}&transaction_ref=${transactionRef}`;
    Share.share({
      message: url,
    });
  }, [id, transactionRef]);
  return (
    <YStack bg="$white1" gap="$3" pb="$4" br={16}>
      <YStack ai="center" py="$6" px="$4" gap="$2" bg="$purple6" br={16}>
        <XStack>
          <YStack f={1}>
            <Text fos="$5" fow="700" color="$white1" numberOfLines={1} mb="$2">
              {name ?? crowdfundingCampaign?.campaign_title}
            </Text>
            <Text color="$white1" fos="$2" fow="500">
              <Text color="$green6" fos="$2" fow="500">
                Progress:
              </Text>{" "}
              {monify(amountRaised)}
            </Text>
            <Text color="$white1" fos="$2" fow="500">
              <Text color="$green6" fos="$2" fow="500">
                Target:
              </Text>{" "}
              {monify(targetAmount)}
            </Text>
          </YStack>
          <Button
            size="sm"
            bg="$purple4"
            disabled={isLoadingTransactionRef}
            onPressIn={onSharePress}
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
            bg="$purple1"
          >
            <Progress.Indicator animation="100ms" br="$4" bg="$green6" />
          </Progress>
          <Text fos="$1" fow="600" color="$white1">
            {percentage}%
          </Text>
        </XStack>
      </YStack>

      <XStack jc="space-between" px="$4" ai="center">
        <Text fow="600">Created at</Text>
        {!crowdfundingCampaign ? (
          <Skeleton baseColor="#1a1a1a" style={{ height: 18.2, width: 87 }} />
        ) : (
          <Text fos="$2" fow="700" ta="right">
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
            }).format(new Date(crowdfundingCampaign.createdAt))}
          </Text>
        )}
      </XStack>
      <XStack jc="space-between" gap="$6" px="$4">
        {isOriginalPoster && (
          <Button
            variant={isLocked ? "gray" : "primary"}
            disabled={isLocked}
            size="sm"
            f={1}
            loading={isWithdrawing}
            onPress={onWithdrawPress}
          >
            <Button.Icon>
              <Icon name="ri:arrow-right-up-line" />
            </Button.Icon>
            <Button.Text>Withdraw</Button.Text>
          </Button>
        )}
        <DepositButton {...{ id, transactionRef }} />
      </XStack>
    </YStack>
  );
}
// #endregion

// #region InfoTabs
function InfoTabs({ id }: { id: string }) {
  return (
    <Tabs
      flexDirection="column"
      orientation="horizontal"
      defaultValue="transaction"
      bg="$white1"
      br={16}
    >
      <Tabs.List
        disablePassBorderRadius
        aria-label="Manage your account"
        borderBottomWidth={1}
        borderBottomColor="$black025"
        mb="$2"
        gap="$2"
        p="$1"
      >
        <Tabs.Tab size="$3" value="transaction" f={1}>
          <SizableText>Transactions</SizableText>
        </Tabs.Tab>
        <Tabs.Tab size="$3" value="report" f={1}>
          <SizableText>Report</SizableText>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Content value="transaction">
        <TransactionsPane id={id} />
      </Tabs.Content>
      <Tabs.Content value="report">
        <ReportPane id={id} />
      </Tabs.Content>
    </Tabs>
  );
}
// #endregion

// #region Transactions Pane
function TransactionsPane({ id }: { id: string }) {
  const { width } = useWindowDimensions();
  const theme = useTheme();

  const {
    data,
    isLoading,
    refetch: refetchTransactions,
  } = crowdfundingRouter.getTransactions.useQuery({
    variables: { id },
    select: (data) => data.items,
  });

  useRegisterRefetch(refetchTransactions);

  return (
    <YStack bg="$white1" br={16} px="$4" pb="$4" gap="$2">
      <XStack ai="center" jc="space-between">
        <Text fow="600" fos="$2">
          Transaction History
        </Text>
        <Button size="sm" variant="ghost">
          <Button.Text>View All</Button.Text>
        </Button>
      </XStack>
      <YStack ai="center" jc="center" minHeight="$6">
        {isLoading ? (
          <Spinner size="large" color="$purple6" scale={1.5} />
        ) : data?.length === 0 ? (
          <>
            <Icon
              name="not-found"
              size={width * 0.5}
              color={theme.black6.val}
            />
            <Text fow="500" fos="$4" color="$black6">
              No transactions yet
            </Text>
          </>
        ) : (
          data
            ?.toReversed()
            .splice(0, 5)
            .map((transaction) => {
              const channel =
                transaction.transaction_type === "CREDIT"
                  ? `${transaction.donor.account_name} just donated`
                  : "Withdraw to Wallet";

              return (
                <TransactionItem
                  key={transaction.id}
                  channel={channel}
                  variant={
                    transaction.transaction_type === "CREDIT"
                      ? "received"
                      : "sent"
                  }
                  amount={transaction.amount}
                  date={transaction.createdAt}
                />
              );
            })
        )}
      </YStack>
    </YStack>
  );
}
// #endregion

// #region Report Pane
function ReportPane({ id }: { id: string }) {
  const { data: crowdfundingCampaign, isLoading } =
    crowdfundingRouter.getById.useQuery({
      variables: { id },
      select(data) {
        return data.data;
      },
    });
  const targetAmount = crowdfundingCampaign?.target_amount ?? 0;
  const amountRaised = crowdfundingCampaign?.amount_raised ?? 0;
  return (
    <YStack bg="$white1" br={16} px="$4" pb="$4" gap="$2">
      <XStack ai="center" jc="space-between">
        <Text fow="600" fos="$2">
          Saving Report
        </Text>
      </XStack>
      {isLoading ? (
        <YStack ai="center" jc="center" minHeight="$6">
          <Spinner size="large" color="$purple6" scale={1.5} />
        </YStack>
      ) : (
        <YStack gap="$6">
          <XStack px="$4" py="$2" br={8} jc="space-between" bg="$purple1">
            <YStack gap="$1">
              <Text fow="600" fos="$2" color="$black4">
                Target Amount
              </Text>
              <Text fow="600" color="$purple6">
                {monify(targetAmount)}
              </Text>
            </YStack>
            <YStack gap="$1">
              <Text ta="right" fow="600" fos="$2" color="$green9">
                Amount Raised
              </Text>
              <Text ta="right" fow="600" color="$green9">
                {monify(amountRaised)}
              </Text>
            </YStack>
          </XStack>
        </YStack>
      )}
    </YStack>
  );
}
// #endregion

// #region Deposit Button
const depositSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive").gt(0),
});
type DepositSchema = z.infer<typeof depositSchema>;
function DepositButton({
  id,
  transactionRef,
}: {
  id: string;
  transactionRef?: string;
}) {
  // hooks
  const router = useRouter();
  const { transaction_ref } = useLocalSearchParams<{
    transaction_ref?: string;
  }>();
  const user = useStore((s) => s.user!);
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = React.useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = React.useCallback((index: number) => {}, []);

  const onClose = React.useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);
  const onSubmit = React.useCallback(
    async ({ amount }: DepositSchema) => {
      const ref = transaction_ref ?? transactionRef;
      if (!ref) {
        toast.info("Transaction reference is required, Try again");
        return;
      }
      const [firstName, lastName] = user.name.split(" ").map((n) => n.trim());
      const paymentLink = paymentGenerator.generatePaymentLink({
        checkoutAmount: amount,
        emailAddress: user.email,
        firstName,
        lastName,
        phoneNumber: user.telephone_no,
        transactionReference: ref,
      });
      onClose();
      router.push({
        pathname: "/(protected)/payment/[uri]",
        params: {
          uri: paymentLink,
          redirect: `/(protected)/crowdfunding/${id}`,
        },
      });
    },
    [user]
  );

  // mutations
  const { control, handleSubmit, getValues } = useForm<DepositSchema>({
    resolver: zodResolver(depositSchema),
  });

  // Derived states

  return (
    <>
      <Button f={1} size="sm" onPress={handlePresentModalPress}>
        <Button.Icon>
          <Icon name="ri:arrow-left-down-line" />
        </Button.Icon>
        <Button.Text>Deposit</Button.Text>
      </Button>
      <BottomSheetModal ref={bottomSheetModalRef} onChange={handleSheetChanges}>
        <BottomSheetKeyboardAwareScrollView bottomOffset={16}>
          <YStack gap="$2" pt="$4" pb="$8" px="$5">
            <Text fos="$4" fow="600" ta="center">
              Deposit to Target Savings
            </Text>
            <Controller
              control={control}
              name="amount"
              render={({
                field: { onBlur, value, onChange },
                formState: { errors },
              }) => (
                <Input variant="grey" size="md" minWidth="100%">
                  <Input.Label mb="$1.5">Enter Amount</Input.Label>
                  <Input.Box>
                    <Input.Area
                      onChangeText={onChange}
                      keyboardType="number-pad"
                      {...{ onBlur, value: value?.toString() }}
                    />
                  </Input.Box>
                  {errors.amount ? (
                    <Input.SubText error>{errors.amount.message}</Input.SubText>
                  ) : null}
                </Input>
              )}
            />
            <Button
              onPress={handleSubmit(onSubmit)}
              // disabled={isSubmitting}
              size="lg"
              bg="$purple6"
            >
              <Button.Text>Deposit</Button.Text>
            </Button>
          </YStack>
        </BottomSheetKeyboardAwareScrollView>
      </BottomSheetModal>
    </>
  );
}
// #endregion
