import { targetSavingRouter, walletRouter } from "@/api/routers";
import BottomSheetKeyboardAwareScrollView from "@/components/BottomSheetKeyboardAwareScrollView";
import {
  RefreshScrollView,
  useRegisterRefetch,
} from "@/components/RefreshScrollView";
import { Skeleton } from "@/components/Skeleton";
import { TransactionItem } from "@/components/TransactionItem";
import { Button, Icon, Input, Text } from "@/components/base";
import { FRONTEND_URL, TABBAR_HEIGHT_OFFSET } from "@/constants";
import { useStore } from "@/stores";
import { handleError, monify, paymentGenerator } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Share } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import {
  Progress,
  Spinner,
  View,
  XStack,
  YStack,
  useTheme,
  useWindowDimensions,
} from "tamagui";
import { unknown, z } from "zod";

export default function TargetSavingDetails() {
  const theme = useTheme();
  const { name, id } = useLocalSearchParams<{ name: string; id: string }>();
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Target Savings",
        }}
      />
      <RefreshScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.white2.val,
          paddingBottom: safeAreaInsets.bottom + 16 + TABBAR_HEIGHT_OFFSET,
          paddingTop: 16,
          paddingHorizontal: safeAreaInsets.left + 20,
        }}
      >
        <YStack gap="$3.5">
          <PreviewCard id={id} name={name} />
          <TransactionsPane id={id} />
        </YStack>
      </RefreshScrollView>
    </>
  );
}

function PreviewCard({ name, id }: { id: string; name: string }) {
  const { mutate: withdraw, isPending: isWithdrawing } =
    targetSavingRouter.withdraw.useMutation({
      onError: handleError(),
      onSuccess({ message }) {
        toast.success(message);
      },
    });
  const { data: targetSaving, refetch: refetchTargetSaving } =
    targetSavingRouter.getById.useQuery({
      variables: { id },
    });
  useRegisterRefetch(refetchTargetSaving);
  const isLocked = targetSaving?.is_locked ?? true;
  const targetAmount = targetSaving?.target_amount ?? 0;
  const amountSaved = targetSaving?.amount_saved ?? 0;

  const percentage = React.useMemo(() => {
    return Math.round((amountSaved / targetAmount) * 100);
  }, [amountSaved, targetAmount]);
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

  return (
    <YStack bg="$white1" gap="$3" pb="$4" br={16}>
      <YStack ai="center" py="$6" px="$4" gap="$2" bg="$purple6" br={16}>
        <XStack>
          <YStack f={1}>
            <Text fow="500" color="$white1">
              {name ?? targetSaving?.savings_name}
            </Text>
            <Text fos="$6" fow="700" color="$white1">
              {monify(targetAmount)}
            </Text>
          </YStack>
          <Button size="sm" bg="$purple4">
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
            <Progress.Indicator animation="100ms" br="$4" bg="$purple4" />
          </Progress>
          <Text fos="$1" fow="600" color="$white1">
            {percentage}%
          </Text>
        </XStack>
      </YStack>

      <XStack jc="space-between" px="$4" ai="center">
        <Text fow="600">Withdrawal Date</Text>
        {!targetSaving ? (
          <Skeleton baseColor="#1a1a1a" style={{ height: 18.2, width: 87 }} />
        ) : (
          <Text fos="$2" fow="700" ta="right">
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
            }).format(new Date(targetSaving.end_date))}
          </Text>
        )}
      </XStack>
      <XStack jc="space-between" gap="$6" px="$4">
        <Button
          variant={isLocked ? "gray" : "primary"}
          disabled={isLocked}
          f={1}
          loading={isWithdrawing}
          onPress={onWithdrawPress}
        >
          <Button.Icon>
            <Icon name="ri:arrow-right-up-line" />
          </Button.Icon>
          <Button.Text>Withdraw</Button.Text>
        </Button>
        <DepositButton id={id} />
      </XStack>
    </YStack>
  );
}

