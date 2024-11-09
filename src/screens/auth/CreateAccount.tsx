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
import { LayoutChangeEvent } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardGestureArea,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { ScrollView, View, YStack } from "tamagui";
import { z } from "zod";

const formSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });
type FormSchema = z.infer<typeof formSchema>;
const CreateAccount = () => {
  const [footerHeight, setFooterHeight] = React.useState(0);
  const { control, handleSubmit } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const toggleShowPassword = React.useCallback(
    () => setShowPassword((prev) => !prev),
    []
  );
  const handleLayout = React.useCallback((evt: LayoutChangeEvent) => {
    setFooterHeight(evt.nativeEvent.layout.height);
  }, []);
  const onSubmit = (data: FormSchema) => {
    console.log(data);
  };
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
          <KeyboardAwareScrollView bottomOffset={24 + footerHeight}>
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
                Finish creating account
              </Text>
              <YStack gap="$4">
                <Controller
                  control={control}
                  name="firstName"
                  render={({
                    field: { onBlur, value, onChange },
                    formState: { errors },
                  }) => (
                    <Input size="md" minWidth="100%">
                      <Input.Label mb="$1.5">First Name</Input.Label>
                      <Input.Box>
                        <Input.Area
                          placeholder="John"
                          onChangeText={onChange}
                          {...{ onBlur, value }}
                        />
                      </Input.Box>
                      {errors.firstName ? (
                        <Input.SubText error>
                          {errors.firstName.message}
                        </Input.SubText>
                      ) : null}
                    </Input>
                  )}
                />
                <Controller
                  control={control}
                  name="lastName"
                  render={({
                    field: { onBlur, value, onChange },
                    formState: { errors },
                  }) => (
                    <Input size="md" minWidth="100%">
                      <Input.Label mb="$1.5">Last Name</Input.Label>
                      <Input.Box>
                        <Input.Area
                          placeholder="Doe"
                          onChangeText={onChange}
                          {...{ onBlur, value }}
                        />
                      </Input.Box>
                      {errors.lastName ? (
                        <Input.SubText error>
                          {errors.lastName.message}
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
                    <Input size="md" minWidth="100%">
                      <Input.Label mb="$1.5">Phone Number</Input.Label>
                      <Input.Box>
                        <Input.Area
                          placeholder="+1 123 456 7890"
                          onChangeText={onChange}
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
                  name="address"
                  render={({
                    field: { onBlur, value, onChange },
                    formState: { errors },
                  }) => (
                    <Input size="md" minWidth="100%">
                      <Input.Label mb="$1.5">Home Address</Input.Label>
                      <Input.Box>
                        <Input.Area
                          placeholder="Main Street, 123"
                          onChangeText={onChange}
                          {...{ onBlur, value }}
                        />
                      </Input.Box>
                      {errors.address ? (
                        <Input.SubText error>
                          {errors.address.message}
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
                    <Input size="md">
                      <Input.Label mb="$1.5">Password</Input.Label>
                      <Input.Box>
                        <Input.Area
                          placeholder="••••••••"
                          onChangeText={onChange}
                          secureTextEntry={!showPassword}
                          {...{ onBlur, value }}
                        />
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onPress={toggleShowPassword}
                        >
                          <IconButton.Icon>
                            <Icon
                              name={
                                !showPassword
                                  ? "ri:eye-line"
                                  : "ri:eye-off-line"
                              }
                              size={24}
                            />
                          </IconButton.Icon>
                        </IconButton>
                      </Input.Box>
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
                    <Input size="md">
                      <Input.Label mb="$1.5">Confirm Password</Input.Label>
                      <Input.Box>
                        <Input.Area
                          placeholder="••••••••"
                          onChangeText={onChange}
                          secureTextEntry={!showPassword}
                          {...{ onBlur, value }}
                        />
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onPress={toggleShowPassword}
                        >
                          <IconButton.Icon>
                            <Icon
                              name={
                                !showPassword
                                  ? "ri:eye-line"
                                  : "ri:eye-off-line"
                              }
                              size={24}
                            />
                          </IconButton.Icon>
                        </IconButton>
                      </Input.Box>
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

        <KeyboardStickyView
          offset={{
            opened: 30,
          }}
        >
          <YStack
            gap="$3"
            px="$4"
            pb="$6"
            bg="$background"
            onLayout={handleLayout}
          >
            <Button variant="primary" onPress={handleSubmit(onSubmit)} full>
              <Button.Text>Create Account</Button.Text>
            </Button>
          </YStack>
        </KeyboardStickyView>
      </SafeArea>
    </KeyboardGestureArea>
  );
};

export default CreateAccount;
