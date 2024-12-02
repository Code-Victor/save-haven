import { walletRouter } from "@/api/routers";
import { WalletDetailsResponse } from "@/api/types";
import BottomSheetKeyboardAwareScrollView from "@/components/BottomSheetKeyboardAwareScrollView";
import { useRegisterRefetch } from "@/components/RefreshScrollView";
import { Skeleton } from "@/components/Skeleton";
import { Button, Icon, IconButton, Input, Text } from "@/components/base";
import { color } from "@/config/colors";
import { useStore } from "@/stores";
import { handleError, monify } from "@/utils";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { Link } from "expo-router";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { Share } from "react-native";
import { toast } from "sonner-native";
import { Sheet, View, XStack, YStack, useTheme } from "tamagui";
import { z } from "zod";

export function WalletPanel() {
  const theme = useTheme();
  const {
    data: walletDetails,
    isLoading,
    refetch: refetchWalletDetails,
  } = walletRouter.getWalletDetails.useQuery({});

  const showBalance = useStore((s) => s.showBalance);
  const setShowBalance = useStore((s) => s.setShowBalance);
  const toggleShowBalance = React.useCallback(
    () => setShowBalance(!showBalance),
    [showBalance]
  );
  useRegisterRefetch(refetchWalletDetails);

  return (
    <YStack bg="$purple6" br={16} mt="$4" py="$4.5" px="$4" mx="$4" gap="$3">
      <YStack gap="$1">
        <XStack gap="$2" ai="center">
          <Text fow="500" color="$white1">
            Available Balance
          </Text>
          <IconButton
            variant="ghost"
            pressStyle={{
              bg: "#ffffff10",
            }}
            size="sm"
            onPress={toggleShowBalance}
          >
            <IconButton.Icon>
              <Icon
                name={!showBalance ? "ri:eye-line" : "ri:eye-off-line"}
                size={20}
                color="white"
              />
            </IconButton.Icon>
          </IconButton>
        </XStack>
        {walletDetails ? (
          <Text fow="500" fos="$6.5" color="$white1">
            {showBalance ? monify(walletDetails.wallet_balance) : "•••••••"}
          </Text>
        ) : (
          <Skeleton
            style={{
              height: 36.7,
              width: 120,
            }}
          />
        )}
      </YStack>

      <YStack mt="$1">
        {isLoading || !walletDetails ? (
          <Skeleton style={{ height: 32, borderRadius: 16 }} />
        ) : (
          <AccountNumberBtn {...walletDetails} />
        )}
      </YStack>
      <XStack gap="$6">
        <Link href="/(protected)/transfer" asChild>
          <Button variant="secondary" size="sm" f={1}>
            <Button.Icon>
              <Icon name="ri:arrow-right-up-line" size={24} />
            </Button.Icon>
            <Button.Text>Transfer</Button.Text>
          </Button>
        </Link>
        <FundWalletButton {...walletDetails!} />
      </XStack>
    </YStack>
  );
}

function AccountNumberBtn(props: WalletDetailsResponse) {
  const accountText = React.useMemo(
    () =>
      `Account number:${props.account_number} \n Bank Name: ${props.bank_name} \n Account Name: ${props.account_name}`,
    []
  );
  const copyDetails = React.useCallback(() => {
    Clipboard.setStringAsync(accountText);
    toast.success("Copied to clipboard");
  }, [accountText]);

  return (
    <XStack
      ai="center"
      jc="space-between"
      px="$4"
      py="$1.5"
      bg="$white025"
      br={12}
      onPress={copyDetails}
      transform={[{ scale: 1 }]}
      pressStyle={{
        transform: [
          {
            scale: 0.99,
          },
        ],
      }}
      gap="$2"
    >
      <View f={1}>
        <Text fow="600" fos="$2" color="$white1" numberOfLines={1}>
          {props.account_name}
        </Text>
      </View>
      <XStack ai="center" gap="$2">
        <Text color="$white1" fos="$2">
          {props.account_number}
        </Text>
        <Icon name="ri:file-copy-fill" color={color.white1} size={20} />
      </XStack>
    </XStack>
  );
}

const fundWalletSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive").gt(0),
  accountNumber: z.string().nonempty("Account number is required"),
  bankName: z.string().nonempty("Bank name is required"),
  acoountName: z.string().nonempty("Account name is required"),
});
type FundWalletSchema = z.infer<typeof fundWalletSchema>;
function FundWalletButton(props: WalletDetailsResponse) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = walletRouter.fundWallet.useMutation({
    onSuccess({ message }) {
      toast.success(message);
      bottomSheetModalRef.current?.dismiss();
      Promise.all([
        queryClient.invalidateQueries(
          walletRouter.getWalletDetails.getOptions()
        ),
        queryClient.invalidateQueries(
          walletRouter.getTransactions.getOptions()
        ),
      ]);
    },
    onError: handleError(),
  });
  const [position, setPosition] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const handleSheetChanges = React.useCallback((index: number) => {}, []);
  const { control, handleSubmit } = useForm<FundWalletSchema>({
    resolver: zodResolver(fundWalletSchema),
  });
  const accountNumber = props?.account_number;
  const accountText = React.useMemo(
    () =>
      `Account number:${props.account_number} \n Bank Name: ${props.bank_name} \n Account Name: ${props.account_name}`,
    []
  );
  const copyDetails = React.useCallback(() => {
    Clipboard.setStringAsync(accountText);
    toast.success("Copied to clipboard");
  }, [accountText]);
  const shareDetails = React.useCallback(() => {
    Share.share({
      message: accountText,
    });
  }, [accountText]);
  const onSubmit = React.useCallback(
    (data: FundWalletSchema) => {
      mutate({
        account_number: accountNumber!,
        amount: data.amount,
        sender_account_name: data.acoountName,
        sender_account_number: data.accountNumber,
        sender_bank_name: data.bankName,
      });
    },
    [accountNumber]
  );
  const handlePresentModalPress = React.useCallback(() => {
    setOpen(false);
    bottomSheetModalRef.current?.present();
  }, []);
  const renderBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} pressBehavior="close" />
    ),
    []
  );
  return (
    <>
      <Button variant="secondary" size="sm" f={1} onPress={() => setOpen(true)}>
        <Button.Icon>
          <Icon name="ri:add-circle-fill" size={24} />
        </Button.Icon>
        <Button.Text>Top up</Button.Text>
      </Button>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
      >
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
            <Controller
              control={control}
              name="accountNumber"
              render={({
                field: { onBlur, value, onChange },
                formState: { errors },
              }) => (
                <Input variant="grey" size="md" minWidth="100%">
                  <Input.Label mb="$1.5">Account Number</Input.Label>
                  <Input.Box>
                    <Input.Area
                      onChangeText={onChange}
                      {...{ onBlur, value }}
                    />
                  </Input.Box>
                  {errors.accountNumber ? (
                    <Input.SubText error>
                      {errors.accountNumber.message}
                    </Input.SubText>
                  ) : null}
                </Input>
              )}
            />

            <Controller
              control={control}
              name="bankName"
              render={({
                field: { onBlur, value, onChange },
                formState: { errors },
              }) => (
                <Input variant="grey" size="md" minWidth="100%">
                  <Input.Label mb="$1.5">Bank Name</Input.Label>
                  <Input.Box>
                    <Input.Area
                      onChangeText={onChange}
                      {...{ onBlur, value }}
                    />
                  </Input.Box>
                  {errors.bankName ? (
                    <Input.SubText error>
                      {errors.bankName.message}
                    </Input.SubText>
                  ) : null}
                </Input>
              )}
            />
            <Controller
              control={control}
              name="acoountName"
              render={({
                field: { onBlur, value, onChange },
                formState: { errors },
              }) => (
                <Input variant="grey" size="md" minWidth="100%">
                  <Input.Label mb="$1.5">Account Name</Input.Label>
                  <Input.Box>
                    <Input.Area
                      onChangeText={onChange}
                      {...{ onBlur, value }}
                    />
                  </Input.Box>
                  {errors.acoountName ? (
                    <Input.SubText error>
                      {errors.acoountName.message}
                    </Input.SubText>
                  ) : null}
                </Input>
              )}
            />
            <Button
              onPress={handleSubmit(onSubmit)}
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
        snapPointsMode={"fit"}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="quick"
        modal
      >
        <Sheet.Overlay />

        <Sheet.Handle />
        <Sheet.Frame
          padding="$4"
          gap="$5"
          bg="white"
          mb="$8"
          br="$4"
          width={"95%"}
          mx="2.5%"
          disableHideBottomOverflow
        >
          <Text fos="$4" fow="700">
            Fund Your Wallet
          </Text>
          <YStack bg="$white2" p="$3" br="$4">
            <Text color="$black8" fos="$1">
              {props.bank_name}
            </Text>
            <Text color="$black8">{props.account_name}</Text>
            <Text fontFamily="$gilroy" color="$black2" fos="$6.5" fow="600">
              {props.account_number}
            </Text>
            <XStack gap="$4" mt="$4">
              <Button
                size="sm"
                variant="secondary-light"
                f={1}
                onPress={copyDetails}
              >
                <Button.Icon>
                  <Icon name="ri:clipboard-fill" />
                </Button.Icon>
                <Button.Text>Copy Numbers</Button.Text>
              </Button>
              <Button size="sm" f={1} onPress={shareDetails}>
                <Button.Icon>
                  <Icon name="ri:share-forward-fill" />
                </Button.Icon>
                <Button.Text>Share</Button.Text>
              </Button>
            </XStack>
          </YStack>
          <XStack
            ai="center"
            bg="$white2"
            gap={8}
            p="$3"
            br="$4"
            onPress={handlePresentModalPress}
          >
            <View bg="$purple5" h={48} w={48} br={8} ai="center" jc="center">
              <Icon name="ri:bank-card-fill" size={24} color="#fff" />
            </View>
            <YStack f={1}>
              <Text color="$black1" fow="600">
                Fund with Card
              </Text>
              <Text color="$black6" fos="$1">
                Add money directly from your bank card
              </Text>
            </YStack>
            <Icon
              name="ri:arrow-right-s-line"
              size={24}
              color={theme.black1.val}
            />
          </XStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