function TransactionsPane({ id }: { id: string }) {
  const { width } = useWindowDimensions();
  const theme = useTheme();

  const {
    data,
    isLoading,
    refetch: refetchTransactions,
  } = targetSavingRouter.getTransactions.useQuery({
    variables: { id },
    select: (data) => data.items,
  });

  useRegisterRefetch(refetchTransactions);

  return (
    <YStack bg="$white1" br={16} p="$5" gap="$2">
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
              size={width * 0.7}
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
                transaction.transaction_status === "success"
                  ? transaction.transaction_type === "CREDIT"
                    ? "Saved from Wallet"
                    : "Withdraw to Wallet"
                  : transaction.transaction_status;
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

const depositSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive").gt(0),
});
type DepositSchema = z.infer<typeof depositSchema>;
function DepositButton({ id }: { id: string }) {
  // hooks
  const router = useRouter();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const user = useStore((s) => s.user!);
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  // state
  const [method, setMethod] = React.useState<"bank" | "wallet" | "none">(
    "none"
  );

  // callbacks
  const handlePresentModalPress = React.useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = React.useCallback((index: number) => {
    if (index === -1) {
      setMethod("none");
    }
  }, []);

  const onClose = React.useCallback(() => {
    bottomSheetModalRef.current?.close();
    setMethod("none");
  }, []);
  const onSubmit = React.useCallback(
    async ({ amount }: DepositSchema) => {
      switch (method) {
        case "bank":
          const res = await fundAccount({
            id,
          });
          const paymentLink = paymentGenerator.generatePaymentLink({
            checkoutAmount: amount,
            emailAddress: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            phoneNumber: user.telephone_no,
            transactionReference: res.data.transaction_reference,
          });
          router.push({
            pathname: "/(protected)/payment/[uri]",
            params: {
              uri: paymentLink,
              redirect: `/(protected)/target-savings/${id}`,
            },
          });
          break;
        case "wallet":
          fundFromWallet({
            amount,
            id,
          });
          break;
        default:
          break;
      }
    },
    [method, user]
  );

  // mutations
  const { control, handleSubmit, getValues } = useForm<DepositSchema>({
    resolver: zodResolver(depositSchema),
  });

  const {
    mutateAsync: fundAccount,
    isPending: isFundAccountPending,
    // data: fundAccountData,
  } = targetSavingRouter.fundAccount.useMutation({
    onSuccess(data) {
      onClose();
      toast.success(data.message);
    },
    onError: handleError(),
  });
  const {
    mutate: fundFromWallet,
    isPending: isFundFromWalletPending,
    // data: fundFromWalletData,
  } = targetSavingRouter.fundFromWallet.useMutation({
    onSuccess(data) {
      toast.success(data.message);
      const hi = walletRouter.getWalletDetails.getFetchOptions();
      Promise.all([
        queryClient.invalidateQueries(
          walletRouter.getWalletDetails.getOptions()
        ),
        queryClient.invalidateQueries(
          targetSavingRouter.getById.getOptions({
            id,
          })
        ),
        queryClient.invalidateQueries(
          targetSavingRouter.getTransactions.getOptions({
            id,
          })
        ),
      ]);
      onClose();
    },
    onError: handleError(),
  });

  // Derived states
  const isPending = isFundAccountPending || isFundFromWalletPending;
  const showAmountInput = method !== "none";

  return (
    <>
      <Button f={1} onPress={handlePresentModalPress}>
        <Button.Icon>
          <Icon name="ri:arrow-left-down-line" />
        </Button.Icon>
        <Button.Text>Deposit</Button.Text>
      </Button>
      <BottomSheetModal ref={bottomSheetModalRef} onChange={handleSheetChanges}>
        <BottomSheetKeyboardAwareScrollView bottomOffset={16}>
          <YStack pt="$4" pb="$8" px="$5">
            {showAmountInput ? (
              <YStack gap="$2">
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
                        <Input.SubText error>
                          {errors.amount.message}
                        </Input.SubText>
                      ) : null}
                    </Input>
                  )}
                />
                <Button
                  loading={isPending}
                  onPress={handleSubmit(onSubmit)}
                  // disabled={isSubmitting}
                  size="lg"
                  bg="$purple6"
                >
                  <Button.Text>Deposit</Button.Text>
                </Button>
              </YStack>
            ) : (
              <YStack gap="$2">
                <Text fos="$4" fow="700">
                  Fund Your Wallet
                </Text>
                <YStack gap="$2">
                  <XStack
                    ai="center"
                    bg="$white2"
                    gap={8}
                    p="$3"
                    br="$4"
                    onPress={() => setMethod("bank")}
                  >
                    <View
                      bg="$purple5"
                      h={48}
                      w={48}
                      br={8}
                      ai="center"
                      jc="center"
                    >
                      <Icon name="ri:bank-fill" size={24} color="#fff" />
                    </View>
                    <YStack f={1}>
                      <Text color="$black1" fow="600">
                        Deposit from bank
                      </Text>
                      <Text color="$black6" fos="$1">
                        Add money directly from your bank
                      </Text>
                    </YStack>
                    <Icon
                      name="ri:arrow-right-s-line"
                      size={24}
                      color={theme.black1.val}
                    />
                  </XStack>
                  <XStack
                    ai="center"
                    bg="$white2"
                    gap={8}
                    p="$3"
                    br="$4"
                    onPress={() => setMethod("wallet")}
                  >
                    <View
                      bg="$purple5"
                      h={48}
                      w={48}
                      br={8}
                      ai="center"
                      jc="center"
                    >
                      <Icon name="ri:bank-card-fill" size={24} color="#fff" />
                    </View>
                    <YStack f={1}>
                      <Text color="$black1" fow="600">
                        Deposit from wallet
                      </Text>
                      <Text color="$black6" fos="$1">
                        Add money directly from your wallet balance
                      </Text>
                    </YStack>
                    <Icon
                      name="ri:arrow-right-s-line"
                      size={24}
                      color={theme.black1.val}
                    />
                  </XStack>
                </YStack>
              </YStack>
            )}
          </YStack>
        </BottomSheetKeyboardAwareScrollView>
      </BottomSheetModal>
    </>
  );
}
