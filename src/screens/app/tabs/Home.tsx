import {
  Button,
  Icon,
  IconButton,
  SafeArea,
  Text,
  UnifiedIconName,
} from "@/components/base";
import { ListItem, useTheme, View, XStack, YStack } from "tamagui";
import { Image } from "expo-image";
import { monify } from "@/utils";
import { color } from "@/config/colors";
import Color from "color";

export default function HomeTab() {
  return (
    <SafeArea bg="$white2" px="$4">
      <ProfilePanel />
      <WalletPanel />
      <ActionsPanel />
    </SafeArea>
  );
}

function ProfilePanel() {
  return (
    <XStack bg="$white1" px="$3" gap="$4" mt="$4" ai="center" h="$6" br={16}>
      <Image
        source={"https://avatars.githubusercontent.com/u/47269261?v=4"}
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
      <View f={1}>
        <Text fow="500" color="#333333">
          Hello, John Doe
        </Text>
      </View>
      <XStack gap="$1">
        <IconButton rounded="pill" size="md" variant="ghost">
          <IconButton.Icon>
            <Icon name="ri:customer-service-2-fill" size={22} />
          </IconButton.Icon>
        </IconButton>
        <IconButton rounded="pill" size="md" variant="ghost">
          <IconButton.Icon>
            <Icon name="ri:notification-3-fill" size={22} />
          </IconButton.Icon>
        </IconButton>
      </XStack>
    </XStack>
  );
}

function WalletPanel() {
  return (
    <YStack bg="$white1" gap="$3" mt="$4" pb="$4" br={16}>
      <YStack bg="$purple6" br={16} py="$4.5" px="$4" gap="$4">
        <YStack gap="$1">
          <Text fow="500" color="$white1">
            Wallet Balance
          </Text>
          <Text fow="500" fos="$7" color="$white1">
            {monify(1000000)}
          </Text>
        </YStack>
        <XStack
          ai="center"
          jc="space-between"
          px="$4"
          py="$1.5"
          bg="$white025"
          br={16}
        >
          <Text fow="600" color="$white1">
            John Doe
          </Text>
          <XStack ai="center" gap="$2">
            <Text color="$white1">8067624207</Text>
            <Icon name="ri:file-copy-fill" color={color.white1} size={24} />
          </XStack>
        </XStack>
      </YStack>
      <YStack gap="$2">
        <XStack jc="space-between" ai="center" px="$3">
          <Text fow="500">Recent Transactions</Text>
          <Button variant="ghost" size="sm">
            <Button.Text>See all</Button.Text>
          </Button>
        </XStack>
        <YStack>
          <TransactionItem variant="sent" />
          <TransactionItem variant="received" />
          <TransactionItem variant="failed" />
        </YStack>
      </YStack>
      <XStack gap="$6" px="$3">
        <Button f={1}>
          <Button.Icon>
            <Icon name="ri:arrow-right-up-line" size={24} />
          </Button.Icon>
          <Button.Text>Withdraw</Button.Text>
        </Button>
        <Button f={1}>
          <Button.Icon>
            <Icon name="ri:add-circle-fill" size={24} />
          </Button.Icon>
          <Button.Text>Fund Wallet</Button.Text>
        </Button>
      </XStack>
    </YStack>
  );
}
type TransactionVariant = "sent" | "received" | "failed";
function TransactionItem(props: { variant: "sent" | "received" | "failed" }) {
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
    <XStack px="$3" ai="center" gap="$4" py="$1.5">
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
          Saved to Target Saving
        </Text>
        <Text color="$black6" fos="$1">
          {new Date().toLocaleDateString("en", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })}
        </Text>
      </YStack>
      <Text fow="500">{monify(1000000)}</Text>
    </XStack>
  );
}

const actions = [
  {
    name: "Target Savings",
    icon: "target-saving",
  },
  {
    name: "Group Savings",
    icon: "group-saving",
  },
  {
    name: "Crowdfunding",
    icon: "crowdfunding",
  },
  {
    name: "Subscription",
    icon: "subscription",
    comingSoon: true,
  },
] satisfies { name: string; icon: UnifiedIconName; comingSoon?: boolean }[];

function ActionsPanel() {
  return (
    <YStack mt="$4" gap="$3">
      <Text fos="$4" fow="600">
        Take Action
      </Text>
      <XStack>
        {actions.map((action) => (
          <ActionItem key={action.name} {...action} />
        ))}
      </XStack>
    </YStack>
  );
}
function ActionItem(props: (typeof actions)[0]) {
  const comingSoon = props.comingSoon;
  return (
    <YStack
      gap="$2"
      f={1}
      ai="center"
      br="$4"
      px="$1"
      py="$2"
      pos="relative"
      animation="bouncy"
      transform={[{ scale: 1 }]}
      pressStyle={{
        transform: [
          {
            scale: 0.96,
          },
        ],
      }}
      disabled={comingSoon}
    >
      <View
        bg="$white1"
        aspectRatio={1}
        width="70%"
        borderRadius={9999}
        ai="center"
        jc="center"
        opacity={comingSoon ? 0.5 : 1}
      >
        <Icon name={props.icon} size={28} />
      </View>
      <Text fow="500" fos="$1" ta="center" opacity={comingSoon ? 0.5 : 1}>
        {props.name}
      </Text>
      {props.comingSoon && (
        <Text
          color="$black6"
          pos="absolute"
          top="50%"
          fow="600"
          transform={[
            // { translateY: -(12 * 1.3) },
            {
              rotate: "-45deg",
            },
          ]}
          fos="$1"
        >
          Coming Soon
        </Text>
      )}
    </YStack>
  );
}
