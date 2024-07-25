import { useSignOut } from "@/shared/auth/expo";
import { Button, View } from "react-native-ui-lib";

export function Settings() {
  const signOut = useSignOut();
  return (
    <View>
      <Button onPress={() => signOut.mutate({})} padding-4 label="Sign Out" />
    </View>
  );
}
