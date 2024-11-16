import { authRouter } from "@/api/routers";
import {
  Button,
  Icon,
  IconButton,
  Input,
  SafeArea,
  Text,
} from "@/components/base";
import { useStore } from "@/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner-native";
import { View, YStack } from "tamagui";
import { z } from "zod";

const signinFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
type SigninFormSchema = z.infer<typeof signinFormSchema>;
const Signin = () => {
  const router = useRouter();
  const saveUser = useStore((state) => state.saveUser);
  const { mutate, isPending } = authRouter.userLogin.useMutation({
    onSuccess: (data) => {
      router.push("/(protected)/(tabs)");
      saveUser(data.data);
      toast.success(data.message);
    },
    onError: () => {
      toast.error("An error occurred");
    },
  });
  const { control, handleSubmit } = useForm<SigninFormSchema>({
    resolver: zodResolver(signinFormSchema),
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const toggleShowPassword = React.useCallback(
    () => setShowPassword((prev) => !prev),
    []
  );
  const onSubmit = React.useCallback((data: SigninFormSchema) => {
    mutate(data);
  }, []);
  return (
    <SafeArea flex={1} bg="$background">
      <View ai="center" jc="center">
        <Icon name="save-haven-emblem" size={160} />
      </View>
      <YStack gap="$9" px="$5" f={1}>
        <Text ff="$gilroy" fow="600" fos="$7" ta="center" color="$purple6">
          Welcome Back
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
                    placeholder="Enter your email"
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
                        name={!showPassword ? "ri:eye-line" : "ri:eye-off-line"}
                        size={24}
                      />
                    </IconButton.Icon>
                  </IconButton>
                </Input.Box>
                {errors.password ? (
                  <Input.SubText error>{errors.password.message}</Input.SubText>
                ) : null}
              </Input>
            )}
          />
        </YStack>
      </YStack>
      <YStack py="$11" gap="$3" px="$4">
        <Button
          loading={isPending}
          variant="primary"
          onPress={handleSubmit(onSubmit)}
          full
        >
          <Button.Text>Sign in</Button.Text>
        </Button>
        <Text ta="center" fow="500">
          Don’t have an account?{" "}
          <Link href="/(auth)/signup" asChild>
            <Text color="$green8" fow="500" hitSlop={12}>
              Sign up
            </Text>
          </Link>
        </Text>
      </YStack>
    </SafeArea>
  );
};

export default Signin;
