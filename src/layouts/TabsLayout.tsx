import { Platform } from "react-native";
import { Tabs } from "expo-router/tabs";
import { getTokens, useTheme, YStack } from "tamagui";

import { Text } from "@/components/base";
import { Icon } from "@/components/base/Icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TABBAR_HEIGHT, TABBAR_OFFSET } from "@/constants";

export default function TabsLayout() {
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.white1.val,
        tabBarInactiveTintColor: theme.white10.val,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "gilroySemibold",
        },
        tabBarStyle: {
          height: TABBAR_HEIGHT,
          paddingBottom: 4,
          position: "absolute",
          bottom: bottom + TABBAR_OFFSET,
          width: "90%",
          marginHorizontal: "5%",
          borderRadius: 16,
          borderTopColor: "transparent",
          backgroundColor: theme.purple6.val,
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
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? "ri:home-fill" : "ri:home-line"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="savings"
        options={{
          href: "/savings",
          title: "Savings",

          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? "ri:bank-fill" : "ri:bank-line"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          href: "/history",
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? "ri:history-fill" : "ri:history-line"}
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
            <Icon
              name={focused ? "ri:user-6-fill" : "ri:user-6-line"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
