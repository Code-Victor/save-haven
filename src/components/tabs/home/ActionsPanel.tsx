import { Icon, Text, UnifiedIconName } from "@/components/base";
import { Href, Link } from "expo-router";
import { View, XStack, YStack } from "tamagui";
const actions = [
  {
    name: "Target Savings",
    icon: "target-saving",
    href: "/(protected)/target-savings",
  },
  {
    name: "Group Savings",
    icon: "group-saving",
    href: "/(protected)/group-savings",
  },
  {
    name: "Crowdfunding",
    icon: "crowdfunding",
    href: "/(protected)/crowdfunding",
  },
  {
    name: "Subscription",
    icon: "subscription",
    comingSoon: true,
    href: "/(protected)/(tabs)/",
  },
] satisfies {
  name: string;
  icon: UnifiedIconName;
  href: Href;
  comingSoon?: boolean;
}[];

export function ActionsPanel() {
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
    <Link href={props.href} asChild>
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
    </Link>
  );
}
