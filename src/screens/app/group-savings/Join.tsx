import { groupSavingsRouter } from "@/api/routers";
import type { Member } from "@/api/types";
import { SafeArea } from "@/components/base";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { YStack, useTheme, Spinner, XStack, Text } from "tamagui";
import { FlatList, ListRenderItem } from "react-native";
import * as React from "react";
import { getAvatar, handleError } from "@/utils";
import { useStore } from "@/stores";
import { Image } from "expo-image";
import { useQueryClient } from "@tanstack/react-query";

// #region Target Savings
export default function JoinGroupSavings() {
  const router = useRouter();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const user = useStore((s) => s.user!);
  const { ref } = useLocalSearchParams<{ ref: string }>();
  const safeAreaInsets = useSafeAreaInsets();
  const { mutate, isPending, isError } = groupSavingsRouter.join.useMutation({
    onError: handleError(),
    onSuccess: () => {
      return queryClient
        .invalidateQueries(groupSavingsRouter.getAll.getOptions())
        .then(() => {
          router.replace("/group-savings/all");
        });
    },
  });

  React.useEffect(() => {
    mutate({ reference: ref });
  }, [ref]);
  return (
    <>
      <Stack.Screen
        options={{
          title: "Group Savings Members",
        }}
      />

      <SafeArea f={1} px="$5" edges={["left", "right", "bottom"]} bg="$white2">
        <YStack mt="$3.5" bg="$white1" f={1} br={16}>
          {isPending && (
            <YStack f={1} ai="center" jc="center">
              <Spinner size="large" scale={1.5} color="$purple6" />
            </YStack>
          )}
          {isError && (
            <YStack f={1} ai="center" jc="center">
              <Text color="red" fow="500">
                An Error Occured, Try again
              </Text>
            </YStack>
          )}
        </YStack>
      </SafeArea>
    </>
  );
}
