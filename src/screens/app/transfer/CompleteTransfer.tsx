import * as React from "react";
import { Button, Icon, Input, Text } from "@/components/base";
import { TABBAR_HEIGHT_OFFSET } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ScrollView,
  useTheme,
  YStack,
  Select,
  Adapt,
  View,
  SizableText,
  Tabs,
  H5,
  Sheet,
  Separator,
  XStack,
} from "tamagui";
import { string, z } from "zod";
import { Image } from "expo-image";
import { monify } from "@/utils";
import { RecentAccounts } from ".";
import { NumberKeyboard, PINInput } from "@/components/base/PinInput";

const samplePrices = [500.0, 1000.0, 2000.0, 3000.0, 5000.0, 10000.0, 20000.0];
const completeTransferFormSchema = z.object({
  amount: z.coerce.number().min(0),
  description: z.string().optional(),
});
type CompleteTransferFormSchema = z.infer<typeof completeTransferFormSchema>;
export default function CompleteTransfer() {
  const theme = useTheme();

  const safeAreaInsets = useSafeAreaInsets();
  const [accountInfo, setAccountInfo] = React.useState<{
    accountName: string;
    bankName: string;
    accountNumber: number;
    amount: number;
    description?: string;
    transfactionFee: number;
  } | null>(null);
  const { control, handleSubmit, setValue, watch } =
    useForm<CompleteTransferFormSchema>({
      resolver: zodResolver(completeTransferFormSchema),
      defaultValues: {
        amount: 0,
      },
    });
  const onSubmit = React.useCallback((data: CompleteTransferFormSchema) => {
    setAccountInfo({
      accountName: "Christopher Alade",
      accountNumber: 1234567890,
      bankName: "Guaranty Trust Bank",
      transfactionFee: 0,
      ...data,
    });
  }, []);
  const amount = watch("amount");
  const onClose = React.useCallback(() => {
    setAccountInfo(null);
  }, []);
  const sheetOpen = Boolean(accountInfo);

  const renderPrices = React.useCallback(() => {
    return (
      <>
        {samplePrices.map((price, index) => {
          const isActive = amount === price;
          return (
            <Badge
              key={index}
              title={monify(price)}
              active={isActive}
              onPress={() => {
                setValue("amount", price);
              }}
            />
          );
        })}
      </>
    );
  }, [amount]);
  return (
    <>
      <Stack.Screen
        options={{
          title: "Complete Transfer",
        }}
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.white2.val,
          paddingBottom: safeAreaInsets.bottom + 16,
          paddingTop: 16,
          paddingHorizontal: safeAreaInsets.left + 20,
        }}
      >
        <YStack gap="$4" ai="center">
          <YStack gap="$1">
            <Text fos="$2" fow="500" ta="center">
              Christopher Alade
            </Text>
            <Text fos="$1" fow="600" ta="center">
              {monify(200000000)}
            </Text>
          </YStack>
          <View bg="$purple6" br={8} h={28} w={28} ai="center" jc="center">
            <Icon
              name="ri:arrow-down-double-line"
              size={20}
              color={theme.green6.val}
            />
          </View>

          <RecentAccounts
            name="Mary Jane"
            accountNumber={1234567890}
            bankName="Guaranty Trust Bank"
            image={require("@/assets/images/gtb.png")}
          />
        </YStack>
        <YStack p="$4" bg="$white1" gap="$4" br={8} mt="$8">
          <Controller
            control={control}
            name="amount"
            render={({
              field: { onBlur, value, onChange },
              formState: { errors },
            }) => (
              <Input variant="grey" size="md" minWidth="100%">
                <Input.Label mb="$1.5">Amount to Send</Input.Label>
                <Input.Box pos="relative" overflow="hidden">
                  <View
                    bg="$black025"
                    pos="absolute"
                    left={0}
                    top={0}
                    bottom={0}
                    w="$3"
                    ai="center"
                    jc="center"
                  >
                    <Text fow="600" fos="$4" color="$black1">
                      ₦
                    </Text>
                  </View>
                  <View w="$3" />
                  <Input.Area
                    placeholder="0.00"
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
          <XStack gap="$2" flexWrap="wrap">
            {renderPrices()}
          </XStack>
        </YStack>
        <YStack p="$4" bg="$white1" gap="$4" br={8} mt="$4">
          <Controller
            control={control}
            name="description"
            render={({
              field: { onBlur, value, onChange },
              formState: { errors },
            }) => (
              <Input variant="grey" size="md" minWidth="100%">
                <Input.Label mb="$1.5">What’s this for? (Optional)</Input.Label>
                <Input.Box>
                  <Input.Area
                    placeholder="e.g. business"
                    onChangeText={onChange}
                    // textarea
                    multiline
                    numberOfLines={4}
                    verticalAlign="top"
                    p="$2"
                    height="$8"
                    {...{ onBlur, value: value?.toString() }}
                  />
                </Input.Box>
                {errors.description ? (
                  <Input.SubText error>
                    {errors.description.message}
                  </Input.SubText>
                ) : null}
              </Input>
            )}
          />
        </YStack>
        <Button mt="$16" onPress={handleSubmit(onSubmit)}>
          <Button.Text>Confirm Payment</Button.Text>
        </Button>
      </ScrollView>
      <PaymentSheet
        {...(sheetOpen
          ? {
              ...accountInfo!,
              open: sheetOpen as boolean,
              onOpenChange: onClose,
            }
          : { open: sheetOpen })}
      />
    </>
  );
}

