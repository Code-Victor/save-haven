import {
  Button,
  Icon,
  IconButton,
  Input,
  SafeArea,
  Text,
} from "@/components/base";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { View, YStack } from "tamagui";
import { z } from "zod";

const signupFormSchema = z.object({
  email: z.string().email(),
});
type SignupFormSchema = z.infer<typeof signupFormSchema>;
const Signup = () => {
  const { control, handleSubmit } = useForm<SignupFormSchema>({
    resolver: zodResolver(signupFormSchema),
  });

  const onSubmit = (data: SignupFormSchema) => {
    console.log(data);
  };
  return (
    <SafeArea flex={1} bg="$background">
      <View ai="center" jc="center">
        <Icon name="save-haven-emblem" size={160} />
      </View>
      <YStack gap="$9" px="$5" f={1}>
        <Text ff="$gilroy" fow="600" fos="$7" ta="center" color="$purple6">
          Create account
        </Text>
        <YStack gap="$4">
          <Controller
            control={control}
            name="email"
            render={({
              field: { onBlur, value, onChange },
              formState: { errors },
            }) => (
              <Input size="md" minWidth="100%">
                <Input.Label mb="$1.5">Email address</Input.Label>
                <Input.Box>
                  <Input.Area
                    placeholder="youremail@gmail.com"
                    onChangeText={onChange}
                    keyboardType="email-address"
                    {...{ onBlur, value }}
                  />
                </Input.Box>
                {errors.email ? (
                  <Input.SubText error>{errors.email.message}</Input.SubText>
                ) : null}
              </Input>
            )}
          />
        </YStack>
      </YStack>
      <YStack py="$11" gap="$3" px="$4">
        <Button variant="primary" onPress={handleSubmit(onSubmit)} full>
          <Button.Text>Verify Email</Button.Text>
        </Button>
        <Text ta="center" fow="500">
          Already have an account?{" "}
          <Link href="/signin" asChild>
            <Text color="$green8" fow="500" hitSlop={12}>
              Sign in
            </Text>
          </Link>
        </Text>
      </YStack>
    </SafeArea>
  );
};

export default Signup;
