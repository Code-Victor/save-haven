import { walletRouter } from "@/api/routers";
import { WalletDetailsResponse } from "@/api/types";
import { Skeleton } from "@/components/Skeleton";
import { Button, Icon, Text, UnifiedIconName } from "@/components/base";
import { color } from "@/config/colors";
import { monify } from "@/utils";
import Color from "color";
import * as Clipboard from "expo-clipboard";
import { Link } from "expo-router";
import * as React from "react";
import { Share } from "react-native";
import { toast } from "sonner-native";
import { Sheet, View, XStack, YStack, useTheme } from "tamagui";

type TransactionVariant = "sent" | "received" | "failed";
export function TransactionItem(props: {
  variant: "sent" | "received" | "failed";
  date: string;
  amount: number;
  channel: string;
}) {
  const theme = useTheme();
  const icons = {
    sent: "ri:arrow-right-up-line",
    received: "ri:arrow-left-down-line",
    failed: "ri:error-warning-line",
  } as const satisfies Record<TransactionVariant, UnifiedIconName>;
  const colors = {
    sent: theme.green6.val,
    received: theme.purple6.val,
    failed: "#FF0000",
  } as const satisfies Record<TransactionVariant, string>;
  return (
    <XStack ai="center" gap="$4" py="$1.5">
      <View
        h={40}
        w={40}
        ai="center"
        jc="center"
        br={20}
        bg={Color(colors[props.variant]).alpha(0.1).string()}
      >
        <Icon
          name={icons[props.variant]}
          color={colors[props.variant]}
          size={24}
        />
      </View>
      <YStack f={1}>
        <Text fos="$2" color="$black1" fow="500">
          {props.channel}
        </Text>
        <Text color="$black6" fos="$1">
          {new Date(props.date).toLocaleDateString("en", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })}
        </Text>
      </YStack>
      <Text fow="500">{monify(props.amount)}</Text>
    </XStack>
  );
}