function Badge({
  title,
  active,
  onPress,
}: {
  title: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <View
      ai="center"
      jc="center"
      borderWidth={1}
      borderColor="#9DA1AA"
      br="$6"
      py="$1"
      px="$3"
      onPress={onPress}
      {...(active ? { bg: "#9DA1AA" } : {})}
    >
      <Text fos="$1" fow="500">
        {title}
      </Text>
    </View>
  );
}

type PaymentSheetProps =
  | {
      open: false;
    }
  | {
      open: boolean;
      onOpenChange: () => void;
      accountName: string;
      accountNumber: number;
      bankName: string;
      description?: string;
      amount: number;
      transfactionFee: number;
    };
function PaymentSheet(props: PaymentSheetProps) {
  const [paymentCase, setPaymentCase] = React.useState<
    "DEFAULT" | "CREATE_PIN" | "ENTER_PIN"
  >("DEFAULT");
  const theme = useTheme();
  if (!props.open) return null;
  const {
    open,
    onOpenChange,
    accountName,
    bankName,
    accountNumber,
    amount,
    description,
    transfactionFee,
  } = props;
  const display = {
    Bank: bankName,
    "Account Number": String(accountNumber),
    "Account Name": accountName,
    description: description,
    Amount: monify(amount),
    "Transaction Fee": monify(transfactionFee),
  };
  return (
    <Sheet
      open={open}
      onOpenChange={() => {
        onOpenChange();
        setPaymentCase("DEFAULT");
      }}
      snapPointsMode={"fit"}
      dismissOnSnapToBottom
      zIndex={100_000}
      animation="quick"
      modal
    >
      <Sheet.Overlay />

      <Sheet.Handle />
      <Sheet.Frame
        px={0}
        pt="$4"
        gap="$5"
        bg="white"
        width={"95%"}
        mx="2.5%"
        mb="$8"
        br="$4"
        disableHideBottomOverflow
      >
        {paymentCase === "CREATE_PIN" ? (
          <CreatePinCase next={() => setPaymentCase("ENTER_PIN")} />
        ) : paymentCase === "ENTER_PIN" ? (
          <EnterPinCase
            next={() => {
              onOpenChange();
              router.push("/(protected)/transfer/success");
            }}
          />
        ) : (
          <DefaultCase
            amount={amount}
            display={display}
            next={() => setPaymentCase("CREATE_PIN")}
          />
        )}
      </Sheet.Frame>
    </Sheet>
  );
}

function DefaultCase({
  amount,
  display,
  next,
}: {
  amount: number;
  display: Record<string, string | undefined>;
  next?: () => void;
}) {
  return (
    <YStack gap="$8" px="$4">
      <YStack gap="$2" ai="center" pt="$4">
        <Text fos="$2" fow="600" color="$black6" ta="center">
          Amount to Send
        </Text>
        <Text fos="$6" fow="700" color="$black1">
          {monify(amount)}
        </Text>
      </YStack>
      <YStack>
        {Object.entries(display).map(([key, value], index) => (
          <XStack key={index} gap="$2" ai="center" jc="space-between" py="$3">
            <Text fos="$2" color="$black6" f={1}>
              {key}
            </Text>
            <Text
              fos="$2"
              fow="600"
              ta="right"
              color="$black1"
              f={1}
              numberOfLines={1}
            >
              {value}
            </Text>
          </XStack>
        ))}
      </YStack>
      <Button onPress={next}>
        <Button.Text>Pay Now</Button.Text>
      </Button>
    </YStack>
  );
}

