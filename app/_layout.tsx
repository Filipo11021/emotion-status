import { CreateStatusProvider } from "@/features/create-status/public-api";
import { SupabaseAuthProvider } from "@/shared/auth/core";
import { supabase } from "@/shared/supabase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Link, Stack, useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Text } from "react-native-ui-lib";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider supabaseClient={supabase}>
        <CreateStatusProvider>
          <RootLayoutNav />
        </CreateStatusProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const { goBack } = useNavigation();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="create-status-modal"
        options={{
          presentation: "modal",
          headerBackVisible: true,
          headerTitle: "Emote your emotions",
        }}
      />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
    </Stack>
  );
}
