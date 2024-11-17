import { Button, Icon, Input, Text } from "@/components/base";
import { TABBAR_HEIGHT_OFFSET } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { Dimensions, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Adapt,
  ScrollView,
  Select,
  Sheet,
  SizableText,
  Tabs,
  useTheme,
  View,
  XStack,
  YStack,
} from "tamagui";
import { z } from "zod";

const transferFormSchema = z.object({
  accountNumber: z.coerce
    .number()
    .refine(
      (val) => `${val}`.length === 10,
      "Account number must be 10 digit long"
    ),
  bankName: z.string().min(1),
});
type TransferFormSchema = z.infer<typeof transferFormSchema>;
export default function MakeTransfer() {
  const router = useRouter();
  const theme = useTheme();
  const safeAreaInsets = useSafeAreaInsets();
  const { control, handleSubmit, setValue } = useForm<TransferFormSchema>({
    resolver: zodResolver(transferFormSchema),
  });
  const onSubmit = React.useCallback((data: TransferFormSchema) => {
    console.log(data);
    router.push("/(protected)/transfer/complete-transfer");
  }, []);
  const setBeneficiary = React.useCallback(
    (accountNumber: number, bankName: string) => {
      setValue("accountNumber", accountNumber);
      setValue("bankName", bankName);
    },
    [setValue]
  );
  return (
    <>
      <Stack.Screen
        options={{
          title: "Make Transfer",
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
        <YStack gap="$2">
          <Text fos="$4" fow="600" color="$black1">
            Receiver Bank Details
          </Text>
          <YStack bg="$white1" br="$4" p="$4" gap="$6">
            <Controller
              control={control}
              name="accountNumber"
              render={({
                field: { onBlur, value, onChange },
                formState: { errors },
              }) => (
                <Input variant="grey" size="md" minWidth="100%">
                  <Input.Label mb="$1.5">Enter Receiver Account</Input.Label>
                  <Input.Box>
                    <Input.Area
                      onChangeText={onChange}
                      keyboardType="number-pad"
                      {...{ onBlur, value: value?.toString() }}
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
                  <Input.Label mb="$1.5">Choose Bank</Input.Label>
                  <Input.Box>
                    <Select value={value} onValueChange={onChange}>
                      <Select.Trigger
                        unstyled
                        h="full"
                        bg="$colorTransparent"
                        flex={1}
                      >
                        <Select.Value placeholder="Search..." />
                      </Select.Trigger>
                      <Adapt when="sm" platform="touch">
                        <Sheet modal snapPointsMode="fit">
                          <Sheet.Handle />
                          <Sheet.Frame>
                            <Text fow="500" fos="$4" ta="center" py="$4">
                              Choose Bank
                            </Text>
                            <Adapt.Contents />
                          </Sheet.Frame>
                          <Sheet.Overlay />
                        </Sheet>
                      </Adapt>

                      <Select.Content>
                        <Select.Viewport>
                          <Select.Item index={2} value="hello">
                            <Select.ItemText>
                              Gurantee Trust Bank
                            </Select.ItemText>
                          </Select.Item>
                          <Select.Item index={3} value="hey">
                            <Select.ItemText>PiggyVest</Select.ItemText>
                          </Select.Item>
                        </Select.Viewport>
                      </Select.Content>
                    </Select>
                  </Input.Box>
                  {errors.bankName ? (
                    <Input.SubText error>
                      {errors.bankName.message}
                    </Input.SubText>
                  ) : null}
                </Input>
              )}
            />
          </YStack>
          <Button mt="$2" onPress={handleSubmit(onSubmit)}>
            <Button.Text>Next</Button.Text>
          </Button>
        </YStack>
        <RecentBeneficiary />
      </ScrollView>
    </>
  );
}

function RecentBeneficiary({
  setBeneficiary,
}: {
  setBeneficiary?: (accountNumber: number, bankName: string) => void;
}) {
  return (
    <YStack gap="$2" mt="$6">
      <Text fos="$4" fow="600" color="$black1">
        Receiver Bank Details
      </Text>
      <YStack bg="$white1" br="$4" p="$4" gap="$6">
        <Input variant="grey" size="md" minWidth="100%">
          <Input.Box>
            <View h={24} w={24} ai="center" jc="center">
              <Icon name="ri:search-2-line" color="#8A8E99" size={20} />
            </View>
            <Input.Area placeholder="Search for a beneficiary" />
          </Input.Box>
        </Input>
        <Tabs
          flexDirection="column"
          orientation="horizontal"
          defaultValue="recent"
        >
          <Tabs.List disablePassBorderRadius aria-label="Manage your account">
            <Tabs.Tab value="recent" f={1}>
              <SizableText>Recents</SizableText>
            </Tabs.Tab>
            <Tabs.Tab value="beneficiary" f={1}>
              <SizableText>Beneficiaries</SizableText>
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Content value="recent">
            <YStack gap="$2" mt="$2">
              <RecentAccounts
                name="John Doe"
                accountNumber={1234567890}
                bankName="Guaranty Trust Bank"
                image={require("@/assets/images/gtb.png")}
              />
            </YStack>
          </Tabs.Content>
          <Tabs.Content value="beneficiary">
            <YStack gap="$2" mt="$2">
              <RecentAccounts
                name="Mary Jane"
                accountNumber={1234567890}
                bankName="Guaranty Trust Bank"
                image={require("@/assets/images/gtb.png")}
              />
            </YStack>
          </Tabs.Content>
        </Tabs>
      </YStack>
    </YStack>
  );
}

export function RecentAccounts({
  name,
  accountNumber,
  image,
  bankName,
}: {
  name: string;
  accountNumber: number;
  bankName: string;
  image: string;
}) {
  return (
    <XStack gap="$4" ai="center">
      <Image
        source={require("@/assets/images/gtb.png")}
        style={{
          height: 48,
          width: 48,
          borderRadius: 12,
        }}
      />
      <YStack gap="$1">
        <Text color="$black2" fow="500">
          {name}
        </Text>
        <Text color="$black6" fos="$1">
          {accountNumber} - {bankName}
        </Text>
      </YStack>
    </XStack>
  );
}
