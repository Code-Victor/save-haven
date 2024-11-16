import { authRouter } from "@/api/routers";
import { Button, Icon, Input, SafeArea, Text } from "@/components/base";
import { isAxiosErrorWithMessage } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { toast } from "sonner-native";
import { View, YStack } from "tamagui";
import { z } from "zod";

const verifyEmailSchema = z.object({
  otp: z.string(),
});
type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;
const VerifyEmail = () => {
  const router = useRouter();
  const { email, otp } = useLocalSearchParams<{ email: string; otp: string }>();
  const [otpReady, setOtpReady] = React.useState(false);
  const { mutate, isPending } = authRouter.verifyOTP.useMutation({
    onSuccess: (data) => {
      router.push({ pathname: "/(auth)/create-account", params: { email } });
      toast.success(data.message);
    },
    onError: (err) => {
      if (isAxiosErrorWithMessage(err)) {
        toast.error(err?.response?.data.message ?? "An error occurred");
      }
    },
  });

  const { control, handleSubmit, getValues } = useForm<VerifyEmailSchema>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      otp,
    },
  });

  React.useEffect(() => {
    const { otp } = getValues();
    if (otpReady) {
      mutate({
        email,
        otp,
      });
      Keyboard.dismiss();
    }
  }, [otpReady]);

  const onSubmit = (data: VerifyEmailSchema) => {
    mutate({
      email,
      otp: data.otp,
    });
  };
  return (
    <SafeArea flex={1} bg="$background">
      <View ai="center" jc="center">
        <Icon name="save-haven-emblem" size={160} />
      </View>
      <YStack gap="$9" px="$5" f={1}>
        <YStack gap="$4">
          <Text ff="$gilroy" fow="600" fos="$7" ta="center" color="$purple6">
            Verify Email
          </Text>
          <Text color="$black4" fow="500" ta="center" mx="auto" maxWidth={324}>
            We just sent your verification code to your email, please enter the
            code below
          </Text>
        </YStack>
        <YStack gap="$4">
          <View maxWidth={240} mx="auto">
            <Controller
              {...{ control }}
              name="otp"
              render={({ field, formState }) => (
                <Input size="md" minWidth="100%">
                  <Input.OTP
                    {...{
                      value: field.value,
                      onChangeText: field.onChange,
                      maximumLength: 4,
                      error: !!formState.errors.otp?.message,
                      setIsPinReady: setOtpReady,
                    }}
                  />
                  {formState.errors.otp?.message ? (
                    <Input.SubText error>
                      {formState.errors.otp?.message}
                    </Input.SubText>
                  ) : null}
                </Input>
              )}
            />
          </View>
        </YStack>
      </YStack>
      <YStack pb="$16" gap="$3" px="$4">
        <Button
          loading={isPending}
          variant="primary"
          onPress={handleSubmit(onSubmit)}
          full
        >
          <Button.Text>Verify Email</Button.Text>
        </Button>
      </YStack>
    </SafeArea>
  );
};

export default VerifyEmail;
