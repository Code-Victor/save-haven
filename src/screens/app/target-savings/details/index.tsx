import { targetSavingRouter } from "@/api/routers";
import { Skeleton } from "@/components/Skeleton";
import { TransactionItem } from "@/components/TransactionItem";
import { Button, Icon, Input, Text } from "@/components/base";
import { REDIRECT_URL, TABBAR_HEIGHT_OFFSET } from "@/constants";
import { monify, paymentGenerator } from "@/utils";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Progress,
  ScrollView,
  Sheet,
  Spinner,
  XStack,
  YStack,
  useTheme,
  useWindowDimensions,
} from "tamagui";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import BottomSheetKeyboardAwareScrollView from "@/components/BottomSheetKeyboardAwareScrollView";
import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useStore } from "@/stores";
import { WebView, WebViewNavigation } from "react-native-webview";

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
      <ScrollView
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
      </ScrollView>
    </>
  );
}

function PreviewCard({ name, id }: { id: string; name: string }) {
  const { data: targetSaving } = targetSavingRouter.getById.useQuery({
    variables: { id },
  });
  const isLocked = targetSaving?.is_locked ?? true;
  const targetAmount = targetSaving?.target_amount ?? 0;
  const amountSaved = targetSaving?.amount_saved ?? 0;

  return (
    <YStack bg="$white1" gap="$3" pb="$4" br={16}>
      <YStack ai="center" py="$6" px="$4" gap="$2" bg="$purple6" br={16}>
        <XStack>
          <YStack f={1}>
            <Text fow="500" color="$white1">
              {name}
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
        <Progress size="$2" value={amountSaved} max={targetAmount} bg="$white2">
          <Progress.Indicator animation="bouncy" br="$4" bg="$purple3" />
        </Progress>
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

  const { data, isLoading } = targetSavingRouter.getTransactions.useQuery({
    variables: { id },
    select: (data) => data.items,
  });

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
            ?.splice(0, 5)
            .map((transaction) => (
              <TransactionItem
                channel={transaction.channel}
                variant={
                  transaction.transaction_type === "CREDIT"
                    ? "received"
                    : "sent"
                }
                amount={transaction.amount}
                date={transaction.transaction_date}
              />
            ))
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
  const [open, setOpen] = React.useState(false);
  const user = useStore((s) => s.user!);
  const { mutate, isPending, data } =
    targetSavingRouter.fundAccount.useMutation({
      onSuccess(data) {
        console.log(data);
        setOpen(true);
        bottomSheetModalRef.current?.close();
      },
    });
  const { control, handleSubmit, getValues } = useForm<DepositSchema>({
    resolver: zodResolver(depositSchema),
  });
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const paymentUri = React.useMemo(() => {
    const amount = getValues().amount;
    if (!data) return;
    return paymentGenerator.generatePaymentLink({
      checkoutAmount: amount,
      emailAddress: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.telephone_no,
      transactionReference: data.data.transaction_reference,
    });
  }, [data]);
  // callbacks
  const handlePresentModalPress = React.useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = React.useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const onSubmit = React.useCallback((data: DepositSchema) => {
    mutate({
      id,
    });
  }, []);
  const onNavigationStateChange = React.useCallback(
    async (state: WebViewNavigation) => {
      const { url } = state;
      console.log(url);
      // if the url is the close url, close the sheet(i.e if the payment is successful)
      if (url?.startsWith(REDIRECT_URL)) {
        setOpen(false);
      }
    },
    []
  );
  console.log("paymentUri", paymentUri);
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
          <YStack gap="$2" px="$5" pb="$6">
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
              mt="$2"
              onPress={handleSubmit(onSubmit)}
              // disabled={isSubmitting}
              loading={isPending}
              size="lg"
              bg="$purple6"
            >
              <Button.Text>Deposit</Button.Text>
            </Button>
          </YStack>
        </BottomSheetKeyboardAwareScrollView>
      </BottomSheetModal>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        snapPointsMode={"percent"}
        snapPoints={[90]}
        dismissOnSnapToBottom
        zIndex={100_000}
        animation="quick"
        modal
      >
        <Sheet.Overlay />

        <Sheet.Handle />
        <Sheet.Frame padding="$4" gap="$5" bg="white" mb="$8" br="$4">
          <WebView
            source={{ uri: paymentUri ?? "" }}
            style={{ flex: 1 }}
            onNavigationStateChange={onNavigationStateChange}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
