import { useSignOut } from "@/shared/auth/expo";
import { Button, View } from "react-native-ui-lib";

export default function SettingsView() {
  const signOut = useSignOut();
  return (
    <View padding-8>
      <Button onPress={() => signOut.mutate({})} padding-4 label="Sign Out" />
    </View>
  );
}
