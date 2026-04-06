import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Platform, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useStore } from "@/lib/store-context";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;
  const { cart } = useStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "السلة",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>
              🛒
            </Text>
          ),
          tabBarBadge: cart.length > 0 ? cart.length : undefined,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "الملف الشخصي",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>
              👤
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
