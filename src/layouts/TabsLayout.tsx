import { Platform } from "react-native";
import { Tabs } from "expo-router/tabs";
import { getTokens, YStack } from "tamagui";

import { Text } from "@/components/base";
import { RemixIcon } from "@/components/base/Icon";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: getTokens().color["$brand.primary"].val,
        tabBarInactiveTintColor: getTokens().color["$neutral.gray3"].val,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 78 : 64,
          paddingBottom: 4,
        },
        tabBarLabelStyle: {
          fontFamily: "gilroyMedium",
          fontSize: 12,
        },
        tabBarItemStyle: {
          height: 54,
          alignSelf: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: "/",
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <RemixIcon
              name={focused ? "home-fill" : "home-line"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          href: "/shop",
          title: "Shop",
          tabBarBadge: "New",
          tabBarIcon: ({ color, focused }) => (
            <RemixIcon
              name={focused ? "shopping-bag-4-fill" : "shopping-bag-4-line"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          href: "/orders",
          title: "Orders",
          tabBarIcon: ({ color, focused }) => (
            <RemixIcon
              name={
                focused ? "calendar-schedule-fill" : "calendar-schedule-line"
              }
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: "/profile",
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <RemixIcon
              name={focused ? "user-3-fill" : "user-3-line"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
