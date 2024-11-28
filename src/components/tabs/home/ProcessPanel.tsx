import { Icon, Text, UnifiedIconName } from "@/components/base";
import { Href, Link } from "expo-router";
import { FlatList, ListRenderItem } from "react-native";
import { View, XStack, YStack, useTheme } from "tamagui";
import * as React from "react";

const ITEM_WIDTH = 308;
export function ProcessPanel() {
  const data = React.useMemo(() => {
    const steps = [
      "Create your transaction pin",
      "Complete your KYC to increase your credit limit",
    ];
    return steps.map((step, i) => ({
      step,
      onPress: () => {},
      theme: i % 2 === 0 ? "purple" : ("green" as "purple" | "green"),
    }));
  }, []);
  const renderItem: ListRenderItem<(typeof data)[number]> = React.useCallback(
    ({ item }) => <ProcessItem {...item} />,
    []
  );
  const snapToOffsets = React.useMemo(() => {
    const offsets: number[] = [];
    for (let i = 0; i < data.length; i++) {
      offsets.push(i * (ITEM_WIDTH + 20));
    }
    return offsets;
  }, [data.length]);
  return (
    <YStack mt="$5" gap="$2.5">
      <Text fos="$2" color="$black9" fow="600" px="$4">
        Finish Process
      </Text>
      <FlatList
        horizontal
        contentContainerStyle={{
          gap: 20,
          paddingHorizontal: 16,
        }}
        data={data}
        renderItem={renderItem}
        // scroll snapping
        snapToInterval={ITEM_WIDTH + 20}
        decelerationRate="fast"
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        snapToOffsets={snapToOffsets}
      />
    </YStack>
  );
}

function ProcessItem({
  step,
  onPress,
  theme,
}: {
  step: string;
  onPress?: () => void;
  theme: "purple" | "green";
}) {
  const tmTheme = useTheme();
  return (
    <XStack
      bg="$white1"
      px="$4"
      py="$3"
      gap="$2"
      br={16}
      ai="center"
      w={ITEM_WIDTH}
      onPress={onPress}
    >
      <Icon
        name="ri:error-warning-fill"
        size={32}
        color={theme === "green" ? tmTheme.green6.val : tmTheme.purple6.val}
      />
      <View f={1}>
        <Text fow="500" color="$purple6" numberOfLines={2}>
          {step}
        </Text>
      </View>

      <Icon
        name="ri:arrow-right-s-line"
        size={24}
        color={tmTheme.purple6.val}
      />
    </XStack>
  );
}
