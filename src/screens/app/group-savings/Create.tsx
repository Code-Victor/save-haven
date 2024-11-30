import { groupSavingsRouter } from "@/api/routers";
import { Button, Input, Text } from "@/components/base";
import { TABBAR_HEIGHT_OFFSET } from "@/constants";
import { handleError } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { Adapt, Select, Sheet, View, XStack, YStack, useTheme } from "tamagui";
import { z } from "zod";

const frequencyOptions = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
} as const;
const groupSavingsFormSchema = z.object({
  targetAmount: z.coerce.number(),
  amountPerFrequency: z.coerce.number(),
  numberOfMembers: z.coerce.number(),
  name: z.string(),
  startDate: z.string().nonempty("Start date is required"),
  endDate: z.string().nonempty("End date is required"),
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
});
type GroupSavingsFormSchema = z.infer<typeof groupSavingsFormSchema>;
export default function CreateGroupSavingsScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const theme = useTheme();
  const { mutate, isPending } = groupSavingsRouter.create.useMutation({
    onSuccess(data) {
      toast.success(data.message);
      return queryClient
        .prefetchQuery(
          groupSavingsRouter.getById.getFetchOptions({ id: data.data.id })
        )
        .then(() =>
          router.push({
            pathname: "/(protected)/group-savings/[id]/",
            params: {
              id: data.data.id,
              name: data.data.group_name,
            },
          })
        );
    },
    onError: handleError(),
  });
  const safeAreaInsets = useSafeAreaInsets();
  const { control, handleSubmit } = useForm<GroupSavingsFormSchema>({
    resolver: zodResolver(groupSavingsFormSchema),
    defaultValues: {
      targetAmount: 0,
      amountPerFrequency: 0,
      numberOfMembers: 0,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    },
  });

  const onSubmit = React.useCallback((data: GroupSavingsFormSchema) => {
    mutate({
      group_name: data.name,
      number_in_group: data.numberOfMembers,
      group_target: data.targetAmount,
      amount_per_frequency: data.amountPerFrequency, //TODO: Fix this
      start_date: new Date(data.startDate),
      end_date: new Date(data.endDate),
      saving_frequency: data.frequency,
    });
  }, []);
  return (
    <>
      <Stack.Screen
        options={{
          title: "Create Campaign",
        }}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.white2.val,
          paddingBottom: safeAreaInsets.bottom + 16 + TABBAR_HEIGHT_OFFSET,
          paddingTop: 16,
          paddingHorizontal: safeAreaInsets.left + 20,
        }}
      >
        <YStack gap="$2">
          <Text fow="600">Crowdfunding Setting</Text>
          {/* <ProgressBar steps={2} currentStep={0} /> */}
          <YStack bg="$white1" br={16} p="$5" gap="$2" mt="$3.5">
            <YStack gap="$4">
              <Controller
                control={control}
                name="name"
                render={({
                  field: { onBlur, value, onChange },
                  formState: { errors },
                }) => (
                  <Input size="md" minWidth="100%" variant="grey">
                    <Input.Label mb="$1.5">Group Name</Input.Label>
                    <Input.Box>
                      <Input.Area
                        placeholder="Enter title"
                        onChangeText={onChange}
                        {...{ onBlur, value }}
                      />
                    </Input.Box>
                    {errors.name ? (
                      <Input.SubText error>{errors.name.message}</Input.SubText>
                    ) : null}
                  </Input>
                )}
              />

              <Controller
                control={control}
                name="numberOfMembers"
                render={({
                  field: { onBlur, value, onChange },
                  formState: { errors },
                }) => (
                  <Input size="md" minWidth="100%" variant="grey">
                    <Input.Label mb="$1.5">
                      Number of members in the group
                    </Input.Label>
                    <Input.Box>
                      <Input.Area
                        placeholder="₦0.00"
                        onChangeText={onChange}
                        keyboardType="number-pad"
                        {...{ onBlur, value: String(value) }}
                      />
                    </Input.Box>
                    {errors.numberOfMembers ? (
                      <Input.SubText error>
                        {errors.numberOfMembers.message}
                      </Input.SubText>
                    ) : null}
                  </Input>
                )}
              />
              <Controller
                control={control}
                name="targetAmount"
                render={({
                  field: { onBlur, value, onChange },
                  formState: { errors },
                }) => (
                  <Input size="md" minWidth="100%" variant="grey">
                    <Input.Label mb="$1.5">
                      How much are you aiming to save
                    </Input.Label>
                    <Input.Box>
                      <Input.Area
                        placeholder="₦0.00"
                        onChangeText={onChange}
                        keyboardType="number-pad"
                        {...{ onBlur, value: String(value) }}
                      />
                    </Input.Box>
                    {errors.targetAmount ? (
                      <Input.SubText error>
                        {errors.targetAmount.message}
                      </Input.SubText>
                    ) : null}
                  </Input>
                )}
              />

              <Input size="md" minWidth="100%" variant="grey">
                <Input.Label mb="$1.5">Starting & Withdrawal Date</Input.Label>

                <XStack gap="$2">
                  <Controller
                    control={control}
                    name="startDate"
                    render={({
                      field: { value, onChange },
                      formState: { errors },
                    }) => (
                      <XStack f={1}>
                        <Input.Box>
                          <Input.DatePicker
                            value={value ? new Date(value) : new Date()}
                            mode="date"
                            onChange={(event, date) =>
                              date
                                ? onChange(new Date(date).toISOString())
                                : null
                            }
                          />
                        </Input.Box>
                        {errors.startDate ? (
                          <Input.SubText error>
                            {errors.startDate.message}
                          </Input.SubText>
                        ) : null}
                      </XStack>
                    )}
                  />
                  <Controller
                    control={control}
                    name="endDate"
                    render={({
                      field: { value, onChange },
                      formState: { errors },
                    }) => (
                      <XStack f={1}>
                        <Input.Box>
                          <Input.DatePicker
                            value={value ? new Date(value) : new Date()}
                            mode="date"
                            onChange={(event, date) =>
                              date
                                ? onChange(new Date(date).toISOString())
                                : null
                            }
                          />
                        </Input.Box>
                        {errors.endDate ? (
                          <Input.SubText error>
                            {errors.endDate.message}
                          </Input.SubText>
                        ) : null}
                      </XStack>
                    )}
                  />
                </XStack>
              </Input>
              <Controller
                control={control}
                name="frequency"
                render={({
                  field: { onBlur, value, onChange },
                  formState: { errors },
                }) => (
                  <Input variant="grey" size="md" minWidth="100%">
                    <Input.Label mb="$1.5">Savings Frequency Mode</Input.Label>
                    <Input.Box>
                      <Select value={value} onValueChange={onChange}>
                        <Select.Trigger
                          unstyled
                          h="full"
                          bg="$colorTransparent"
                          flex={1}
                        >
                          <Select.Value placeholder="Select Savings frequency" />
                        </Select.Trigger>
                        <Adapt when="sm" platform="touch">
                          <Sheet
                            modal
                            snapPointsMode="fit"
                            dismissOnSnapToBottom
                          >
                            <Sheet.Handle />
                            <Sheet.Frame>
                              <Text fow="500" fos="$4" ta="center" py="$4">
                                Choose Frequency
                              </Text>
                              <Adapt.Contents />
                              <View h="$6" />
                            </Sheet.Frame>
                            <Sheet.Overlay />
                          </Sheet>
                        </Adapt>
                        <Select.Content>
                          <Select.Viewport>
                            {Object.keys(frequencyOptions).map((key, i) => {
                              return (
                                <Select.Item index={i} key={key} value={key}>
                                  <Select.ItemText>
                                    {frequencyOptions[key]}
                                  </Select.ItemText>
                                </Select.Item>
                              );
                            })}
                          </Select.Viewport>
                        </Select.Content>
                      </Select>
                    </Input.Box>
                    {errors.frequency ? (
                      <Input.SubText error>
                        {errors.frequency.message}
                      </Input.SubText>
                    ) : null}
                  </Input>
                )}
              />
              <Controller
                control={control}
                name="amountPerFrequency"
                render={({
                  field: { onBlur, value, onChange },
                  formState: { errors },
                }) => (
                  <Input size="md" minWidth="100%" variant="grey">
                    <Input.Label mb="$1.5">
                      How much do each member want to save per frequency
                    </Input.Label>
                    <Input.Box>
                      <Input.Area
                        placeholder="₦0.00"
                        onChangeText={onChange}
                        keyboardType="number-pad"
                        {...{ onBlur, value: String(value) }}
                      />
                    </Input.Box>
                    {errors.amountPerFrequency ? (
                      <Input.SubText error>
                        {errors.amountPerFrequency.message}
                      </Input.SubText>
                    ) : null}
                  </Input>
                )}
              />
            </YStack>
          </YStack>
          <Button loading={isPending} onPress={handleSubmit(onSubmit)}>
            <Button.Text>Create</Button.Text>
          </Button>
        </YStack>
      </KeyboardAwareScrollView>
    </>
  );
}
