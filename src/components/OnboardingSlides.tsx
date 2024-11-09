import { useCallback, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  useWindowDimensions,
  ViewToken,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Image, View, XStack, useTheme } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/base";
import { onboardingSlides } from "@/data/onboarding";

import { isNonEmptyArray } from "@/utils";
const AnimatedView = Animated.createAnimatedComponent(View);
type SlideItem = (typeof onboardingSlides)[0];

const SLIDE_DURATION = 5000;
export function OnboardingSlides() {
  const safeAreaInsets = useSafeAreaInsets();

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList | null>(null);
  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<any>[] }) => {
      if (isNonEmptyArray(viewableItems)) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  useFocusEffect(
    useCallback(() => {
      if (flatListRef.current) {
        const interval = setInterval(() => {
          const newIndex =
            currentIndex === onboardingSlides.length - 1 ? 0 : currentIndex + 1;
          setCurrentIndex(newIndex);
          flatListRef.current?.scrollToIndex({
            index: newIndex,
            animated: true,
          });
        }, SLIDE_DURATION);
        return () => clearInterval(interval);
      }
    }, [currentIndex])
  );
  return (
    <View f={1} ai="center" gap={24}>
      <FlatList
        data={onboardingSlides}
        ref={flatListRef}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        renderItem={({ item }) => <OnboardingSlideItem item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
      />
      <Paginator data={onboardingSlides} scrollX={scrollX} />
    </View>
  );
}

function OnboardingSlideItem({ item }: { item: SlideItem }) {
  const { width } = useWindowDimensions();
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View f={1} gap={24} width={width}>
      <View
        pt={safeAreaInsets.top}
        bg="$purple6"
        ai="center"
        jc="center"
        py="$4"
        f={1}
      >
        <Image
          source={item.image}
          aspectRatio={item.aspectRatio}
          height="100%"
          maxWidth="80%"
          objectFit="contain"
        />
      </View>
      <View gap={8} ai="center" jc="center" px={24}>
        <Text ta="center" fos="$7" fow="600" color="$purple6" ff="$gilroy">
          {item.title}
        </Text>
        <Text ta="center" color="$black4" fontFamily="$dmSans" fow="400">
          {item.description}
        </Text>
      </View>
    </View>
  );
}

function Paginator({
  data,
  scrollX,
}: {
  data: SlideItem[];
  scrollX: Animated.Value;
}) {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  return (
    <XStack gap={4}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [16, 40, 16],
          extrapolate: "clamp",
        });
        const dotColor = scrollX.interpolate({
          inputRange,
          outputRange: [theme.white8.val, theme.purple9.val, theme.white8.val],
          extrapolate: "clamp",
        });
        return (
          <AnimatedView
            key={i}
            h={4}
            br="$4"
            style={{
              width: dotWidth,
              backgroundColor: dotColor,
            }}
          />
        );
      })}
    </XStack>
  );
}
