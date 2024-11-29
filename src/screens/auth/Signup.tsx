import { authRouter } from "@/api/routers";
import {
  Button,
  Icon,
  IconButton,
  Input,
  SafeArea,
  Text,
} from "@/components/base";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner-native";
import { View, YStack } from "tamagui";
import { z } from "zod";
import { handleError } from "@/utils";
import {
  KeyboardAwareScrollView,
  KeyboardGestureArea,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { LayoutChangeEvent } from "react-native";

const signupFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    phoneNumber: z.string().min(10, "Phone number is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type SignupFormSchema = z.infer<typeof signupFormSchema>;
const Signup = () => {
  const [footerHeight, setFooterHeight] = React.useState(0);
  const { mutate, isPending } = authRouter.onboardUser.useMutation({
    onSuccess: (data) => {
      toast.success("Check your email for OTP");
      router.push({
        pathname: "/(auth)/verify-email",
        params: {
          email: data.data.email,
        },
      });
    },
    onError: handleError(),
  });
  const router = useRouter();
  const { control, handleSubmit } = useForm<SignupFormSchema>({
    resolver: zodResolver(signupFormSchema),
  });
  const handleLayout = React.useCallback((evt: LayoutChangeEvent) => {
    setFooterHeight(evt.nativeEvent.layout.height);
  }, []);
  const onSubmit = React.useCallback((data: SignupFormSchema) => {
    mutate({
      name: data.name,
      email: data.email,
      telephone_no: data.phoneNumber,
      password: data.password,
      confirm_password: data.confirmPassword,
    });
  }, []);
  return (
    <KeyboardGestureArea
      interpolator="ios"
      style={{
        flex: 1,
        gap: 24,
      }}
    >
      <SafeArea flex={1} bg="$background">
        <View f={1}>
          <KeyboardAwareScrollView
            bottomOffset={24 + footerHeight}
            keyboardShouldPersistTaps="handled"
          >
            <View ai="center" jc="center">
              <Icon name="save-haven-emblem" size={160} />
            </View>
            <YStack gap="$9" px="$5" f={1}>
              <Text
                ff="$gilroy"
                fow="600"
                fos="$7"
                ta="center"
                color="$purple6"
              >
                Create account
              </Text>
              <YStack gap="$4">
                <Controller
                  control={control}
                  name="name"
                  render={({
                    field: { onBlur, value, onChange },
                    formState: { errors },
                  }) => (
                    <Input variant="grey" size="md" minWidth="100%">
                      <Input.Label mb="$1.5">Name</Input.Label>
                      <Input.Box>
                        <Input.Area
                          placeholder="Doe"
                          onChangeText={onChange}
                          {...{ onBlur, value }}
                        />
                      </Input.Box>
                      {errors.name ? (
                        <Input.SubText error>
                          {errors.name.message}
                        </Input.SubText>
                      ) : null}
                    </Input>
                  )}
                />
                <Controller
                  control={control}
                  name="email"
                  render={({
                    field: { onBlur, value, onChange },
                    formState: { errors },
                  }) => (
                    <Input variant="grey" size="md" minWidth="100%">
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
                        <Input.SubText error>
                          {errors.email.message}
                        </Input.SubText>
                      ) : null}
                    </Input>
                  )}
                />
                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({
                    field: { onBlur, value, onChange },
                    formState: { errors },
                  }) => (
                    <Input variant="grey" size="md" minWidth="100%">
                      <Input.Label mb="$1.5">Phone Number</Input.Label>
                      <Input.Box>
                        <Input.Area
                          placeholder="+234 123 456 7890"
                          onChangeText={onChange}
                          keyboardType="phone-pad"
                          {...{ onBlur, value }}
                        />
                      </Input.Box>
                      {errors.phoneNumber ? (
                        <Input.SubText error>
                          {errors.phoneNumber.message}
                        </Input.SubText>
                      ) : null}
                    </Input>
                  )}
                />
                <Controller
                  control={control}
                  name="password"
                  render={({
                    field: { onBlur, value, onChange },
                    formState: { errors },
                  }) => (
                    <Input variant="grey" size="md">
                      <Input.Label mb="$1.5">Password</Input.Label>
                      <Input.Password
                        onChangeText={onChange}
                        {...{ onBlur, value }}
                      />
                      {errors.password ? (
                        <Input.SubText error>
                          {errors.password.message}
                        </Input.SubText>
                      ) : null}
                    </Input>
                  )}
                />
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({
                    field: { onBlur, value, onChange },
                    formState: { errors },
                  }) => (
                    <Input variant="grey" size="md">
                      <Input.Label mb="$1.5">Confirm Password</Input.Label>
                      <Input.Password
                        onChangeText={onChange}
                        {...{ onBlur, value }}
                      />
                      {errors.confirmPassword ? (
                        <Input.SubText error>
                          {errors.confirmPassword.message}
                        </Input.SubText>
                      ) : null}
                    </Input>
                  )}
                />
              </YStack>
            </YStack>
          </KeyboardAwareScrollView>
        </View>
        <YStack py="$11">
          <KeyboardStickyView
            offset={{
              opened: 90,
            }}
          >
            <YStack pb="$3" px="$4" bg="$background" onLayout={handleLayout}>
              <Button
                loading={isPending}
                variant="primary"
                onPress={handleSubmit(onSubmit)}
                full
              >
                <Button.Text>Create Account</Button.Text>
              </Button>
            </YStack>
          </KeyboardStickyView>
          <Text ta="center" fow="500">
            Already have an account?{" "}
            <Link href="/(auth)/signin" asChild>
              <Text color="$green8" fow="500" hitSlop={12}>
                Sign in
              </Text>
            </Link>
          </Text>
        </YStack>
      </SafeArea>
    </KeyboardGestureArea>
  );
};

export default Signup;
