import {
  Button,
  Icon,
  IconButton,
  Input,
  SafeArea,
  Text,
} from "@/components/base";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link,useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { View, YStack } from "tamagui";
import { z } from "zod";

const verifyEmailSchema = z.object({
  otp: z.string(),
});
type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;
const VerifyEmail = () => {
  const router= useRouter();
  const [otpReady, setOtpReady] = React.useState(false);

  const { control, handleSubmit } = useForm<VerifyEmailSchema>({
    resolver: zodResolver(verifyEmailSchema),
  });

  const onSubmit = (data: VerifyEmailSchema) => {
    console.log(data);
    router.push("/create-account")
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
          <Controller
            {...{ control }}
            name="otp"
            render={({ field, formState }) => (
              <Input size="md" minWidth="100%">
                <Input.OTP
                  {...{
                    value: field.value,
                    onChangeText: field.onChange,
                    maximumLength: 6,
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
        </YStack>
      </YStack>
      <YStack pb="$16" gap="$3" px="$4">
        <Button variant="primary" onPress={handleSubmit(onSubmit)} full>
          <Button.Text>Verify Email</Button.Text>
        </Button>
      </YStack>
    </SafeArea>
  );
};

export default VerifyEmail;
