import { Button, Icon, Text, UnifiedIconName, Input } from "@/components/base";
import { TABBAR_HEIGHT_OFFSET } from "@/constants";
import { savingsOptions } from "@/data";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ScrollView,
  useTheme,
  View,
  XStack,
  YStack,
  Adapt,
  Sheet,
  Select,
} from "tamagui";
import { z } from "zod";
import { toast } from "sonner-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as React from "react";
import { targetSavingRouter } from "@/api/routers";
import { isAxiosErrorWithMessage } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";

const frequencyOptions = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
} as const;
const daysOfWeekOptions = {
  SUNDAY: "Sunday",
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
} as const;
const targetSavingsFormSchema = z.object({
  target: z.string().nonempty("target Amount is required"),
  amount: z.string().nonempty("target Amount is required"),
  name: z.string().nonempty("Name is required"),
  startDate: z.string().nonempty("Start date is required"),
  endDate: z.string().nonempty("End date is required"),
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
  dayOfWeek: z.enum([
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ]),
});
type TargetSavingsFormSchema = z.infer<typeof targetSavingsFormSchema>;
export default function CreateTargetSavingsScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const theme = useTheme();
  const { mutate, isPending } = targetSavingRouter.create.useMutation({
    onSuccess(data) {
      toast.success(data.message);
      return queryClient
        .prefetchQuery(
          targetSavingRouter.getById.getFetchOptions({ id: data.data.id })
        )
        .then(() =>
          router.push({
            pathname: "/(protected)/target-savings/[id]/",
            params: {
              id: data.data.id,
              name: data.data.savings_name,
            },
          })
        );
    },
    onError(err) {
      if (isAxiosErrorWithMessage(err)) {
        toast.error(err?.response?.data.message ?? "An error occurred");
      }
    },
  });
  const safeAreaInsets = useSafeAreaInsets();
  const { control, handleSubmit } = useForm<TargetSavingsFormSchema>({
    resolver: zodResolver(targetSavingsFormSchema),
    defaultValues: {
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    },
  });

  const onSubmit = React.useCallback((data: TargetSavingsFormSchema) => {
    mutate({
      savings_name: data.name,
      target_amount: Number(data.target),
      amount_per_frequency: Number(data.amount),
      start_date: new Date(data.startDate),
      end_date: new Date(data.endDate),
      savings_frequency: data.frequency,
      days_of_week: data.dayOfWeek,
    });
  }, []);
  return (
    <>
      <Stack.Screen
        options={{
          title: "Create Target Savings",
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
          <Text fow="600">Target Saving Setting</Text>
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
                    <Input.Label mb="$1.5">Savings Target Name</Input.Label>
                    <Input.Box>
                      <Input.Area
                        placeholder="birthday party"
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
                name="target"
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
                        {...{ onBlur, value }}
                      />
                    </Input.Box>
                    {errors.target ? (
                      <Input.SubText error>
                        {errors.target.message}
                      </Input.SubText>
                    ) : null}
                  </Input>
                )}
              />
              <Controller
                control={control}
                name="amount"
                render={({
                  field: { onBlur, value, onChange },
                  formState: { errors },
                }) => (
                  <Input size="md" minWidth="100%" variant="grey">
                    <Input.Label mb="$1.5">
                      Amount you want to save per interval
                    </Input.Label>
                    <Input.Box>
                      <Input.Area
                        placeholder="₦0.00"
                        onChangeText={onChange}
                        keyboardType="number-pad"
                        {...{ onBlur, value }}
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
                name="dayOfWeek"
                render={({
                  field: { onBlur, value, onChange },
                  formState: { errors },
                }) => (
                  <Input variant="grey" size="md" minWidth="100%">
                    <Input.Label mb="$1.5">Savings Frequency Time</Input.Label>
                    <Input.Box>
                      <Select value={value} onValueChange={onChange}>
                        <Select.Trigger
                          unstyled
                          h="full"
                          bg="$colorTransparent"
                          flex={1}
                        >
                          <Select.Value placeholder="Select Preferred Time" />
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
                            {Object.keys(daysOfWeekOptions).map((key, i) => {
                              return (
                                <Select.Item index={i} key={key} value={key}>
                                  <Select.ItemText>
                                    {daysOfWeekOptions[key]}
                                  </Select.ItemText>
                                </Select.Item>
                              );
                            })}
                          </Select.Viewport>
                        </Select.Content>
                      </Select>
                    </Input.Box>
                    {errors.dayOfWeek ? (
                      <Input.SubText error>
                        {errors.dayOfWeek.message}
                      </Input.SubText>
                    ) : null}
                  </Input>
                )}
              />
            </YStack>
            <Button loading={isPending} onPress={handleSubmit(onSubmit)}>
              <Button.Text>Create Target</Button.Text>
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
    </>
  );
}

function ProgressBar({
  steps,
  currentStep,
}: {
  steps: number;
  currentStep: number;
}) {
  const components = React.useMemo(() => {
    const components: React.ReactNode[] = [];
    // append a view and a separator for each step
    for (let i = 0; i < steps; i++) {
      const isActived = i === currentStep;
      const notLastStep = i < steps - 1;
      components.push(
        <View
          key={i}
          ai="center"
          jc="center"
          height={32}
          width={32}
          br={8}
          bg={isActived ? "$green6" : "#8A8A8A"}
        >
          <Text fow="600" fos="$2">
            {i + 1}
          </Text>
        </View>
      );
      if (notLastStep) {
        components.push(
          <View
            key={`separator-${i}`}
            f={1}
            h={1}
            bg="$black6"
            style={{
              opacity: i === currentStep ? 1 : 0.5,
            }}
          />
        );
      }
    }
    return components;
  }, [steps, currentStep]);
  return (
    <XStack ai="center" gap="$2">
      {components}
    </XStack>
  );
}
