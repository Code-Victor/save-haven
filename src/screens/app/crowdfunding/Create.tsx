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
import { crowdfundingRouter, targetSavingRouter } from "@/api/routers";
import { isAxiosErrorWithMessage } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";

const campaignCategories = [
  "EDUCATION",
  "HEALTH",
  "CHARITY",
  "BUSINESS",
  "PERSONAL",
  "CREATIVE",
  "EMERGENCY",
  "OTHERS",
] as const;
const targetSavingsFormSchema = z.object({
  title: z.string(),
  story: z.string(),
  targetAmount: z.coerce.number(),
  images: z
    .object({
      uri: z.string(),
      name: z.string(),
      type: z.string(),
    })
    .array()
    .max(3, {
      message: "maximum of 3 images allowed for campaign",
    }),
  state: z.string(),
  personal: z.boolean(),
  category: z.enum(campaignCategories),
});
type TargetSavingsFormSchema = z.infer<typeof targetSavingsFormSchema>;
export default function CreateTargetSavingsScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const theme = useTheme();
  const { mutate, isPending } = crowdfundingRouter.create.useMutation({
    onSuccess(data) {
      toast.success(data.message);
      return queryClient
        .prefetchQuery(
          crowdfundingRouter.getById.getFetchOptions({ id: data.data._id })
        )
        .then(() =>
          router.push({
            pathname: "/(protected)/crowdfunding/[id]/",
            params: {
              id: data.data._id,
              name: data.data.campaign_title,
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
      targetAmount: 0,
    },
  });

  const onSubmit = React.useCallback((data: TargetSavingsFormSchema) => {
    mutate({
      campaign_title: data.title,
      campaign_story: data.story,
      target_amount: data.targetAmount,
      campaign_category: data.category,
      is_personal: data.personal,
      state: data.state,
      images: data.images,
    });
  }, []);
  return (
    <>
      <Stack.Screen
        options={{
          title: "Create Campaign",
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
          <Text fow="600">Crowdfunding Setting</Text>
          {/* <ProgressBar steps={2} currentStep={0} /> */}
          <YStack bg="$white1" br={16} p="$5" gap="$2" mt="$3.5">
            <YStack gap="$4">
              <Controller
                control={control}
                name="title"
                render={({
                  field: { onBlur, value, onChange },
                  formState: { errors },
                }) => (
                  <Input size="md" minWidth="100%" variant="grey">
                    <Input.Label mb="$1.5">Campaign title</Input.Label>
                    <Input.Box>
                      <Input.Area
                        placeholder="Enter title"
                        onChangeText={onChange}
                        {...{ onBlur, value }}
                      />
                    </Input.Box>
                    {errors.title ? (
                      <Input.SubText error>
                        {errors.title.message}
                      </Input.SubText>
                    ) : null}
                  </Input>
                )}
              />
              <Controller
                control={control}
                name="story"
                render={({
                  field: { onBlur, value, onChange },
                  formState: { errors },
                }) => (
                  <Input size="md" minWidth="100%" variant="grey">
                    <Input.Label mb="$1.5">Campaign story</Input.Label>
                    <Input.Box>
                      <Input.Area
                        placeholder="Enter story"
                        onChangeText={onChange}
                        {...{ onBlur, value }}
                      />
                    </Input.Box>
                    {errors.story ? (
                      <Input.SubText error>
                        {errors.story.message}
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
                    <Input.Label mb="$1.5">Goal amount</Input.Label>
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

              <Controller
                control={control}
                name="images"
                render={({
                  field: { onBlur, value, onChange },
                  formState: { errors },
                }) => (
                  <Input size="md" minWidth="100%" variant="grey">
                    <Input.Label mb="$1.5">
                      Upload campaign photos (max 3)
                    </Input.Label>
                    <Input.ImagePicker value={value} onChange={onChange} />
                    {errors.images ? (
                      <Input.SubText error>
                        {errors.images.message}
                      </Input.SubText>
                    ) : null}
                  </Input>
                )}
              />
              <Controller
                control={control}
                name="state"
                render={({
                  field: { onBlur, value, onChange },
                  formState: { errors },
                }) => (
                  <Input size="md" minWidth="100%" variant="grey">
                    <Input.Label mb="$1.5">
                      What state/country are you from?
                    </Input.Label>
                    <Input.Box>
                      <Input.Area
                        placeholder="Enter your state"
                        onChangeText={onChange}
                        {...{ onBlur, value }}
                      />
                    </Input.Box>
                    {errors.state ? (
                      <Input.SubText error>
                        {errors.state.message}
                      </Input.SubText>
                    ) : null}
                  </Input>
                )}
              />

              <Controller
                control={control}
                name="personal"
                render={({
                  field: { onBlur, value, onChange },
                  formState: { errors },
                }) => (
                  <Input variant="grey" size="md" minWidth="100%">
                    <Input.Label mb="$1.5">
                      Is this campaign for your or someone else
                    </Input.Label>
                    <Input.Box>
                      <Select
                        value={value ? "true" : "false"}
                        onValueChange={(value) => {
                          onChange(eval(value) as boolean);
                        }}
                      >
                        <Select.Trigger
                          unstyled
                          h="full"
                          bg="$colorTransparent"
                          flex={1}
                        >
                          <Select.Value placeholder="Select option" />
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
                                Select option
                              </Text>
                              <Adapt.Contents />
                              <View h="$6" />
                            </Sheet.Frame>
                            <Sheet.Overlay />
                          </Sheet>
                        </Adapt>
                        <Select.Content>
                          <Select.Viewport>
                            {[false, true].map((key, i) => {
                              return (
                                <Select.Item
                                  index={i}
                                  key={String(key)}
                                  value={String(key)}
                                >
                                  <Select.ItemText>
                                    {key ? "Yes" : "No"}
                                  </Select.ItemText>
                                </Select.Item>
                              );
                            })}
                          </Select.Viewport>
                        </Select.Content>
                      </Select>
                    </Input.Box>
                    {errors.personal ? (
                      <Input.SubText error>
                        {errors.personal.message}
                      </Input.SubText>
                    ) : null}
                  </Input>
                )}
              />
              <Controller
                control={control}
                name="category"
                render={({
                  field: { onBlur, value, onChange },
                  formState: { errors },
                }) => (
                  <Input variant="grey" size="md" minWidth="100%">
                    <Input.Label mb="$1.5">Campaign category</Input.Label>
                    <Input.Box>
                      <Select value={value} onValueChange={onChange}>
                        <Select.Trigger
                          unstyled
                          h="full"
                          bg="$colorTransparent"
                          flex={1}
                        >
                          <Select.Value placeholder="Select option" />
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
                                Select option
                              </Text>
                              <Adapt.Contents />
                              <View h="$6" />
                            </Sheet.Frame>
                            <Sheet.Overlay />
                          </Sheet>
                        </Adapt>
                        <Select.Content>
                          <Select.Viewport>
                            {campaignCategories.map((key, i) => {
                              return (
                                <Select.Item index={i} key={key} value={key}>
                                  <Select.ItemText tt="capitalize">
                                    {key}
                                  </Select.ItemText>
                                </Select.Item>
                              );
                            })}
                          </Select.Viewport>
                        </Select.Content>
                      </Select>
                    </Input.Box>
                    {errors.category ? (
                      <Input.SubText error>
                        {errors.category.message}
                      </Input.SubText>
                    ) : null}
                  </Input>
                )}
              />
            </YStack>
            <Button loading={isPending} onPress={handleSubmit(onSubmit)}>
              <Button.Text>Create</Button.Text>
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
    </>
  );
}
