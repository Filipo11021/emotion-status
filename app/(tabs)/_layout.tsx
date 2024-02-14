import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Auth } from "@/shared/auth/core";
import { Navigate } from "@/shared/auth/expo";
import { Text } from "react-native-ui-lib";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Auth
      onForbidden={() => <Navigate type="replace" href="/auth/" />}
      type="protected"
    >
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: "Your status",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="address-card-o" color={color} />
            ),
            tabBarItemStyle: { paddingBottom: 5 },
          }}
        />
        <Tabs.Screen
          name="global-emotions"
          options={{
            title: "Global Emotions",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="globe" color={color} />
            ),
            headerRight: () => (
              <Link style={{ marginRight: 15 }} href="/create-status-modal">
                <Text $textPrimary>Emote your emotion</Text>
              </Link>
            ),
            tabBarItemStyle: { paddingBottom: 5 },
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
            tabBarItemStyle: { paddingBottom: 5 },
          }}
        />
      </Tabs>
    </Auth>
  );
}
