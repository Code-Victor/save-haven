import { Icon, Text, UnifiedIconName } from "@/components/base";
import { monify } from "@/utils";
import Color from "color";
import { View, XStack, YStack, useTheme } from "tamagui";

type TransactionVariant = "sent" | "received";
export function TransactionItem(props: {
  variant: "sent" | "received";
  date: string;
  amount: number;
  channel: string;
}) {
  const theme = useTheme();
  const icons = {
    sent: "ri:arrow-right-up-line",
    received: "ri:arrow-left-down-line",
    // failed: "ri:error-warning-line",
  } as const satisfies Record<TransactionVariant, UnifiedIconName>;
  const colors = {
    sent: "#FF3B30",
    received: "#468C3F",
    // failed: "#FF0000",
  } as const satisfies Record<TransactionVariant, string>;
  const lightColor = Color(colors[props.variant]).alpha(0.1).string();
  return (
    <XStack ai="center" gap="$4" py="$1.5">
      <View h={40} w={40} ai="center" jc="center" br={20} bg={lightColor}>
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
      <YStack gap="$2">
        <Text fow="500">{monify(props.amount)}</Text>
        <View bg={lightColor} px="$2" py="$0.5" br="$8" alignSelf="flex-start">
          <Text color={colors[props.variant]} fos="$1" fow="500">
            {props.variant === "sent" ? "Withdraw" : "Deposit"}
          </Text>
        </View>
      </YStack>
    </XStack>
  );
}
