import { useOAuth } from "@/shared/auth/expo";
import { Button, Text, View } from "react-native-ui-lib";

export default function AuthPage() {
  const oauth = useOAuth();

  return (
    <View center flex style={{ gap: 20 }}>
			<Text text30>Welcome to</Text>
			<Text text30>Emotion Status</Text>
      <Button
        onPress={() => oauth.mutate({ provider: "discord" })}
        label="Login With Discord"
        disabled={oauth.isPending}
      />
      <Button
        onPress={() => oauth.mutate({ provider: "github" })}
        label="Login With GitHub"
        disabled={oauth.isPending}
        backgroundColor="black"
      />
      {oauth.isError && <Text marginT-10={true}>{oauth.error.message}</Text>}
    </View>
  );
}