const createPinSchema = z.object({
  pin: z.string().length(4),
});
type CreatePinSchema = z.infer<typeof createPinSchema>;
function CreatePinCase({ next }: { next?: () => void }) {
  const { control, handleSubmit, setValue, getValues } =
    useForm<CreatePinSchema>({
      resolver: zodResolver(createPinSchema),
      defaultValues: {
        pin: "",
      },
    });

  const handleNumberPress = React.useCallback(
    (num: string) => {
      const { pin } = getValues();
      if (pin.length < 4) {
        setValue("pin", pin + num);
      }
    },
    [setValue, getValues]
  );

  const handleDelete = React.useCallback(() => {
    const { pin } = getValues();

    setValue("pin", pin.slice(0, -1));
  }, [getValues, setValue]);

  const handleClear = React.useCallback(() => {
    setValue("pin", "");
  }, []);
  const onSubmit = React.useCallback(() => {
    next?.();
  }, [next]);

  return (
    <YStack f={1} px="$4" pb="$4">
      <Text fow="600" fos="$4" ta="center" mb="$4">
        Create your Withdrawal Pin
      </Text>
      <YStack gap="$10">
        <Controller
          {...{ control }}
          name="pin"
          render={({ field, formState }) => (
            <Input size="md" minWidth="100%" key="withdrawal-pin">
              <Input.Label mb="$1.5" ta="center">
                Enter Pin
              </Input.Label>
              <View w={260} mx="auto">
                <PINInput
                  value={field.value}
                  onChangeText={field.onChange}
                  maximumLength={4}
                  maskInput={false} // Enable masking
                  onComplete={() => {
                    handleSubmit(onSubmit)();
                  }}
                  error={!!formState.errors.pin?.message}
                />
              </View>
              {formState.errors.pin?.message ? (
                <Input.SubText error>
                  {formState.errors.pin?.message}
                </Input.SubText>
              ) : null}
            </Input>
          )}
        />

        <NumberKeyboard
          onNumberPress={handleNumberPress}
          onDelete={handleDelete}
          onClear={handleClear}
        />
      </YStack>
    </YStack>
  );
}
const enterPinSchema = z.object({
  pin: z.string().length(4),
});
type EnterPinSchema = z.infer<typeof enterPinSchema>;
function EnterPinCase({ next }: { next?: () => void }) {
  const { control, handleSubmit, setValue, getValues } =
    useForm<EnterPinSchema>({
      resolver: zodResolver(createPinSchema),
      defaultValues: {
        pin: "",
      },
    });

  const handleNumberPress = React.useCallback(
    (num: string) => {
      const { pin } = getValues();
      if (pin.length < 4) {
        setValue("pin", pin + num);
      }
    },
    [setValue, getValues]
  );

  const handleDelete = React.useCallback(() => {
    const { pin } = getValues();

    setValue("pin", pin.slice(0, -1));
  }, [getValues, setValue]);

  const handleClear = React.useCallback(() => {
    setValue("pin", "");
  }, []);
  const onSubmit = React.useCallback(() => {
    next?.();
  }, [next]);
  return (
    <YStack f={1} px="$4" pb="$4">
      <YStack gap="$10">
        <Controller
          {...{ control }}
          name="pin"
          render={({ field, formState }) => (
            <Input size="md" minWidth="100%">
              <Input.Label mb="$1.5" ta="center">
                Enter Pin
              </Input.Label>
              <View w={260} mx="auto">
                <PINInput
                  key="enter-pin"
                  value={field.value}
                  onChangeText={field.onChange}
                  maximumLength={4}
                  maskInput // Enable masking
                  onComplete={() => handleSubmit(onSubmit)()}
                  error={!!formState.errors.pin?.message}
                />
              </View>
              {formState.errors.pin?.message ? (
                <Input.SubText error>
                  {formState.errors.pin?.message}
                </Input.SubText>
              ) : null}
            </Input>
          )}
        />

        <NumberKeyboard
          onNumberPress={handleNumberPress}
          onDelete={handleDelete}
          onClear={handleClear}
        />
      </YStack>
    </YStack>
  );
}

function Keypad() {
  return null;
}
